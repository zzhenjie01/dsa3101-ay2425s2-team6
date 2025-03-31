from deepeval.test_case import LLMTestCase
from deepeval.metrics import FaithfulnessMetric, ContextualPrecisionMetric
import requests
import json
import pandas as pd

'''
Given a question, ground truth,
post the question to the model and evaluate the Faithfulness
and context precision between ground truth and model response
'''
def evaluate_testcase(esg_model_qna_url, question, ground_truth, eval_metric, type_of_tc):
    evaluator_dict = {
        'faithfulness' : FaithfulnessMetric(),
        'context_precision' : ContextualPrecisionMetric()
    }
    #check for valid metric (faithfulness or context_precision)
    if eval_metric not in evaluator_dict.keys():
        raise Exception('No such metric')
    evaluator = evaluator_dict[eval_metric]
    #pass context and question to model to generate response
    response_dict = requests.post(esg_model_qna_url, json = {
        "question": question
    }).json()
    #initialise test case depending on chosen metric
    test_cases = {
        'faithfulness': LLMTestCase(input = question,
                                    actual_output=response_dict['llm_response'],
                                    retrieval_context=[response_dict['retrieved_context']]),
        'context_precision': LLMTestCase(input = question,
                                            actual_output=response_dict['llm_response'],
                                            retrieval_context=[response_dict['retrieved_context']],
                                            expected_output=ground_truth)
    }
    test_case = test_cases[eval_metric]
    evaluator.measure(test_case)
    print(question)
    eval_score, eval_reason = evaluator.score, evaluator.reason
    return [eval_metric, type_of_tc, 
            question, response_dict['retrieved_context'], response_dict['llm_response'], ground_truth, 
            eval_score, eval_reason]

'''
Code runs all test cases from all .json file found inside
TC_FOLDER_DIR and saves the result as a Pandas DF.
'''
def process_file(filename, TC_FOLDER_DIR, ESG_MODEL_METRIC_EXTRACTION_URL):
    results = []
    with open(f'{TC_FOLDER_DIR}{filename}') as json_file:
        data = json.load(json_file)
    for qn_ground_truth_pair in data:
        qn, ground_truth = qn_ground_truth_pair['question'], qn_ground_truth_pair['ground_truth']
        for eval_metric in ['faithfulness', 'context_precision']:
            type_of_tc = filename.replace('.json', '')
            task = evaluate_testcase(ESG_MODEL_METRIC_EXTRACTION_URL, qn, ground_truth, eval_metric, type_of_tc)
            results.append(task)
    return pd.DataFrame(results, columns = ['eval_metric', 'type_of_tc', 'question', 
                                    'retrieved_context', 'llm_response', 'ground_truth', 
                                    'eval_score', 'eval_reason'])
import pandas as pd
from deepeval.test_case import LLMTestCase
from deepeval.metrics import FaithfulnessMetric, ContextualPrecisionMetric
import requests
import json
from dotenv import load_dotenv
import os

load_dotenv()
ESG_MODEL_METRIC_EXTRACTION_URL = os.getenv('ESG_MODEL_METRIC_EXTRACTION_URL')
def evaluate_testcase(esg_model_qna_url, question, ground_truth, eval_metric):
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
    evaluator.a_measure(test_case)
    return evaluator, response_dict['llm_response'], response_dict['retrieved_context']

quantitative_text_singlechunk = 'evaluation_data/quantitative_text_singlechunk.json'
quantitative_nonmachinereadable = 'evaluation_data/quantitative_nonmachinereadable.json'
quantitative_text_multichunk = 'evaluation_data/quantitative_text_multichunk.json'
qualitative_text_singlechunk = 'evaluation_data/qualitative_text_singlechunk.json'
qualitative_nonmachinereadable = 'evaluation_data/qualitative_nonmachinereadable.json'

lst_of_tc_jsons = [quantitative_text_singlechunk, quantitative_nonmachinereadable, quantitative_text_multichunk, qualitative_text_singlechunk, qualitative_nonmachinereadable]

final_df = []
for tc_json in lst_of_tc_jsons:
    with open(quantitative_text_singlechunk) as json_file:
        data = json.load(json_file)
    for qn_ground_truth_pair in data:
        qn, ground_truth = qn_ground_truth_pair['question'], qn_ground_truth_pair['ground_truth']
        for eval_metric in ['faithfulness', 'context_precision']:
            a = evaluate_testcase(ESG_MODEL_METRIC_EXTRACTION_URL, qn, ground_truth, eval_metric)
            evaluator_res, llm_response, retrieved_context = evaluate_testcase(ESG_MODEL_METRIC_EXTRACTION_URL, qn, ground_truth, eval_metric)
            eval_score, eval_reason = evaluator_res.score, evaluator_res.reason
            type_of_tc = tc_json.replace('.json', '')
            final_df.append([type_of_tc, eval_metric, qn, retrieved_context, llm_response, ground_truth, eval_score, eval_reason])


pd.DataFrame(final_df, columns = ['type_of_tc', 'eval_metric', 'question', 
                                  'retrieved_context', 'llm_response', 'ground_truth', 
                                  'eval_score', 'eval_reason']).to_csv('test_case_evaluation_results.csv', index = False)
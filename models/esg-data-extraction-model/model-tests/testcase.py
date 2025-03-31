import pandas as pd
import importlib.util
import sys
import os
import json
from deepeval.test_case import LLMTestCase
from deepeval.metrics import FaithfulnessMetric, ContextualPrecisionMetric




rag_engine_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data-pipelines', 'rag-engine.py'))

# Load the rag-engine module
spec = importlib.util.spec_from_file_location("rag", rag_engine_path)
rag = importlib.util.module_from_spec(spec)
sys.modules["rag"] = rag
spec.loader.exec_module(rag)

#test case requiring context from single chunk of text 
async def text_singlechunk_test(model, testcases, metric:str, test_type:str):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []
    metric_list = {
        'faithfulness' : FaithfulnessMetric(),
        'context_precision' : ContextualPrecisionMetric()
    }
    #check for valid test type (quantitative or qualitative)
    test_type_list = ['quantitative', 'qualitative']
    if test_type not in test_type_list:
        raise Exception('Invalid test type')
    
    #check for valid metric (faithfulness or context_precision)
    if metric not in metric_list.keys():
        raise Exception('No such metric')
    evaluator = metric_list[metric]

    #Iterate through each query in testcases
    for i in range(len(data)):
        question = data[i]["question"]
        ground_truth = data[i]["ground_truth"]
        #search for context using question
        search_results = rag.hybrid_search(question, 3, 3) 
        retrieved_chunk = search_results[0]
        retrieved_context = [retrieved_chunk['text_chunk']]

        #pass context and question to model to generate response
        response = model.invoke({"question" : question, "context" : retrieved_context})

        #initialise test case depending on chosen metric
        test_cases = {
            'faithfulness': LLMTestCase(input = question,
                                        actual_output=response,
                                        retrieval_context=retrieved_context),
            'context_precision': LLMTestCase(input = question,
                                             actual_output=response,
                                             retrieval_context=retrieved_context,
                                             expected_output=ground_truth)
        }

        test_case = test_cases[metric]
        evaluator.measure(test_case)
        #evaluation result of single question
        new_row = pd.DataFrame({'testcase' : [f"{test_type}_text_singlechunk_{i}"], 'metric' : [metric], 'score' : [evaluator.score],
                                'reason' : [evaluator.reason], 'question' : [question], 'response' : [response],
                                "retrieved_context" : [retrieved_context], 'ground_truth' : ground_truth})
        row_list.append(new_row)  

    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)

    #calculate mean evaluation score for single chunk of text
    mean_row = pd.DataFrame({'testcase' : [f"{test_type}_text_singlechunk_mean"], 'metric' : [metric],
                             'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['-'],
                             'question' : ['-'], 'response' : ['-'],
                              'retrieved_context' : ['-'], 'ground_truth' : ['-']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

#test case requiring context from non machine readable text 
async def nonmachinereadable_test(model, testcases, metric:str, test_type:str):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []
    metric_list = {
        'faithfulness' : FaithfulnessMetric(),
        'context_precision' : ContextualPrecisionMetric()
    }
    #check for valid test type (quantitative or qualitative)
    test_type_list = ['quantitative', 'qualitative']
    if test_type not in test_type_list:
        raise Exception('Invalid test type')
    
    #check for valid metric (faithfulness or context_precision)
    if metric not in metric_list.keys():
        raise Exception('No such metric')
    evaluator = metric_list[metric]

    #Iterate through each query in testcases
    for i in range(len(data)):
        question = data[i]["question"]
        ground_truth = data[i]["ground_truth"]
        #search for context using question
        search_results = rag.hybrid_search(question, 3, 3) 
        retrieved_chunk = search_results[0]
        retrieved_context = [retrieved_chunk['text_chunk']]

        #pass context and question to model to generate response
        response = model.invoke({"question" : question, "context" : retrieved_context})

        #initialise test case depending on chosen metric
        test_cases = {
            'faithfulness': LLMTestCase(input = question,
                                        actual_output=response,
                                        retrieval_context=retrieved_context),
            'context_precision': LLMTestCase(input = question,
                                             actual_output=response,
                                             retrieval_context=retrieved_context,
                                             expected_output=ground_truth)
        }

        test_case = test_cases[metric]
        evaluator.measure(test_case)
        #evaluation result of single question
        new_row = pd.DataFrame({'testcase' : [f"{test_type}_text_singlechunk_{i}"], 'metric' : [metric], 'score' : [evaluator.score],
                                'reason' : [evaluator.reason], 'question' : [question], 'response' : [response],
                                "retrieved_context" : [retrieved_context], 'ground_truth' : ground_truth})
        row_list.append(new_row)  

    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)

    #calculate mean evaluation score for single chunk of text
    mean_row = pd.DataFrame({'testcase' : [f"{test_type}_text_singlechunk_mean"], 'metric' : [metric],
                             'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['-'],
                             'question' : ['-'], 'response' : ['-'],
                              'retrieved_context' : ['-'], 'ground_truth' : ['-']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

#test case requiring context from mutliple chunks of text 
async def text_multichunk_test(model, testcases, metric:str, test_type:str):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []
    metric_list = {
        'faithfulness' : FaithfulnessMetric(),
        'context_precision' : ContextualPrecisionMetric()
    }
    #check for valid test type (quantitative or qualitative)
    test_type_list = ['quantitative', 'qualitative']
    if test_type not in test_type_list:
        raise Exception('Invalid test type')
    
    #check for valid metric (faithfulness or context_precision)
    if metric not in metric_list.keys():
        raise Exception('No such metric')
    evaluator = metric_list[metric]

    #Iterate through each query in testcases
    for i in range(len(data)):
        question = data[i]["question"]
        ground_truth = data[i]["ground_truth"]
        #search for context using question
        search_results = rag.hybrid_search(question, 3, 3) 
        retrieved_chunk = search_results[0]
        retrieved_context = [retrieved_chunk['text_chunk']]

        #pass context and question to model to generate response
        response = model.invoke({"question" : question, "context" : retrieved_context})

        #initialise test case depending on chosen metric
        test_cases = {
            'faithfulness': LLMTestCase(input = question,
                                        actual_output=response,
                                        retrieval_context=retrieved_context),
            'context_precision': LLMTestCase(input = question,
                                             actual_output=response,
                                             retrieval_context=retrieved_context,
                                             expected_output=ground_truth)
        }

        test_case = test_cases[metric]
        evaluator.measure(test_case)
        #evaluation result of single question
        new_row = pd.DataFrame({'testcase' : [f"{test_type}_text_multichunk_{i}"], 'metric' : [metric], 'score' : [evaluator.score],
                                'reason' : [evaluator.reason], 'question' : [question], 'response' : [response],
                                "retrieved_context" : [retrieved_context], 'ground_truth' : ground_truth})
        row_list.append(new_row)  

    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)

    #calculate mean evaluation score for mutliple chunks of text
    mean_row = pd.DataFrame({'testcase' : [f"{test_type}_text_multichunk_mean"], 'metric' : [metric],
                             'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['-'],
                             'question' : ['-'], 'response' : ['-'],
                              'retrieved_context' : ['-'], 'ground_truth' : ['-']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

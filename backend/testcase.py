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

# quantitative test case to test faithfulness of model using query requiring context from single chunk of text
async def faithfulness_quantitative_text_singlechunk(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

    #Iterate through each query in testcases
    for i in range(len(data)):
        question = data[i]["question"]

        #search for context using question
        search_results = rag.hybrid_search(question, 3, 3) 
        retrieved_chunk = search_results[0]
        retrieved_context = [retrieved_chunk['text_chunk']]

        #pass context and question to model to generate response
        response = model.invoke({"question" : question, "context" : retrieved_context})

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context)
        
        faithfulness = FaithfulnessMetric()
        faithfulness.measure(test_case)
        print(faithfulness.score, faithfulness.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"quantitative_text_singlechunk_{i}"], 'metric' : ['faithfulness'], 'question' : [question],
                                'response' : [response], 'score' : [faithfulness.score], 'reason' : [faithfulness.reason]})
        row_list.append(new_row)  
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)

    #calculate mean faithfulness score for quantitative single chunk of text
    mean_row = pd.DataFrame({'testcase' : ['quantitative_text_singlechunk_mean'], 'metric' : ['faithfulness'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# quantitative test case to test faithfulness of model using query requiring context from tables/non-machine readable data
async def faithfulness_quantitative_nonmachinereadable(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

    #Iterate through each query in testcases
    for i in range(len(data)):
        question = data[i]["question"]

        #search for context using question
        search_results = rag.hybrid_search(question, 3, 3) 
        retrieved_chunk = search_results[0]
        retrieved_context = [retrieved_chunk['text_chunk']]

        #pass context and question to model to generate response
        response = model.invoke({"question" : question, "context" : retrieved_context})

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context)
        
        faithfulness = FaithfulnessMetric()
        faithfulness.measure(test_case)
        print(faithfulness.score, faithfulness.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"quantitative_nonmachinereadable_{i}"], 'metric' : ['faithfulness'], 'question' : [question],
                                'response' : [response], 'score' : [faithfulness.score], 'reason' : [faithfulness.reason]})
        row_list.append(new_row) 
    
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)
    #calculate mean faithfulness score for quantitative non machine readable
    mean_row = pd.DataFrame({'testcase' : ['quantitative_nonmachinereadable_mean'], 'metric' : ['faithfulness'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# quantitative testcase to test faithfulness of model using query requiring context from mutliple chunks of texts
async def faithfulness_quantitative_text_multichunk(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

    #Iterate through each query in testcases
    for i in range(len(data)):
        question = data[i]["question"]

        #search for context using question
        search_results = rag.hybrid_search(question, 3, 3) 
        retrieved_chunk = search_results[0]
        retrieved_context = [retrieved_chunk['text_chunk']]

        #pass context and question to model to generate response
        response = model.invoke({"question" : question, "context" : retrieved_context})

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context)
        
        faithfulness = FaithfulnessMetric()
        faithfulness.measure(test_case)
        print(faithfulness.score, faithfulness.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"quantitative_text_multichunk_{i}"], 'metric' : ['faithfulness'], 'question' : [question],
                                'response' : [response], 'score' : [faithfulness.score], 'reason' : [faithfulness.reason]})
        row_list.append(new_row)  
    
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)
    #calculate mean faithfulness score for quantitative multiple chunk of text
    mean_row = pd.DataFrame({'testcase' : ['quantitative_text_multichunk_mean'], 'metric' : ['faithfulness'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# qualitative testcase to test faithfulness of model using query requiring context from single chunk of text
async def faithfulness_qualitative_text_singlechunk(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

    #Iterate through each query in testcases
    for i in range(len(data)):
        question = data[i]["question"]

        #search for context using question
        search_results = rag.hybrid_search(question, 3, 3) 
        retrieved_chunk = search_results[0]
        retrieved_context = [retrieved_chunk['text_chunk']]

        #pass context and question to model to generate response
        response = model.invoke({"question" : question, "context" : retrieved_context})

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context)
        
        faithfulness = FaithfulnessMetric()
        faithfulness.measure(test_case)
        print(faithfulness.score, faithfulness.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"qualitative_text_singlechunk_{i}"], 'metric' : ['faithfulness'], 'question' : [question],
                                'response' : [response], 'score' : [faithfulness.score], 'reason' : [faithfulness.reason]})
        row_list.append(new_row)

    metric_results = pd.concat(row_list, axis = 0, ignore_index=True) 
    #calculate mean faithfulness score for qualitative single chunk of text
    mean_row = pd.DataFrame({'testcase' : ['qualitative_text_singlechunk_mean'], 'metric' : ['faithfulness'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# qualitative test case to test faithfulness of model using query requiring context from tables/non-machine readable data
async def faithfulness_qualitative_nonmachinereadable(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

    #Iterate through each query in testcases
    for i in range(len(data)):
        question = data[i]["question"]

        #search for context using question
        search_results = rag.hybrid_search(question, 3, 3) 
        retrieved_chunk = search_results[0]
        retrieved_context = [retrieved_chunk['text_chunk']]

        #pass context and question to model to generate response
        response = model.invoke({"question" : question, "context" : retrieved_context})

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context)
        
        faithfulness = FaithfulnessMetric()
        faithfulness.measure(test_case)
        print(faithfulness.score, faithfulness.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"qualitative_nonmachinereadable_{i}"], 'metric' : ['faithfulness'], 'question' : [question],
                                'response' : [response], 'score' : [faithfulness.score], 'reason' : [faithfulness.reason]})
        row_list.append(new_row)  
    
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True) 
    #calculate mean faithfulness score for qualitative non machine readable
    mean_row = pd.DataFrame({'testcase' : ['qualitative_nonmachinereadable_mean'], 'metric' : ['faithfulness'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# qualitative testcase to test faithfulness of model using query requiring context from mutliple chunks of texts
async def faithfulness_qualitative_text_multichunk(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

    #Iterate through each query in testcases
    for i in range(len(data)):
        question = data[i]["question"]

        #search for context using question
        search_results = rag.hybrid_search(question, 3, 3) 
        retrieved_chunk = search_results[0]
        retrieved_context = [retrieved_chunk['text_chunk']]

        #pass context and question to model to generate response
        response = model.invoke({"question" : question, "context" : retrieved_context})

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context)
        
        faithfulness = FaithfulnessMetric()
        faithfulness.measure(test_case)
        print(faithfulness.score, faithfulness.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"qualitative_text_multichunk_{i}"], 'metric' : ['faithfulness'], 'question' : [question],
                                'response' : [response], 'score' : [faithfulness.score], 'reason' : [faithfulness.reason]})
        row_list.append(new_row)  
    
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)
    #calculate mean faithfulness score for qualitative multiple chunk of text
    mean_row = pd.DataFrame({'testcase' : ['qualitative_text_multichunk_mean'], 'metric' : ['faithfulness'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# quantitative test case to test context precision of model using query requiring context from single chunk of text
async def context_precision_quantitative_text_singlechunk(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

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

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context,
                expected_output=ground_truth)
        
        context_precision = ContextualPrecisionMetric()
        context_precision.measure(test_case)
        print(context_precision.score, context_precision.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"quantitative_text_singlechunk_{i}"], 'metric' : ['context_precision'], 'question' : [question],
                                'response' : [response], 'score' : [context_precision.score], 'reason' : [context_precision.reason]})
        row_list.append(new_row)  
    
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)
    #calculate mean faithfulness score for quantitative single chunk of text
    mean_row = pd.DataFrame({'testcase' : ['quantitative_text_singlechunk_mean'], 'metric' : ['context_precision'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# quantitative test case to test context precision of model using query requiring context from tables/non-machine readable data
async def context_precision_quantitative_nonmachinereadable(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

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

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context,
                expected_output=ground_truth)
        
        context_precision = ContextualPrecisionMetric()
        context_precision.measure(test_case)
        print(context_precision.score, context_precision.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"quantitative_nonmachinereadable_{i}"], 'metric' : ['context_precision'], 'question' : [question],
                                'response' : [response], 'score' : [context_precision.score], 'reason' : [context_precision.reason]})
        row_list.append(new_row)  
    
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)
    #calculate mean faithfulness score for quantitative non machine readable texts
    mean_row = pd.DataFrame({'testcase' : ['quantitative_nonmachinereadable_mean'], 'metric' : ['context_precision'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# quantitative test case to test context precision of model using query requiring context from multiple chunks of text
async def context_precision_quantitative_text_multichunk(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

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

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context,
                expected_output=ground_truth)
        
        context_precision = ContextualPrecisionMetric()
        context_precision.measure(test_case)
        print(context_precision.score, context_precision.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"quantitative_text_multichunk_{i}"], 'metric' : ['context_precision'], 'question' : [question],
                                'response' : [response], 'score' : [context_precision.score], 'reason' : [context_precision.reason]})
        row_list.append(new_row)  
    
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)
    #calculate mean faithfulness score for quantitative multiple chunk of texts
    mean_row = pd.DataFrame({'testcase' : ['quantitative_text_multichunk_mean'], 'metric' : ['context_precision'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# qualitative test case to test context precision of model using query requiring context from single chunk of text
async def context_precision_qualitative_text_singlechunk(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

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

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context,
                expected_output=ground_truth)
        
        context_precision = ContextualPrecisionMetric()
        context_precision.measure(test_case)
        print(context_precision.score, context_precision.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"qualitative_text_singlechunk_{i}"], 'metric' : ['context_precision'], 'question' : [question],
                                'response' : [response], 'score' : [context_precision.score], 'reason' : [context_precision.reason]})
        row_list.append(new_row)  
    
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)
    #calculate mean faithfulness score for qualitative single chunk of text
    mean_row = pd.DataFrame({'testcase' : ['qualitative_text_singlechunk_mean'], 'metric' : ['context_precision'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# qualitative test case to test context precision of model using query requiring context from tables/non-machine readable data
async def context_precision_qualitative_nonmachinereadable(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

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

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context,
                expected_output=ground_truth)
        
        context_precision = ContextualPrecisionMetric()
        context_precision.measure(test_case)
        print(context_precision.score, context_precision.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"qualitative_nonmachinereadable_{i}"], 'metric' : ['context_precision'], 'question' : [question],
                                'response' : [response], 'score' : [context_precision.score], 'reason' : [context_precision.reason]})
        row_list.append(new_row)  
    
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)
    #calculate mean faithfulness score for qualitative non machine readable texts
    mean_row = pd.DataFrame({'testcase' : ['qualitative_nonmachinereadable_mean'], 'metric' : ['context_precision'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results

# qualitative test case to test context precision of model using query requiring context from multiple chunks of text
async def context_precision_qualitative_text_multichunk(model, testcases):
    #testcases is list of dictionaries with query, ground_truth (answer)
    with open(testcases) as json_file:
        data = json.load(json_file)

    #list of pd dataframe to concatenate
    row_list = []

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

        #initialize testcase with question, context and response
        test_case = LLMTestCase(input = question,
                actual_output=response,
                retrieval_context=retrieved_context,
                expected_output=ground_truth)
        
        context_precision = ContextualPrecisionMetric()
        context_precision.measure(test_case)
        print(context_precision.score, context_precision.reason)
        #faithfulness result of single question
        new_row = pd.DataFrame({'testcase' : [f"qualitative_text_multichunk_{i}"], 'metric' : ['context_precision'], 'question' : [question],
                                'response' : [response], 'score' : [context_precision.score], 'reason' : [context_precision.reason]})
        row_list.append(new_row)  
    
    metric_results = pd.concat(row_list, axis = 0, ignore_index=True)
    #calculate mean faithfulness score for qualitative multiple chunk of texts
    mean_row = pd.DataFrame({'testcase' : ['qualitative_text_multichunk_mean'], 'metric' : ['context_precision'], 'question' : ['calculate mean'],
                             'response' : ['calculate mean'], 'score' : [metric_results['score'].mean(axis = 0)], 'reason' : ['calculate mean']})
    metric_results = pd.concat([metric_results, mean_row], axis = 0, ignore_index=True)
    return metric_results
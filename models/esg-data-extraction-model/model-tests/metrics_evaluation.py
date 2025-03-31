#========== WARNING ==========
# Run this script only when the Elasticsearch container is running
# Also make sure you have indexed the data into Elasticsearch before running this script
#=============================
import asyncio
import os
import pandas as pd
from testcase import *
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# to set the evaluator LLM model run "deepeval set-ollama <model_name>" eg: deepeval set-ollama deepseek-r1:14b

async def main():
    # make folder to store evaluation results
    output_folder = 'backend/evaluation_results'
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # make sure evaluation testcases files are in the evaluation_data folder in backend directory
    quantitative_text_singlechunk = 'backend/evaluation_data/quantitative_text_singlechunk.json'
    quantitative_nonmachinereadable = 'backend/evaluation_data/quantitative_nonmachinereadable.json'
    quantitative_text_multichunk = 'backend/evaluation_data/quantitative_text_multichunk.json'
    qualitative_text_singlechunk = 'backend/evaluation_data/qualitative_text_singlechunk.json'
    qualitative_nonmachinereadable = 'backend/evaluation_data/qualitative_nonmachinereadable.json'
    qualitative_text_multichunk = 'backend/evaluation_data/qualitative_text_multichunk.json'

    template = """
    You are an AI assistant specialized in ESG (Environmental, Social, and Governance) metrics.
    Your task is to provide accurate and comprehensive answers based on the given context.
    If the context fully answers the question, use it to generate your response.
    If the context is insufficient, answer to the best of your ability without fabricating information.

    Question: {question}
    Context: {context}
    """

    #setting up rag chain
    prompt = PromptTemplate(template=template, input_variables=['question', 'context'])
    llm = OllamaLLM(model='llama3.2')
    rag_chain = prompt | llm | StrOutputParser()

    metric_results_list = [
        await text_singlechunk_test(rag_chain, quantitative_text_singlechunk, 'faithfulness', 'quantitative'),
        await text_singlechunk_test(rag_chain, quantitative_text_singlechunk, 'context_precision', 'quantitative'),
        await nonmachinereadable_test(rag_chain, quantitative_nonmachinereadable, 'faithfulness', 'quantitative'),
        await nonmachinereadable_test(rag_chain, quantitative_nonmachinereadable, 'context_precision', 'quantitative'),
        await text_multichunk_test(rag_chain, quantitative_text_multichunk, 'faithfulness', 'quantitative'),
        await text_multichunk_test(rag_chain, quantitative_text_multichunk, 'context_precision', 'quantitative'),
        await text_singlechunk_test(rag_chain, qualitative_text_singlechunk, 'faithfulness', 'qualitative'),
        await text_singlechunk_test(rag_chain, qualitative_text_singlechunk, 'context_precision', 'qualitative'),
        await nonmachinereadable_test(rag_chain, qualitative_nonmachinereadable, 'faithfulness', 'qualitative'),
        await nonmachinereadable_test(rag_chain, qualitative_nonmachinereadable, 'context_precision', 'qualitative'),
        await text_multichunk_test(rag_chain, qualitative_text_multichunk, 'faithfulness', 'qualitative'),
        await text_multichunk_test(rag_chain, qualitative_text_multichunk, 'context_precision', 'qualitative')
    ]
    
    # combining all results into a single dataframe and save it as an Excel file in the output folder
    combined_metrics_result = pd.concat(metric_results_list, axis=0, ignore_index=True)
    print(combined_metrics_result)
    combined_metrics_result.to_excel(f"{output_folder}/evaluation_{pd.to_datetime('now').strftime('%Y-%m-%d_%H-%M-%S')}.xlsx", index = False)

if __name__ == "__main__":
    asyncio.run(main())
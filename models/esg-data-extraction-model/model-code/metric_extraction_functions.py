from langchain_core.prompts import PromptTemplate
from langchain_ollama.llms import OllamaLLM
from langchain_core.output_parsers import StrOutputParser
import json
import re
from pydantic import BaseModel

class MetricRequest(BaseModel):
    company_name: str = None
    esg_metric: str
    report_year: str

def generate_esg_metric_response(esg_metric, retrieved_context):
    # Setup Prompt Template for LLM
    template = """
    You are an expert in ESG analysis. 
    Based on the retrieved context and the requested ESG metric provided below, extract the value of the ESG metric from the context.
    Extract only one value of the ESG metric requested.
    If multiple values are found, return only the most recent one.
    Do not return a list or range of values; select only one value.
    If no value is explicitly stated, respond with "No relevant data available." Do not make up any numbers.

    ESG Metric: {esg_metric}
    Context: {context}

    Output Requirements:
    - Single value in numerical form (e.g. 1234.56) or "No relevant data available."
    - If the value is a percentage, return it in numerical form with percentage symbol (e.g. 50%).
    - If the value has a unit, include the unit in the response (e.g. 1000 tonnes).

    Output Format:
    Please provide only the ESG metric value in JSON format, with no additional explanation or text before or after the JSON object.
    Ensure that the <extracted_value> is a string wrapped in double quotes.
    It should be in the format:
    ```json
    {{"value": <extracted_value>}}
    ```
    """

    prompt = PromptTemplate(template=template, input_variables=["esg_metric", "context"])

    # Initialize the LLM model
    llm = OllamaLLM(model='llama3.2')

    # Define a RAG chain
    rag_chain = prompt | llm | StrOutputParser()
    return rag_chain.invoke({"esg_metric": esg_metric, "context": retrieved_context})

# ================= Function to parse the output from LLM =================
def parse_llm_output(llm_output):
    '''
    Purpose: Takes in raw output from LLM and returns the extracted value (ESG metric value)
    Reason: The raw output from LLM is a stringified JSON object instead of a proper JSON object
            or Python dictionary. E.g. "{\"value\": \"45%\"}". 
            And sometimes there are extra texts before and after the JSON object. 
            E.g. "Some text here. {\"value\": \"31.4%\"}\n\nMore explanation follows after the JSON."
            We only want to keep the JSON object and extract the value from it.
    Input: 
        llm_output (str): The raw output from LLM which is a stringified JSON object
    Output:
        extracted_value (str): The extracted value from the LLM output which is the ESG metric value
    '''
    # print(llm_output)

    # Use regex to capture everything from the first '{' to the corresponding '}' in the LLM output
    # This will extract the JSON object from the LLM output
    # `\{` matches the literal `{` character and escaping is necessary because `{` is a special charcter in regex
    # `.*` matches any character (except for line terminators) zero or more times
    # `\}` matches the literal `}` character and escaping is necessary because `}` is a special charcter in regex
    match = re.search(r'\{.*\}', llm_output)

    # If a match is found, extract the JSON object and convert it to a Python dictionary
    # Then extract the value from the dictionary
    if match:
        json_str = match.group(0) # `match.group(0)` returns the entire match
        python_dict = json.loads(json_str)
        extracted_value = python_dict['value']
        return extracted_value
    # If we cannot extract the value, then the default response is "No relevant data available."
    else:
        return "No relevant data available."
from langchain_core.prompts import PromptTemplate
from langchain_ollama.llms import OllamaLLM
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel

'''
Script contains helper functions for the 
QnA API endpoint
'''
class Question(BaseModel):
    question: str

def generate_qna_repsonse(question, retrieved_context):
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
    
    # Return chatbot response given query and context
    response = rag_chain.invoke({"question": question, "context": retrieved_context})
    return response
from langchain_core.prompts import PromptTemplate
from langchain_ollama.llms import OllamaLLM
from langchain_core.output_parsers import StrOutputParser
from pydantic import BaseModel
from typing import List

class ChatMessage(BaseModel):
    sender: str
    text: str
    timestamp: str = None

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]

def generate_chatbot_repsonse(question, combined_context):
    # Setup Prompt Template for LLM
    chatbot_template = """
    You are an AI Chatbot that specializes in ESG analysis. 
    Your task is to answer user's queries about ESG metrics to the best of your ability based on the information from the retrieved context below.
    The retrieved context is a text snippet from a company's ESG report.
    If the answer is not in the context provided, respond with "I don't know" and provide other relevant useful information from the context that might be of interest to the user.

    User's Query: {user_query}
    Context: {context}
    """

    chatbot_prompt = PromptTemplate(template=chatbot_template, input_variables=["user_query", "context"])

    # Initialize the LLM model
    llm = OllamaLLM(model='llama3.2')

    # Define a RAG chain
    chatbot_rag_chain = chatbot_prompt | llm | StrOutputParser()
    
    # Return chatbot response given query and context
    response = chatbot_rag_chain.invoke({"user_query": question, "context": combined_context})
    return response
import os
import uuid
from dotenv import load_dotenv
from openai import AzureOpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

app = FastAPI()

os.environ["TOKENIZERS_PARALLELISM"] = "false"

load_dotenv()

# Setup embeddings
embedding = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")

# Load existing DBs
product_docs_collection = Chroma(persist_directory="chargeMe_vector_db", embedding_function=embedding)
chat_history_collection = Chroma(persist_directory="chargeMe_chat_history", embedding_function=embedding)

# Azure OpenAI Client
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
)

def get_bot_response(query):
    # Use new retriever `.invoke()` instead of deprecated `.get_relevant_documents`
    product_retriever = product_docs_collection.as_retriever(search_kwargs={"k": 5})
    chat_retriever = chat_history_collection.as_retriever(search_kwargs={"k": 3})

    product_docs = product_retriever.invoke(query)
    chat_docs = chat_retriever.invoke(query)

    docs_context = "\n\n".join([doc.page_content for doc in product_docs]) if product_docs else "No product info found."
    chat_context = "\n\n".join([doc.page_content for doc in chat_docs]) if chat_docs else "No prior chat history."

    feedback_docs = chat_history_collection.as_retriever(search_kwargs={"k": 5}).invoke("previous feedback")

    feedback_context = "\n\n".join([doc.page_content for doc in feedback_docs if doc.metadata.get("role") == "feedback"] if feedback_docs else "No feedback found.")

    full_context = f"Product Documentation:\n{docs_context}\n\nChat History:\n{chat_context}"

    full_context += f"\n\nUser Feedback History:\n{feedback_context}"

    system_prompt = f"""
    You are ChargeMe product support. Use the following information to answer user questions about ChargeMe:
    {full_context}

    If the answer to the question is not available in the provided information, respond with: "I'm sorry, I don't have the information to answer that question."
    """

    print("Full Context being passed to LLM:\n", full_context)  # Add this line

    response = client.chat.completions.create(
        model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ],
        max_tokens=800,
        temperature=0.7,
    )

    reply = response.choices[0].message.content

    # Manually add chat message to Chroma (by reconstructing doc objects)
    chat_history_collection.add_documents([
        Document(page_content=reply, metadata={"role": "assistant", "query": query})
    ])
    print("✅ Logged ChargeMe bot reply.")

    return reply


def test_azure_connection():
    try:
        response = client.chat.completions.create(
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"),
            messages=[{"role": "user", "content": "Hello"}],
            max_tokens=10
        )
        print("✅ Azure OpenAI connection successful!")
        return True
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print(f"Endpoint: {os.getenv('AZURE_OPENAI_ENDPOINT')}")
        print(f"Deployment: {os.getenv('AZURE_OPENAI_DEPLOYMENT_NAME')}")
        return False

if __name__ == "__main__":
    if test_azure_connection():
        question = "How do I reset my ChargeMe device?"
        answer = get_bot_response(question)
        print("ChargeMe Bot Answer:", answer)
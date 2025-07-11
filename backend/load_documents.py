import os
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import AzureOpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from sentence_transformers import SentenceTransformer
from langchain_community.embeddings import HuggingFaceEmbeddings

# Load .env file
load_dotenv()

# Load and split documents
loader = DirectoryLoader(
    "data",
    glob="**/*.pdf",
    loader_cls=PyPDFLoader
)
documents = loader.load()
print(f"📄 Loaded {len(documents)} documents")

# Split documents into manageable chunks
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
docs = text_splitter.split_documents(documents)
print(f"✂️ Split into {len(docs)} chunks")

# Create embeddings and save to ChromaDB
embedding = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")

db = Chroma.from_documents(docs, embedding, persist_directory="vector_db")
db.persist()
print("✅ Documents embedded and stored in ChromaDB.")
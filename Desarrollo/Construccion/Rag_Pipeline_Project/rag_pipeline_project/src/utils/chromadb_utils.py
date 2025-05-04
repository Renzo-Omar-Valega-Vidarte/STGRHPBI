from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain.schema import Document

def setup_chromadb(data):
    embeddings = OllamaEmbeddings(model="deepseek-r1:7b")
    documents = [Document(page_content=str(row), metadata=row) for row in data]
    vectorstore = Chroma.from_documents(documents, embeddings)
    return vectorstore

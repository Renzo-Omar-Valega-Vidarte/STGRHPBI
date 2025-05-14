from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_community.document_loaders import TextLoader
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaLLM
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import Document
from pathlib import Path
import os
import pyodbc
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

# CORS setup (frontend from Vite or React on localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQL Server config
SQL_SERVER_CONFIG = {
    "server": os.getenv("DB_SERVER", "TOCINO-CRUJIENT"),
    "database": os.getenv("DB_DATABASE", "DWH_STGRHPBI"),
    "username": os.getenv("DB_USER", "renzo"),
    "password": os.getenv("DB_PASSWORD", "renzo2002"),
    "driver": "{ODBC Driver 17 for SQL Server}",
}

class Query(BaseModel):
    prompt: str

def fetch_data_from_sql():
    """Load documents from SQL Server."""
    conn_str = (
        f"DRIVER={SQL_SERVER_CONFIG['driver']};"
        f"SERVER={SQL_SERVER_CONFIG['server']};"
        f"DATABASE={SQL_SERVER_CONFIG['database']};"
        f"UID={SQL_SERVER_CONFIG['username']};"
        f"PWD={SQL_SERVER_CONFIG['password']}"
    )

    queries = {
        "ATM": "SELECT * FROM [dbo].[Vista_ATM_Completa]",
        "Enapres": "SELECT * FROM [dbo].[Vista_Enapres_Completa]",
        "Gastos": "SELECT * FROM [dbo].[Vista_Gastos_Completa]",
    }

    documents = []
    with pyodbc.connect(conn_str) as conn:
        cursor = conn.cursor()
        for name, sql in queries.items():
            print(f">>> Cargando datos de: {name}")
            cursor.execute(sql)
            cols = [col[0] for col in cursor.description]
            for row in cursor.fetchall():
                row_dict = dict(zip(cols, row))
                documents.append(Document(page_content=str(row_dict), metadata={"source": name}))
    return documents

def setup_vectorstore(documents, persist_directory="chroma_db"):
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    persist_path = Path(persist_directory)
    if persist_path.exists():
        print(">>> Cargando vectorstore existente")
        return Chroma(persist_directory=persist_directory, embedding_function=embeddings)
    print(">>> Creando nuevo vectorstore")
    return Chroma.from_documents(documents, embeddings, persist_directory=persist_directory)

def create_rag_pipeline(vectorstore):
    llm = OllamaLLM(model="deepseek-r1:7b")
    retriever = vectorstore.as_retriever()
    return RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)

# Inicializar vectorstore y RAG pipeline
VECTORSTORE_PATH = "chroma_db"
if not Path(VECTORSTORE_PATH).exists():
    print(">>> Primera vez: cargando datos SQL y creando vectorstore...")
    docs = fetch_data_from_sql()
    vectorstore = setup_vectorstore(docs, persist_directory=VECTORSTORE_PATH)
else:
    vectorstore = setup_vectorstore([], persist_directory=VECTORSTORE_PATH)

rag_pipeline = create_rag_pipeline(vectorstore)

@app.post("/ask")
async def chat_endpoint(query: Query):
    try:
        result = rag_pipeline.invoke({"query": query.prompt})
        response_text = result.get("result") if isinstance(result, dict) else str(result)
        return {"response": response_text}
    except Exception as e:
        return {"error": f"Error procesando consulta: {str(e)}"}


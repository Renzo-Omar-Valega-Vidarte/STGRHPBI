from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pathlib import Path
from dotenv import load_dotenv
import os
import re
import json
import pyodbc

from langchain.chains import RetrievalQA
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import TextLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
from langchain.schema import Document
from groq import Groq

from schema_metadata import schema  # External schema definition
from sql_examples import sql_examples  # External SQL examples

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SQL Server Config ---

SQL_SERVER_CONFIG = {
    "server": os.getenv("DB_SERVER", "TOCINO-CRUJIENT"),
    "database": os.getenv("DB_DATABASE", "DWH_STGRHPBI"),
    "username": os.getenv("DB_USER", "renzo"),
    "password": os.getenv("DB_PASSWORD", "renzo2002"),
    "driver": "{ODBC Driver 17 for SQL Server}",
}

class Query(BaseModel):
    prompt: str

# --- Schema Context Builders ---

def build_schema_context(user_query: str) -> str:
    relevant_tables = []
    for table, info in schema.items():
        if any(col.lower() in user_query.lower() for col in info["columns"].keys()):
            relevant_tables.append(table)
    if not relevant_tables:
        relevant_tables = list(schema.keys())

    return "\n".join(
        f"Table: {table}\nColumns: {', '.join(schema[table]['columns'].keys())}\n"
        for table in relevant_tables
    )

def build_detailed_schema_context(user_query: str) -> str:
    relevant_tables = []
    for table, info in schema.items():
        if any(col.lower() in user_query.lower() for col in info["columns"].keys()):
            relevant_tables.append(table)
    if not relevant_tables:
        relevant_tables = list(schema.keys())

    lines = []
    for table in relevant_tables:
        source = schema[table].get("source_system", "dbo")
        fq_table = f"{source}.{table}"
        lines.append(f"Tabla: {fq_table} - {schema[table]['description']}")
        for col_name, col_info in schema[table]['columns'].items():
            fq_col = f"{fq_table}.{col_name}"
            lines.append(f"  - {fq_col} ({col_info['type']}): {col_info['description']}")
        lines.append("")
    return "\n".join(lines)




# --- SQL Safety ---

def is_safe_sql(sql: str) -> bool:
    sql = sql.strip().lower()
    return sql.startswith("select") and not re.search(r'\b(update|delete|insert|drop|alter|truncate|create)\b', sql)

# --- LLM Setup ---

llm_sql = OllamaLLM(
    model="deepseek-r1:8b",
    model_kwargs={
        "temperature": 0,
        "top_p": 0.95,
        "num_predict": 1024,
        "repeat_penalty": 1.2,
        "frequency_penalty": 0.1,
        "presence_penalty": 0.1,
    }
)


llm_rag = OllamaLLM(
    model="deepseek-r1:8b"  # Default parameters for /ask
)

# Groq client setup
groq_api_key = os.getenv("GROQ_API_KEY", "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")
groq_client = Groq(api_key=groq_api_key)
groq_model = "llama3-70b-8192"

# --- SQL Generator: DeepSeek + Groq Cleaner ---

def generate_sql_query(natural_language_query: str, return_raw=False):
    schema_description = build_schema_context(natural_language_query)
    full_schema_description = build_detailed_schema_context(natural_language_query)
    examples_text = "\n\n".join(
        f"Pregunta: {ex['question']}\nSQL:\n{ex['query'].strip()}"
        for ex in sql_examples
    )

    # Stage 1: DeepSeek
    ds_prompt = f"""
Eres un asistente que convierte preguntas en lenguaje natural a SQL Server válido.

INSTRUCCIONES:
- Devuelve SOLO código SQL válido.
- No incluyas explicaciones, etiquetas ni comentarios.

Esquema:
{schema_description}

Ejemplos:
{examples_text}

Pregunta: {natural_language_query}

SQL:
""".strip()

    try:
        raw_response = llm_sql.invoke(ds_prompt)
        raw_sql = raw_response.strip()
    except Exception as e:
        return ("SELECT 'DeepSeek error' AS error_message", "") if return_raw else "SELECT 'DeepSeek error' AS error_message"

    # Stage 2: Groq cleanup + context
    groq_prompt = f"""
Corrige y valida esta consulta SQL generada por otro modelo. Usa el esquema proporcionado.

Instrucciones:
- Devuelve un JSON con una sola clave "sql".
- Usa los nombres completos de tablas: esquema.nombre_tabla (por ejemplo, Gastos.FACT_GASTOS, Enapres.FACT_ENAPRES, ATM.FACT_ATM, Generico.DIM_FECHA, Generico.DIM_UBIGEO).
- Verifica que columnas y tablas existan y sean válidas según el esquema.

Consulta original:
{raw_sql}

Esquema detallado:
{full_schema_description}
""".strip()

    try:
        response = groq_client.chat.completions.create(
            model=groq_model,
            messages=[{"role": "user", "content": groq_prompt}],
            response_format={"type": "json_object"}
        )
        parsed_json = json.loads(response.choices[0].message.content)
        final_sql = parsed_json.get("sql", "").strip()

        if not re.match(r"(?i)^\s*(select|with)\b", final_sql):
            final_sql = f"SELECT * FROM {list(schema.keys())[0]} WHERE 1=0 -- SQL inválido"

        return (final_sql, raw_sql) if return_raw else final_sql

    except Exception as e:
        print("Groq JSON mode error:", e)
        return ("SELECT 'Groq error' AS error_message", raw_sql) if return_raw else "SELECT 'Groq error' AS error_message"



# --- SQL Execution ---

def execute_sql_query(query: str):
    conn_str = (
        f"DRIVER={SQL_SERVER_CONFIG['driver']};"
        f"SERVER={SQL_SERVER_CONFIG['server']};"
        f"DATABASE={SQL_SERVER_CONFIG['database']};"
        f"UID={SQL_SERVER_CONFIG['username']};"
        f"PWD={SQL_SERVER_CONFIG['password']}"
    )
    with pyodbc.connect(conn_str) as conn:
        cursor = conn.cursor()
        cursor.execute(query)
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        return [dict(zip(columns, row)) for row in rows]

# --- RAG Setup ---

def fetch_data_from_sql():
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
    retriever = vectorstore.as_retriever()
    return RetrievalQA.from_chain_type(llm=llm_rag, chain_type="stuff", retriever=retriever)

# --- Init pipeline

VECTORSTORE_PATH = "chroma_db"
if not Path(VECTORSTORE_PATH).exists():
    print(">>> Primera vez: cargando datos SQL y creando vectorstore...")
    docs = fetch_data_from_sql()
    vectorstore = setup_vectorstore(docs, persist_directory=VECTORSTORE_PATH)
else:
    vectorstore = setup_vectorstore([], persist_directory=VECTORSTORE_PATH)

rag_pipeline = create_rag_pipeline(vectorstore)

# --- Endpoints ---

@app.post("/ask")
async def chat_endpoint(query: Query):
    try:
        result = rag_pipeline.invoke({"query": query.prompt})
        response_text = result.get("result") if isinstance(result, dict) else str(result)
        return {"response": response_text}
    except Exception as e:
        return {"error": f"Error procesando consulta: {str(e)}"}

@app.post("/query")
async def sql_query_endpoint(query: Query):
    try:
        sql, raw_sql = generate_sql_query(query.prompt, return_raw=True)

        if "<" in sql or ">" in sql:
            return {
                "error": "La consulta generada contiene sintaxis inválida (< >). Reformula la pregunta.",
                "sql": sql,
                "raw_sql": raw_sql
            }

        if not is_safe_sql(sql):
            return {
                "error": "Consulta bloqueada por seguridad. Solo se permiten SELECT.",
                "sql": sql,
                "raw_sql": raw_sql
            }

        try:
            results = execute_sql_query(sql)
        except Exception as db_error:
            return {
                "error": f"Error ejecutando SQL: {str(db_error)}",
                "sql": sql,
                "raw_sql": raw_sql
            }

        return {
            "sql": sql,
            "raw_sql": raw_sql,
            "results": results[:10]
        }

    except Exception as e:
        return {
            "error": f"Error generando o ejecutando SQL: {str(e)}",
            "sql": None,
            "raw_sql": None
        }





from utils.chromadb_utils import setup_chromadb
from langchain.chains import RetrievalQA
from langchain_ollama import OllamaLLM 

def fetch_data_from_sql():
    import pyodbc

    connection_string = (
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=TOCINO-CRUJIENT;"
        "DATABASE=DWH_STGRHPBI;"
        "UID=renzo;"
        "PWD=renzo2002;"
    )
    query = "SELECT TOP 100 * FROM [Gastos].[FACT_GASTOS]"  # Adjust query as needed

    with pyodbc.connect(connection_string) as conn:
        cursor = conn.cursor()
        cursor.execute(query)
        columns = [column[0] for column in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return data

def create_rag_pipeline(vectorstore):
    # Initialize Ollama LLM (new class name)
    llm = OllamaLLM(model="deepseek-r1:7b")

    # Create a retrieval-based QA chain via the new factory
    retriever = vectorstore.as_retriever()
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",            # or "map_reduce" / "refine" as you prefer
        retriever=retriever,
        chain_type_kwargs={"prompt": None}   # optional: pass custom prompt settings here
    )
    return qa_chain

if __name__ == "__main__":
    # Step 1: Fetch data from SQL Server
    data = fetch_data_from_sql()

    # Step 2: Set up ChromaDB
    vectorstore = setup_chromadb(data)

    # Step 3: Create RAG pipeline
    rag_pipeline = create_rag_pipeline(vectorstore)

    # Step 4: Query the pipeline
    query = "What are the top expenses in the database?"
    response = rag_pipeline.invoke({"query": query})
    print("Response:", response)
import os
import sys
import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient

# --- STEP 0: Prevent real vectorstore loading ---
os.environ["RUNNING_TESTS"] = "1"

# --- STEP 1: Add absolute path to Backend directory where app_main.py is located ---
backend_dir = r"C:\Users\RENZO\Documents\GitHub\STGRHPBI\Desarrollo\Construccion\Backend"
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# --- STEP 2: Import app_main safely ---
try:
    import app_main
except ImportError as e:
    raise ImportError(f" Cannot import app_main. Make sure 'app_main.py' exists in {backend_dir}") from e

from app_main import app
client = TestClient(app)

# --- STEP 3: Patch rag_pipeline on startup ---
@pytest.fixture(scope="session", autouse=True)
def patch_vectorstore_and_rag():
    mock_vs = MagicMock()
    mock_retriever = MagicMock()
    mock_vs.as_retriever.return_value = mock_retriever

    with patch("app_main.setup_vectorstore", return_value=mock_vs), \
         patch("app_main.create_rag_pipeline") as mock_create_rag:

        mock_pipeline = MagicMock()
        mock_pipeline.invoke = MagicMock(return_value={"result": "This is a RAG response."})
        mock_create_rag.return_value = mock_pipeline

        app_main.rag_pipeline = mock_pipeline
        yield

# --- STEP 4: Fixtures for LLM and SQL mocking ---

@pytest.fixture
def mock_db_connection():
    with patch('app_main.pyodbc.connect') as mock_connect:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [('test_result',)]
        mock_cursor.description = [('column_name',)]
        yield mock_cursor

@pytest.fixture
def mock_llm_sql():
    mock_llm = MagicMock()
    mock_llm.invoke.return_value = "SELECT * FROM test_table;"
    with patch('app_main.llm_sql', mock_llm):
        yield mock_llm.invoke

@pytest.fixture
def mock_groq_client():
    with patch('app_main.groq_client.chat.completions.create') as mock_create:
        mock_response = MagicMock()
        mock_choice = MagicMock()
        mock_message = MagicMock()
        mock_message.content = '{"sql": "SELECT * FROM Generico.DIM_FECHA;"}'
        mock_choice.message = mock_message
        mock_response.choices = [mock_choice]
        mock_create.return_value = mock_response
        yield mock_create

# --- STEP 5: Actual tests ---

def test_sql_query_endpoint_success(mock_db_connection, mock_llm_sql, mock_groq_client):
    print("\n Running test_sql_query_endpoint_success")
    response = client.post("/query", json={"prompt": "show me test data"})
    assert response.status_code == 200
    assert "sql" in response.json()

def test_sql_query_endpoint_unsafe_sql(mock_llm_sql, mock_groq_client):
    print("\n Running test_sql_query_endpoint_unsafe_sql")
    mock_groq_client.return_value.choices[0].message.content = '{"sql": "UPDATE users SET name = \'hacker\';"}'
    response = client.post("/query", json={"prompt": "update users"})
    assert response.status_code == 200
    assert "error" in response.json()

def test_sql_query_endpoint_db_error(mock_db_connection, mock_llm_sql, mock_groq_client):
    print("\n Running test_sql_query_endpoint_db_error")
    mock_db_connection.execute.side_effect = Exception("Database connection failed")
    response = client.post("/query", json={"prompt": "show me test data"})
    assert response.status_code == 200
    assert "error" in response.json()

def test_chat_endpoint_success():
    print("\n Running test_chat_endpoint_success")
    response = client.post("/ask", json={"prompt": "What is water management?"})
    assert response.status_code == 200
    assert "response" in response.json()








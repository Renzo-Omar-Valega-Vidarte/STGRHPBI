import pytest
from src.rag_pipeline import fetch_data_from_sql

def test_fetch_data_from_sql():
    data = fetch_data_from_sql()
    assert isinstance(data, list)  # Check if the result is a list
    assert len(data) <= 100  # Check if the result contains at most 100 records
    if data:
        assert isinstance(data[0], dict)  # Check if the first record is a dictionary
        assert 'column_name' in data[0]  # Replace 'column_name' with an actual column name from your database table
import axios from 'axios';

export async function fetchData() {
  try {
    const response = await axios.get('http://localhost:3000/api/data');
    return response.data;
  } catch (error) {
    console.error('Error al traer datos del backend', error);
    throw error;
  }
}

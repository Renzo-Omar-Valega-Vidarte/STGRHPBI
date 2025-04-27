import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Asegúrate que el back esté corriendo en este puerto

export async function fetchData() {
  try {
    const response = await axios.get(`${API_URL}/data`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos:', error);
    throw error;
  }
}

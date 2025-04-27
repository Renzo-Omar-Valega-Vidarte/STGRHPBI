export async function fetchData() {
  try {
    const response = await fetch('http://localhost:3000/api/data'); // 👈 asegúrate que esta ruta coincida con tu backend
    if (!response.ok) {
      throw new Error('Error al obtener datos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetchData:', error);
    return [];
  }
}


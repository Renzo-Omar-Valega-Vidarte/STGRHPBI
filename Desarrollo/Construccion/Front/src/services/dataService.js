export async function fetchData(route) {
  try {
    const response = await fetch(`http://localhost:3000/api/${route}`);
    if (!response.ok) {
      throw new Error(`Error al obtener datos de ${route}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error en fetchData (${route}):`, error);
    return [];
  }
}

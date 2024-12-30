

export default async function fetchComponent({url, token}: {url: string, token: string | null}) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token} `,
      },
    });
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error al obtener los datos:', error);
    return null;
  } 
}


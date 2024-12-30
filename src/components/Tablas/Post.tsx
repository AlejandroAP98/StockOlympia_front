
export default async function Post(API_BASE_URL: string, TABLE: string, token: string | null, object: Partial<unknown>) {
    const response = await fetch(`${API_BASE_URL}${TABLE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(object),
    });
    if (response.ok) {
      return response.json();
    } else {
      return null; 
    }
}



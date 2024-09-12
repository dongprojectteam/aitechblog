const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // 브라우저 환경
  if (process.env.BASE_URL) return process.env.BASE_URL; // 서버 환경
  return `http://localhost:${process.env.PORT || 3000}`; // 개발 환경
}

export async function incrementVisits(page: string): Promise<number | null> {
  const baseUrl = getBaseUrl();
  try {
    const response = await fetch(`${baseUrl}/api/incrementVisits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to increment visits');
    }

    const data: { success: boolean; visits: number } = await response.json();
    return data.visits;
  } catch (error) {
    console.error('Failed to increment visits:', error);
    return null;
  }
}
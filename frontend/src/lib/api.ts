const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export async function getData<T>(path: string): Promise<T> { const response = await fetch(`${API}${path}`, { cache: 'no-store' }); if (!response.ok) throw new Error(`API ${response.status}`); return response.json(); }
export async function postData<T>(path: string, body: unknown): Promise<T> { const response = await fetch(`${API}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); if (!response.ok) throw new Error(`API ${response.status}`); return response.json(); }

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function fetchApi(endpoint: string, options: ApiOptions = {}) {
  const { token, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...fetchOptions.headers as Record<string, string>,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...fetchOptions, headers });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

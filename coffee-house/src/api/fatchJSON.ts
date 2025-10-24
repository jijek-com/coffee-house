export async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error: ${response.status}: ${text || response.statusText}`);
    }

    const { data } = await response.json();
    return data.data ?? data;
  } catch (error) {
    throw error;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error || `API request failed with status ${response.status}`
    )
  }

  return data
}
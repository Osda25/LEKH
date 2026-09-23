import { getToken } from "./token.js"

const API_BASE_URL = import.meta.env.VITE_API_URL

export async function apiFetch(path, options = {}) {
  const token = getToken()
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: headers
  })

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(
      data.error || `API request failed with status ${response.status}`
    )

    error.status = response.status

    throw error
  }

  return data
}
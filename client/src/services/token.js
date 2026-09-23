export function saveToken(token) {
  sessionStorage.setItem('authToken', token)
}

export function getToken() {
  return sessionStorage.getItem('authToken')
}

export function removeToken() {
  sessionStorage.removeItem('authToken')
}
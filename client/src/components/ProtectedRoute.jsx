import { useState, useEffect } from 'react'
import { Navigate } from 'react-router'
import { getToken, removeToken } from '../services/token.js'
import { apiFetch } from "../services/api.js"

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking')
  const token = getToken()

  useEffect(() => {
    async function checkAuthentication() {
      try {
        await apiFetch('/api/auth/me')
        setStatus('authenticated')
      } catch (error) {
        if (error.status === 401) {
          removeToken()
          setStatus('unauthenticated')
        } else {
          setStatus('error')
        }
      }
    }

    if (!token) {
      return
    }

    checkAuthentication()
  },[token])

  if (!token) {
    return <Navigate to="/login" replace state={{ message: 'Please log in to continue.' }} />
  }

  if (status === 'checking') {
    return <p>Checking session...</p>
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ message: 'Please log in to continue.' }} />
  }

  if (status === 'error') {
    return <p>Could not check your session. Please try reloading the page.</p>
  }

  if (status === 'authenticated') {
    return children
  }
}

export default ProtectedRoute
import { useState, useEffect } from "react"
import { apiFetch } from "../services/api.js"

export default function ApiStatus() {
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    async function checkApi() {
      try {
        const data = await apiFetch('/api/health')

        if (data.status === 'ok') {
          setStatus('connected')
        } else {
          setStatus('error')
        }
      } catch {
        setStatus('error')
      }
    }

    checkApi()
  },[])

  if (status === 'connecting') {
    return <p>Checking API connection...</p>
  }

  if (status === 'connected') {
    return <p>API connection established</p>
  }

  return <p>API connection failed</p>
}
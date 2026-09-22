import { useLocation } from 'react-router'

export default function Login() {
  const location = useLocation()

  return (
    <>
      <h1 className="text-2xl font-bold">Log in</h1>

      {location.state?.message && (
        <p role="status" className="mt-4 text-green-800">
          {location.state.message}
        </p>
      )}
    </>
  )
}
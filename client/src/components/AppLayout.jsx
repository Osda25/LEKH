import { Outlet, useOutletContext } from 'react-router'
import Navigation from './Navigation.jsx'

export default function AppLayout() {
  const user = useOutletContext()

  return (
    <div className="flex min-h-dvh flex-col bg-brand">
      <Navigation role={user?.role} />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
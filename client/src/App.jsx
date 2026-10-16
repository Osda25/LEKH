import {
  Navigate,
  Route,
  Routes,
  useLocation
} from 'react-router'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Equipment from './components/Equipment.jsx'
import EquipmentDetails from './components/EquipmentDetails.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './components/Dashboard.jsx'
import AddEquipmentType from './components/AddEquipmentType.jsx'

const MANAGEMENT_ROLES = ['CARETAKER', 'ADMIN']

export default function App() {
  const location = useLocation()

  return (
    <>
      <main>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/equipment" replace />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/equipment" element={
            <ProtectedRoute key={location.pathname}>
              <Equipment />
            </ProtectedRoute>} 
          />
          <Route
            path="/equipment/:id"
            element={
            <ProtectedRoute key={location.pathname}>
              <EquipmentDetails />
            </ProtectedRoute>}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={MANAGEMENT_ROLES}>
                <Dashboard />
              </ProtectedRoute>}
          />
          <Route
            path="/dashboard/equipment/new"
            element={
              <ProtectedRoute allowedRoles={MANAGEMENT_ROLES}>
                <AddEquipmentType />
              </ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/equipment" replace />} />
        </Routes>
      </main>
    </>
  )
}
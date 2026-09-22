import {
  Link,
  Navigate,
  Route,
  Routes
} from 'react-router'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Equipment from './components/Equipment.jsx'
import EquipmentDetails from './components/EquipmentDetails.jsx'

export default function App() {
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
          <Route path="/equipment" element={<Equipment />} />
          <Route
            path="/equipment/:id"
            element={<EquipmentDetails />}
          />
          <Route path="*" element={<h1>Page not found</h1>} />
        </Routes>
      </main>
    </>
  )
}
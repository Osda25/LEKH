
import {
  Navigate,
  Route,
  Routes
} from 'react-router'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import Equipment from './components/Equipment.jsx'
import EquipmentDetails from './components/EquipmentDetails.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ManagementDashboard from './components/ManagementDashboard.jsx'
import AddEquipmentType from './components/AddEquipmentType.jsx'
import ManageEquipment from './components/ManageEquipment.jsx'
import ManageEquipmentDetails from './components/ManageEquipmentDetails.jsx'
import AddEquipmentUnit from './components/AddEquipmentUnit.jsx'
import ManageLoans from './components/ManageLoans.jsx'
import AddEquipmentGuide from './components/AddEquipmentGuide.jsx'
import MyLoans from './components/MyLoans.jsx'
import ManageFaultReports from './components/ManageFaultReports.jsx'
import AppLayout from './components/AppLayout.jsx'

const MANAGEMENT_ROLES = ['CARETAKER', 'ADMIN']

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/equipment" replace />}
      />

      <Route element={<AppLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/equipment"
            element={<Equipment />}
          />
          <Route
            path="/equipment/:id"
            element={<EquipmentDetails />}
          />
          <Route
            path="/loans"
            element={<MyLoans />}
          />

          <Route
            element={<ProtectedRoute allowedRoles={MANAGEMENT_ROLES} />}
          >
            <Route
              path="/dashboard"
              element={<ManagementDashboard />}
            />
            <Route
              path="/dashboard/equipment"
              element={<ManageEquipment />}
            />
            <Route
              path="/dashboard/equipment/:id"
              element={<ManageEquipmentDetails />}
            />
            <Route
              path="/dashboard/equipment/new"
              element={<AddEquipmentType />}
            />
            <Route
              path="/dashboard/equipment/:id/units/new"
              element={<AddEquipmentUnit />}
            />
            <Route
              path="/dashboard/equipment/:id/guides/new"
              element={<AddEquipmentGuide />}
            />
            <Route
              path="/dashboard/loans"
              element={<ManageLoans />}
            />
            <Route
              path="/dashboard/fault-reports"
              element={<ManageFaultReports />}
            />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/equipment" replace />}
      />
    </Routes>
  )
}


import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { Menu, X } from 'lucide-react'
import { removeToken } from '../services/token.js'
import Logo from './Logo.jsx'

export default function Navigation({ role }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const canManage = ['CARETAKER', 'ADMIN'].includes(role)

  const linkClasses = ({ isActive }) =>
    `block rounded-lg px-3 py-3 text-sm font-medium ${
      isActive
        ? 'bg-field text-brand'
        : 'text-body hover:bg-field'
    }`

  function handleLogout() {
    removeToken()
    setIsOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="w-full bg-white">
      <div className="mx-auto w-full px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Logo />

          {role && (
            <button
              type="button"
              onClick={() => setIsOpen((previous) => !previous)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="navigation-links"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-brand hover:bg-field focus-visible:outline-2 focus-visible:outline-brand"
            >
              {isOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          )}
        </div>

        {role && isOpen && (
          <nav
            id="navigation-links"
            aria-label="Main navigation"
            className="mt-3 border-t border-field-border pt-2"
          >
            <ul className="flex flex-col gap-1">
              <li>
                <NavLink
                  to="/equipment"
                  onClick={() => setIsOpen(false)}
                  className={linkClasses}
                >
                  Browse equipment
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/loans"
                  onClick={() => setIsOpen(false)}
                  className={linkClasses}
                >
                  My loans
                </NavLink>
              </li>

              {canManage && (
                <>
                  <li className="mt-3 border-t border-field-border pt-3 text-xs font-semibold text-muted">
                    MANAGEMENT
                  </li>

                  <li>
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className={linkClasses}
                    >
                      Management dashboard
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/dashboard/equipment"
                      onClick={() => setIsOpen(false)}
                      className={linkClasses}
                    >
                      Manage equipment
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/dashboard/loans"
                      onClick={() => setIsOpen(false)}
                      className={linkClasses}
                    >
                      Manage loans
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to="/dashboard/fault-reports"
                      onClick={() => setIsOpen(false)}
                      className={linkClasses}
                    >
                      Manage fault reports
                    </NavLink>
                  </li>
                </>
              )}

              <li className="mt-2 border-t border-field-border pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-11 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-body hover:bg-field"
                >
                  Log out
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}

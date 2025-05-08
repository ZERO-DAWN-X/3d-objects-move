import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useState } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, role, logout } = useAuthStore()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="backdrop-blur-md bg-white/80 fixed w-full top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/"
              className="flex items-center space-x-3 group"
            >
              <span className="text-2xl transform group-hover:scale-110 transition-transform">
                🎨
              </span>
              <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                RoomCraft
              </span>
            </Link>
          </div>

          {/* Center Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-blue-600 transition-all hover:translate-y-[-1px]"
              >
                My Designs
              </Link>
              <Link 
                to="/designer" 
                className="text-gray-600 hover:text-blue-600 transition-all hover:translate-y-[-1px]"
              >
                Room Designer
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 hover:bg-gray-50 rounded-full px-3 py-1.5 transition-colors"
                >
                  <span className="text-sm text-gray-700 font-medium hidden md:block">
                    {user.name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center text-white font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100 backdrop-blur-lg bg-white">
                    {role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-blue-600 px-4 py-1.5 rounded-full transition-colors text-sm"
                >
                  Log in
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-1.5 rounded-full hover:shadow-md transition-all text-sm"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 
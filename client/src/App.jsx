import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import Navbar from './components/ui/Navbar'
import Loading from './components/ui/Loading'
import Home from './pages/Home'
import AdminDashboard from './pages/admin/Dashboard'
import UserDashboard from './pages/user/Dashboard'
import RoomDesigner from './pages/RoomDesigner'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/designer" element={<RoomDesigner />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  )
}

export default App
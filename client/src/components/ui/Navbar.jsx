function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-800">
              Furniture Designer
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            <a href="/designer" className="text-gray-600 hover:text-gray-900">
              Room Designer
            </a>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 
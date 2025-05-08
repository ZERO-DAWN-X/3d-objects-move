function UserDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Designs</h1>

      {/* User's Saved Designs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New Design Card */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <span className="text-2xl text-blue-600">+</span>
          </div>
          <p className="text-gray-600 font-medium">Create New Design</p>
        </div>

        {/* Sample Saved Design Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800">Living Room Design</h3>
            <p className="text-sm text-gray-600 mt-1">Last edited: Never</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button className="text-blue-600 hover:text-blue-700">Edit</button>
              <button className="text-red-600 hover:text-red-700">Delete</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-xl shadow-md">
          <div className="p-6">
            <div className="space-y-4">
              <p className="text-gray-600">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard 
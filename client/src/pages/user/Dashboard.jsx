import { useNavigate } from 'react-router-dom'
import { useDesignStore } from '../../store/designStore'
import { useState } from 'react'

function UserDashboard() {
  const navigate = useNavigate()
  const { designs, deleteDesign, setActiveDesign, resetDesign } = useDesignStore()
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleNewDesign = () => {
    resetDesign()
    navigate('/designer')
  }

  const handleEditDesign = (designId) => {
    const design = designs.find(d => d.id === designId)
    if (design) {
      setActiveDesign({
        id: design.id,
        name: design.name,
        roomSettings: design.roomSettings,
        furniture: design.furniture,
        timestamp: design.timestamp
      })
      navigate('/designer')
    }
  }

  const handleDeleteDesign = (designId) => {
    deleteDesign(designId)
    setDeleteConfirm(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Designs</h1>
        <button
          onClick={handleNewDesign}
          className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-2.5 rounded-lg hover:shadow-md transition-all flex items-center space-x-2 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span>New Design</span>
        </button>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map(design => (
          <div 
            key={design.id} 
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all relative"
          >
            {/* Design Preview */}
            <div 
              className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleEditDesign(design.id)}
            >
              <div className="flex flex-col items-center text-gray-400">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                <span>Click to edit</span>
              </div>
            </div>

            {/* Design Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 truncate">
                  {design.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditDesign(design.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 cursor-pointer"
                    title="Edit Design"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(design.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                    title="Delete Design"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {new Date(design.timestamp).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span>{design.furniture.length} items</span>
              </div>
            </div>

            {/* Delete Confirmation Overlay */}
            {deleteConfirm === design.id && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Delete Design?
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete "{design.name}"? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteDesign(design.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Create New Design Card */}
        <button
          onClick={handleNewDesign}
          className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all group cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
            </svg>
          </div>
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            Create New Design
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Start from scratch
          </p>
        </button>
      </div>

      {/* Empty State */}
      {designs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">You haven't created any designs yet.</p>
          <button
            onClick={handleNewDesign}
            className="mt-4 text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Create your first design
          </button>
        </div>
      )}
    </div>
  )
}

export default UserDashboard 
import { useState } from 'react'
import { useDesignStore } from '../../store/designStore'
import { useAuthStore } from '../../store/authStore'
import { HexColorPicker } from 'react-colorful'
import { furnitureModels } from '../../config/furnitureModels'

function AdminDashboard() {
  const { designs, roomTemplates, updateRoomTemplate, deleteRoomTemplate } = useDesignStore()
  const { users } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [editingFurniture, setEditingFurniture] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(false)

  const handleTemplateSubmit = () => {
    if (!editingTemplate.name || !editingTemplate.width || !editingTemplate.length || !editingTemplate.height) {
      alert('Please fill in all required fields')
      return
    }

    updateRoomTemplate(editingTemplate)
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteRoomTemplate(templateId)
    }
  }

  const renderFurnitureTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Furniture Management</h2>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setEditingFurniture({})}
        >
          Add New Furniture
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(furnitureModels).map(([id, furniture]) => (
          <div key={id} className="border rounded-lg overflow-hidden">
            <div className="aspect-square bg-gray-50 p-4">
              <img 
                src={furniture.thumbnail} 
                alt={furniture.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-4 border-t bg-white">
              <h3 className="font-medium text-gray-900 mb-1">{furniture.name}</h3>
              <p className="text-sm text-gray-500">
                {furniture.dimensions.width}m × {furniture.dimensions.depth}m × {furniture.dimensions.height}m
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderTemplatesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Room Templates</h2>
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={() => setEditingTemplate({
            name: '',
            width: 4,
            length: 4,
            height: 3,
            wallColor: '#f5f5f5',
            floorColor: '#e0e0e0',
            suggestedFurniture: []
          })}
        >
          Add Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(roomTemplates).map(([id, template]) => (
          <div key={id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-500">
                  {template.width}m × {template.length}m × {template.height}m
                </p>
              </div>
              <div className="flex gap-2">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: template.wallColor }}
                  title="Wall Color"
                />
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: template.floorColor }}
                  title="Floor Color"
                />
              </div>
            </div>
            
            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => setEditingTemplate({ id, ...template })}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteTemplate(id)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('furniture')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'furniture' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Manage Furniture
          </button>
          <button 
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'templates' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Room Templates
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users?.length || 0}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Designs</h3>
          <p className="text-3xl font-bold text-blue-600">{designs.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Room Templates</h3>
          <p className="text-3xl font-bold text-blue-600">4</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-100">
          <nav className="flex gap-6 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('designs')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'designs'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Designs
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="border rounded-lg divide-y">
                {designs.slice(0, 5).map(design => (
                  <div key={design.id} className="p-4">
                    <p className="text-sm text-gray-600">
                      New design created: {design.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(design.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Designs</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users?.map(user => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {designs.filter(d => d.userId === user.id).length}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-blue-600 hover:text-blue-700">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'designs' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Designs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {designs.map(design => (
                  <div key={design.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{design.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Created: {new Date(design.timestamp).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">View</button>
                      <button className="text-red-600 hover:text-red-700 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'furniture' && renderFurnitureTab()}

          {activeTab === 'templates' && renderTemplatesTab()}
        </div>
      </div>

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingTemplate.id ? 'Edit Template' : 'New Template'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name*
                </label>
                <input
                  type="text"
                  value={editingTemplate.name || ''}
                  onChange={e => setEditingTemplate({
                    ...editingTemplate,
                    name: e.target.value
                  })}
                  className="w-full rounded-lg border border-gray-200 p-2"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Width (m)*
                  </label>
                  <input
                    type="number"
                    value={editingTemplate.width || ''}
                    onChange={e => setEditingTemplate({
                      ...editingTemplate,
                      width: parseFloat(e.target.value)
                    })}
                    className="w-full rounded-lg border border-gray-200 p-2"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Length (m)*
                  </label>
                  <input
                    type="number"
                    value={editingTemplate.length || ''}
                    onChange={e => setEditingTemplate({
                      ...editingTemplate,
                      length: parseFloat(e.target.value)
                    })}
                    className="w-full rounded-lg border border-gray-200 p-2"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (m)*
                  </label>
                  <input
                    type="number"
                    value={editingTemplate.height || ''}
                    onChange={e => setEditingTemplate({
                      ...editingTemplate,
                      height: parseFloat(e.target.value)
                    })}
                    className="w-full rounded-lg border border-gray-200 p-2"
                    min="1"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => setEditingTemplate(null)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleTemplateSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard 
import { useState } from 'react'
import { useDesignStore } from '../../store/designStore'
import { useNavigate } from 'react-router-dom'

function DesignManager({ onClose }) {
  const navigate = useNavigate()
  const { designs, loadDesign, editDesign, deleteDesign, duplicateDesign } = useDesignStore()
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleEdit = (design) => {
    setEditingId(design.id)
    setEditName(design.name)
  }

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      editDesign(editingId, { name: editName.trim() })
      setEditingId(null)
      setEditName('')
    }
  }

  const handleLoadDesign = (designId) => {
    loadDesign(designId)
    onClose()
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Saved Designs</h2>
      <div className="space-y-4">
        {designs.map(design => (
          <div key={design.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              {editingId === design.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border rounded px-2 py-1 w-48"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit()
                    if (e.key === 'Escape') {
                      setEditingId(null)
                      setEditName('')
                    }
                  }}
                />
              ) : (
                <h3 className="font-medium">{design.name}</h3>
              )}
              <div className="space-x-2">
                {editingId === design.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="text-green-600 hover:text-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setEditName('')
                      }}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => handleLoadDesign(design.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Load
                    </button>
                    <button 
                      onClick={() => handleEdit(design)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => duplicateDesign(design.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      Duplicate
                    </button>
                    <button 
                      onClick={() => deleteDesign(design.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Last modified: {new Date(design.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DesignManager 
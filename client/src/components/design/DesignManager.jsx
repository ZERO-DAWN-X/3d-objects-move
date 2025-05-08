import { useDesignStore } from '../../store/designStore'

function DesignManager() {
  const { designs, loadDesign, editDesign, deleteDesign, duplicateDesign } = useDesignStore()

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Saved Designs</h2>
      <div className="space-y-4">
        {designs.map(design => (
          <div key={design.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{design.name}</h3>
              <div className="space-x-2">
                <button 
                  onClick={() => loadDesign(design.id)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Load
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
import { useState, Suspense, useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { HexColorPicker } from 'react-colorful'
import Room from '../components/room/Room'
import Furniture from '../components/furniture/Furniture'
import { useDesignStore } from '../store/designStore'
import FurniturePicker from '../components/furniture/FurniturePicker'
import { furnitureModels } from '../config/furnitureModels'
import RoomView2D from '../components/room/RoomView2D'
import DesignManager from '../components/design/DesignManager'

function RoomDesigner() {
  const {
    roomSettings,
    setRoomSettings,
    furniture,
    addFurniture,
    updateFurniture,
    removeFurniture,
    saveDesign,
    designs,
    activeDesign,
    editDesign
  } = useDesignStore()

  const [showFurniturePicker, setShowFurniturePicker] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [activeColorTarget, setActiveColorTarget] = useState(null)
  const [selectedFurniture, setSelectedFurniture] = useState(null)
  const [saveNotification, setSaveNotification] = useState(false)
  const [viewMode, setViewMode] = useState('3D') // '3D' or '2D'
  const [showDesignManager, setShowDesignManager] = useState(false)
  const [designName, setDesignName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)

  // Update useEffect to properly handle active design
  useEffect(() => {
    if (activeDesign) {
      // If there's an active design, update the design name
      setDesignName(activeDesign.name)
    } else {
      // Reset states for new design
      setShowSaveDialog(false)
      setDesignName('')
      setSelectedFurniture(null)
      setShowColorPicker(false)
      setShowFurniturePicker(false)
    }
  }, [activeDesign])

  const handleColorChange = (color) => {
    if (activeColorTarget === 'wall') {
      setRoomSettings({ ...roomSettings, wallColor: color })
    } else if (activeColorTarget === 'floor') {
      setRoomSettings({ ...roomSettings, floorColor: color })
    } else if (activeColorTarget === 'furniture' && selectedFurniture) {
      const updatedColor = color.toLowerCase() // Ensure consistent color format
      updateFurniture(selectedFurniture, { color: updatedColor })
    }
  }

  const handleFurnitureSelect = (id) => {
    setSelectedFurniture(id)
    setActiveColorTarget('furniture')
    setShowColorPicker(true)
  }

  const currentColor = useMemo(() => {
    if (activeColorTarget === 'wall') return roomSettings.wallColor
    if (activeColorTarget === 'floor') return roomSettings.floorColor
    if (activeColorTarget === 'furniture' && selectedFurniture) {
      const item = furniture.find(f => f.id === selectedFurniture)
      return item ? item.color : '#ffffff'
    }
    return '#ffffff'
  }, [activeColorTarget, roomSettings, selectedFurniture, furniture])

  const handleAddFurniture = (type) => {
    addFurniture({
      id: Date.now(),
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: furnitureModels[type].defaultScale,
      color: '#ffffff',
      materials: {
        roughness: 0.7,
        metalness: 0.3,
        opacity: 1
      }
    })
    setShowFurniturePicker(false)
  }

  // Update handleSaveDesign to handle updates to existing designs
  const handleSaveDesign = () => {
    if (!designName.trim()) return

    const design = {
      name: designName.trim(),
      timestamp: Date.now(),
      roomSettings: { ...roomSettings },
      furniture: furniture.map(item => ({ ...item }))
    }

    // If we're editing an existing design, update it instead of creating new
    if (activeDesign) {
      editDesign(activeDesign.id, design)
    } else {
      saveDesign(design)
    }

    setDesignName('')
    setShowSaveDialog(false)
    setSaveNotification(true)
    setTimeout(() => setSaveNotification(false), 2000)
  }

  const handleHeightChange = (e) => {
    const newHeight = Math.max(0.1, Number(e.target.value)) // Prevent negative or zero height
    setRoomSettings({ 
      ...roomSettings,  // Keep all existing settings
      height: newHeight // Update only the height
    })
  }

  // Add this handler for material updates
  const handleMaterialUpdate = (updates) => {
    if (selectedFurniture) {
      const currentItem = furniture.find(f => f.id === selectedFurniture)
      const currentMaterials = currentItem?.materials || {
        roughness: 0.7,
        metalness: 0.3,
        opacity: 1
      }
      
      updateFurniture(selectedFurniture, {
        materials: {
          ...currentMaterials,
          ...updates
        }
      })
    }
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-96 bg-white shadow-lg p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Tools</h2>
        
        {/* Add view mode toggle at the top */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">View Mode</h3>
          <div className="flex gap-2">
            <button
              className={`flex-1 p-2 rounded ${
                viewMode === '3D' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setViewMode('3D')}
            >
              3D View
            </button>
            <button
              className={`flex-1 p-2 rounded ${
                viewMode === '2D' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setViewMode('2D')}
            >
              2D View
            </button>
          </div>
        </div>

        {/* Room Settings */}
        <div className="space-y-4 mb-6">
          <h3 className="font-medium text-gray-700">Room Settings</h3>
          <div className="space-y-2">
            <label className="block text-sm text-gray-600">Width (m)</label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={roomSettings.width}
              onChange={(e) => setRoomSettings({ ...roomSettings, width: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
            <label className="block text-sm text-gray-600">Length (m)</label>
            <input
              type="number"
              min="1"
              step="0.1"
              value={roomSettings.length}
              onChange={(e) => setRoomSettings({ ...roomSettings, length: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            />
            <label className="block text-sm text-gray-600">Height (m)</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={roomSettings.height}
              onChange={handleHeightChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4 mb-6">
          <h3 className="font-medium text-gray-700">Colors</h3>
          <div className="space-y-2">
            <button
              className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
              onClick={() => {
                setActiveColorTarget('wall')
                setSelectedFurniture(null)
                setShowColorPicker(true)
              }}
            >
              <span>Wall Color</span>
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: roomSettings.wallColor }}
              />
            </button>
            <button
              className="w-full flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100"
              onClick={() => {
                setActiveColorTarget('floor')
                setSelectedFurniture(null)
                setShowColorPicker(true)
              }}
            >
              <span>Floor Color</span>
              <div 
                className="w-6 h-6 rounded border"
                style={{ backgroundColor: roomSettings.floorColor }}
              />
            </button>
          </div>
        </div>

        {/* Updated Furniture Section */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Furniture</h3>
          <button
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            onClick={() => setShowFurniturePicker(true)}
          >
            Add Furniture
          </button>
          {furniture.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Placed Items</h4>
              {furniture.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: item.color }}
                      onClick={() => handleFurnitureSelect(item.id)}
                    />
                    <span className="text-sm">{furnitureModels[item.type].name}</span>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-700 text-sm"
                    onClick={() => removeFurniture(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Save Design button */}
        <div className="mt-6">
          <button
            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            onClick={() => setShowSaveDialog(true)}
          >
            Save Design
          </button>
          <button
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            onClick={() => setShowDesignManager(true)}
          >
            Manage Designs
          </button>
          {saveNotification && (
            <div className="mt-2 text-center text-sm text-green-600">
              Design saved successfully!
            </div>
          )}
        </div>

        {/* Selected Furniture Controls */}
        {selectedFurniture && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-medium text-gray-700 mb-4">Furniture Controls</h3>
            
            {/* Rotation Control */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Rotation</label>
              <input
                type="range"
                min="0"
                max="360"
                value={furniture.find(f => f.id === selectedFurniture)?.rotation[1] * (180/Math.PI)}
                onChange={(e) => updateFurniture(selectedFurniture, {
                  rotation: [0, e.target.value * (Math.PI/180), 0]
                })}
                className="w-full"
              />
            </div>

            {/* Scale Control */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Scale</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={furniture.find(f => f.id === selectedFurniture)?.scale || 1}
                onChange={(e) => updateFurniture(selectedFurniture, {
                  scale: parseFloat(e.target.value)
                })}
                className="w-full"
              />
            </div>

            {/* Material Controls */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Material Settings</h4>
              
              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Roughness</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={furniture.find(f => f.id === selectedFurniture)?.materials?.roughness || 0.7}
                  onChange={(e) => handleMaterialUpdate({ roughness: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Metalness</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={furniture.find(f => f.id === selectedFurniture)?.materials?.metalness || 0.3}
                  onChange={(e) => handleMaterialUpdate({ metalness: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-600">Opacity</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={furniture.find(f => f.id === selectedFurniture)?.materials?.opacity || 1}
                  onChange={(e) => handleMaterialUpdate({ opacity: parseFloat(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Color Control */}
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Color</label>
              <button
                className="w-full flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50"
                onClick={() => {
                  setActiveColorTarget('furniture')
                  setShowColorPicker(true)
                }}
              >
                <span className="text-sm">Change Color</span>
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: furniture.find(f => f.id === selectedFurniture)?.color }}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Viewport */}
      <div className="flex-1 bg-gray-100 relative">
        {viewMode === '3D' ? (
          <Canvas>
            <PerspectiveCamera makeDefault position={[10, 10, 10]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <Room {...roomSettings} />
              {furniture.map(item => (
                <Furniture
                  key={item.id}
                  {...item}
                  materials={item.materials || {
                    roughness: 0.7,
                    metalness: 0.3,
                    opacity: 1
                  }}
                  onUpdate={(id, updates) => updateFurniture(id, updates)}
                  onSelect={() => handleFurnitureSelect(item.id)}
                />
              ))}
            </Suspense>
            <OrbitControls />
          </Canvas>
        ) : (
          <RoomView2D
            width={roomSettings.width}
            length={roomSettings.length}
            furniture={furniture}
            wallColor={roomSettings.wallColor}
            floorColor={roomSettings.floorColor}
            onFurnitureUpdate={updateFurniture}
            onFurnitureSelect={handleFurnitureSelect}
          />
        )}

        {/* Color Picker Overlay */}
        {showColorPicker && (
          <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
            <div className="text-sm font-medium mb-2">
              {activeColorTarget === 'wall' ? 'Wall Color' :
               activeColorTarget === 'floor' ? 'Floor Color' :
               'Furniture Color'}
            </div>
            <HexColorPicker
              color={currentColor}
              onChange={handleColorChange}
            />
            <button
              className="mt-2 w-full bg-gray-100 p-2 rounded hover:bg-gray-200"
              onClick={() => {
                setShowColorPicker(false)
                setSelectedFurniture(null)
              }}
            >
              Close
            </button>
          </div>
        )}

        {showFurniturePicker && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">Add Furniture</h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowFurniturePicker(false)}
              >
                ✕
              </button>
            </div>
            <FurniturePicker onSelect={handleAddFurniture} />
          </div>
        )}

        {/* Add Design Manager Overlay */}
        {showDesignManager && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Manage Designs</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDesignManager(false)}
                >
                  ✕
                </button>
              </div>
              <DesignManager onClose={() => setShowDesignManager(false)} />
            </div>
          </div>
        )}

        {/* Add this save dialog */}
        {showSaveDialog && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-4 w-96">
              <h3 className="text-lg font-semibold mb-4">Save Design</h3>
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder="Enter design name"
                className="w-full p-2 border rounded mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  onClick={() => {
                    setShowSaveDialog(false)
                    setDesignName('')
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  onClick={handleSaveDesign}
                  disabled={!designName.trim()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomDesigner 
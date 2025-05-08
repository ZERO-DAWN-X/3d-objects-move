import { useState, Suspense, useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment, SoftShadows } from '@react-three/drei'
import { HexColorPicker } from 'react-colorful'
import Room from '../components/room/Room'
import Furniture from '../components/furniture/Furniture'
import { useDesignStore } from '../store/designStore'
import FurniturePicker from '../components/furniture/FurniturePicker'
import { furnitureModels } from '../config/furnitureModels'
import RoomView2D from '../components/room/RoomView2D'
import DesignManager from '../components/design/DesignManager'
import RoomTemplateSelector from '../components/room/RoomTemplateSelector'

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
    editDesign,
    roomTemplate,
    setRoomTemplate
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
      {/* Modern Sidebar */}
      <div className="w-96 bg-white/80 backdrop-blur-md border-r border-gray-100 p-6 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Design Tools
          </h2>
        </div>

        {/* View Mode Selector */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            View Mode
          </h3>
          <div className="bg-gray-50 p-1 rounded-lg flex gap-1">
            <button
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                viewMode === '3D'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setViewMode('3D')}
            >
              3D View
            </button>
            <button
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                viewMode === '2D'
                  ? 'bg-white shadow-sm text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setViewMode('2D')}
            >
              2D View
            </button>
          </div>
        </div>

        {/* Room Template Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Room Template
            </h3>
            {/* Optional: Add a reset button */}
            <button
              onClick={() => setRoomTemplate(null)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Reset
            </button>
          </div>
          <div className="bg-gray-50/50 backdrop-blur-sm p-3 rounded-xl">
            <RoomTemplateSelector />
          </div>
        </div>

        {/* Room Settings */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Room Dimensions
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Width', key: 'width', unit: 'm' },
              { label: 'Length', key: 'length', unit: 'm' },
              { label: 'Height', key: 'height', unit: 'm' }
            ].map((dimension) => (
              <div key={dimension.key} className="relative">
                <label className="text-sm text-gray-600 mb-1 block">
                  {dimension.label}
                </label>
                <input
                  type="number"
                  min={dimension.key === 'height' ? '0.1' : '1'}
                  step="0.1"
                  value={roomSettings[dimension.key]}
                  onChange={(e) => 
                    setRoomSettings({ 
                      ...roomSettings, 
                      [dimension.key]: Number(e.target.value) 
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-3 top-9 text-gray-400 text-sm">
                  {dimension.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Colors Section */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Room Colors
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Wall Color', target: 'wall', color: roomSettings.wallColor },
              { label: 'Floor Color', target: 'floor', color: roomSettings.floorColor }
            ].map((item) => (
              <button
                key={item.target}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all group"
                onClick={() => {
                  setActiveColorTarget(item.target)
                  setSelectedFurniture(null)
                  setShowColorPicker(true)
                }}
              >
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {item.label}
                </span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-400 group-hover:text-gray-600">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Furniture Section */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            Furniture
          </h3>
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all mb-4"
            onClick={() => setShowFurniturePicker(true)}
          >
            Add Furniture
          </button>
          
          {furniture.length > 0 && (
            <div className="space-y-2">
              {furniture.map(item => (
                <div 
                  key={item.id} 
                  className={`p-3 rounded-lg transition-all ${
                    selectedFurniture === item.id 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm cursor-pointer"
                        style={{ backgroundColor: item.color }}
                        onClick={() => handleFurnitureSelect(item.id)}
                      />
                      <span className="text-sm text-gray-700">
                        {furnitureModels[item.type].name}
                      </span>
                    </div>
                    <button
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      onClick={() => removeFurniture(item.id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Furniture Controls */}
        {selectedFurniture && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Furniture Controls
              </h3>
              <button
                onClick={() => setSelectedFurniture(null)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Control Sections */}
            <div className="space-y-6">
              {/* Rotation Control */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Rotation</label>
                  <span className="text-sm text-gray-500">
                    {Math.round(furniture.find(f => f.id === selectedFurniture)?.rotation[1] * (180/Math.PI))}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={furniture.find(f => f.id === selectedFurniture)?.rotation[1] * (180/Math.PI)}
                  onChange={(e) => updateFurniture(selectedFurniture, {
                    rotation: [0, e.target.value * (Math.PI/180), 0]
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Scale Control */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Scale</label>
                  <span className="text-sm text-gray-500">
                    {furniture.find(f => f.id === selectedFurniture)?.scale || 1}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={furniture.find(f => f.id === selectedFurniture)?.scale || 1}
                  onChange={(e) => updateFurniture(selectedFurniture, {
                    scale: parseFloat(e.target.value)
                  })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Material Controls */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Material Properties</h4>
                
                {/* Roughness Control */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Roughness</label>
                    <span className="text-sm text-gray-500">
                      {furniture.find(f => f.id === selectedFurniture)?.materials?.roughness || 0.7}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={furniture.find(f => f.id === selectedFurniture)?.materials?.roughness || 0.7}
                    onChange={(e) => handleMaterialUpdate({ roughness: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Metalness Control */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Metalness</label>
                    <span className="text-sm text-gray-500">
                      {furniture.find(f => f.id === selectedFurniture)?.materials?.metalness || 0.3}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={furniture.find(f => f.id === selectedFurniture)?.materials?.metalness || 0.3}
                    onChange={(e) => handleMaterialUpdate({ metalness: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Opacity Control */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">Opacity</label>
                    <span className="text-sm text-gray-500">
                      {furniture.find(f => f.id === selectedFurniture)?.materials?.opacity || 1}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={furniture.find(f => f.id === selectedFurniture)?.materials?.opacity || 1}
                    onChange={(e) => handleMaterialUpdate({ opacity: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>

              {/* Color Control */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Color</label>
                  <button
                    onClick={() => {
                      setActiveColorTarget('furniture')
                      setShowColorPicker(true)
                    }}
                    className="flex items-center space-x-2 group"
                  >
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-110"
                      style={{ backgroundColor: furniture.find(f => f.id === selectedFurniture)?.color }}
                    />
                    <span className="text-sm text-gray-500 group-hover:text-blue-600">Change</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 mt-8">
          <button
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 px-4 rounded-lg hover:shadow-md transition-all"
            onClick={() => setShowSaveDialog(true)}
          >
            Save Design
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 bg-gray-100 relative">
        {viewMode === '3D' ? (
          <Canvas shadows>
            <SoftShadows size={2.5} samples={16} focus={0.5} />
            
            <PerspectiveCamera makeDefault position={[10, 5, 10]} />
            
            {/* Lighting setup for realism */}
            <ambientLight intensity={0.3} />
            <directionalLight
              castShadow
              position={[2.5, 8, 5]}
              intensity={1.5}
              shadow-mapSize={[1024, 1024]}
            >
              <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
            </directionalLight>
            
            {/* Subtle fill light */}
            <pointLight position={[-10, 5, -10]} intensity={0.2} />
            
            {/* Add environment map for realistic reflections */}
            <Environment preset="apartment" />
            
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
            
            <OrbitControls 
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 2.1}
              minDistance={2}
              maxDistance={20}
            />
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

        {/* Furniture Picker Modal */}
        {showFurniturePicker && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[800px] max-h-[80vh] transform transition-all">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                      Add Furniture
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Choose furniture to add to your room
                    </p>
                  </div>
                  <button
                    onClick={() => setShowFurniturePicker(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Search and Categories */}
                <div className="mt-4 flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search furniture..."
                      className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                      className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                      All
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                      Seating
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">
                      Storage
                    </button>
                  </div>
                </div>
              </div>

              {/* Furniture Grid */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(furnitureModels).map(([id, item]) => (
                    <button
                      key={id}
                      className="group bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
                      onClick={() => handleAddFurniture(id)}
                    >
                      <div className="aspect-square bg-gray-50 rounded-lg mb-3 p-4 group-hover:bg-blue-50 transition-colors">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.dimensions.width}m × {item.dimensions.depth}m × {item.dimensions.height}m
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Click on an item to add it to your room
                  </p>
                  <button
                    onClick={() => setShowFurniturePicker(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Design Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-[450px] transform transition-all">
              {/* Dialog Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                      {activeDesign ? 'Update Design' : 'Save Design'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {activeDesign ? 'Update your existing design' : 'Save your design to access it later'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSaveDialog(false)
                      setDesignName('')
                    }}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dialog Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="designName" className="block text-sm font-medium text-gray-700 mb-1">
                      Design Name
                    </label>
                    <div className="relative">
                      <input
                        id="designName"
                        type="text"
                        value={designName}
                        onChange={(e) => setDesignName(e.target.value)}
                        placeholder="Enter a name for your design"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                        autoFocus
                      />
                      {designName && (
                        <button
                          onClick={() => setDesignName('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Design Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Design Summary</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-500">Room Dimensions</p>
                        <p className="text-gray-700">
                          {roomSettings.width}m × {roomSettings.length}m × {roomSettings.height}m
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-500">Furniture Items</p>
                        <p className="text-gray-700">{furniture.length} pieces</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dialog Footer */}
              <div className="p-6 border-t border-gray-100">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowSaveDialog(false)
                      setDesignName('')
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDesign}
                    disabled={!designName.trim()}
                    className={`px-6 py-2 text-sm font-medium rounded-lg transition-all
                      ${designName.trim()
                        ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    {activeDesign ? 'Update Design' : 'Save Design'}
                  </button>
                </div>
              </div>

              {/* Success Notification */}
              {saveNotification && (
                <div className="absolute top-4 right-4 bg-green-50 text-green-700 px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in-down">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Design saved successfully!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoomDesigner 
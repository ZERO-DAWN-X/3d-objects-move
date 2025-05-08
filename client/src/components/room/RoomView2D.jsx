import { Stage, Layer, Rect, Group, Text } from 'react-konva'
import { useState, useRef, useEffect } from 'react'
import { furnitureModels } from '../../config/furnitureModels'

function RoomView2D({ 
  width, 
  length, 
  furniture, 
  wallColor, 
  floorColor, 
  onFurnitureUpdate, 
  onFurnitureSelect 
}) {
  const [stageWidth, setStageWidth] = useState(0)
  const [stageHeight, setStageHeight] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [showGrid, setShowGrid] = useState(true)
  const [scale, setScale] = useState(50) // pixels per meter
  const stageRef = useRef()
  const containerRef = useRef()

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setStageWidth(containerRef.current.offsetWidth)
        setStageHeight(containerRef.current.offsetHeight)
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const gridSize = 1 // 1 meter grid
  const padding = 50 // padding around the room

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-gray-100"
    >
      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 z-10 space-y-4">
        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg p-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setScale(Math.max(20, scale - 10))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
              </svg>
            </button>
            <span className="text-sm text-gray-600 font-medium">
              {Math.round(scale)}%
            </span>
            <button
              onClick={() => setScale(Math.min(100, scale + 10))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Grid Toggle */}
        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg transition-colors ${
            showGrid ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/>
          </svg>
          <span className="text-sm font-medium">Grid</span>
        </button>
      </div>

      {/* Dimensions Display */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Room Dimensions</p>
          <p className="text-sm font-medium text-gray-700">
            {width}m × {length}m
          </p>
        </div>
      </div>

      <Stage 
        width={stageWidth} 
        height={stageHeight} 
        ref={stageRef}
        className="bg-white"
      >
        <Layer>
          {/* Grid */}
          {showGrid && Array.from({ length: Math.ceil(width) }).map((_, i) => (
            <Group key={`grid-col-${i}`}>
              <Rect
                x={(stageWidth - width * scale) / 2 + i * scale}
                y={(stageHeight - length * scale) / 2}
                width={1}
                height={length * scale}
                fill="#e5e7eb"
              />
              <Text
                x={(stageWidth - width * scale) / 2 + i * scale - 10}
                y={(stageHeight - length * scale) / 2 - 20}
                text={`${i}m`}
                fontSize={12}
                fill="#6b7280"
              />
            </Group>
          ))}
          {showGrid && Array.from({ length: Math.ceil(length) }).map((_, i) => (
            <Group key={`grid-row-${i}`}>
              <Rect
                x={(stageWidth - width * scale) / 2}
                y={(stageHeight - length * scale) / 2 + i * scale}
                width={width * scale}
                height={1}
                fill="#e5e7eb"
              />
              <Text
                x={(stageWidth - width * scale) / 2 - 30}
                y={(stageHeight - length * scale) / 2 + i * scale - 6}
                text={`${i}m`}
                fontSize={12}
                fill="#6b7280"
              />
            </Group>
          ))}

          {/* Room Floor */}
          <Rect
            x={(stageWidth - width * scale) / 2}
            y={(stageHeight - length * scale) / 2}
            width={width * scale}
            height={length * scale}
            fill={floorColor}
            stroke={wallColor}
            strokeWidth={2}
          />

          {/* Furniture */}
          {furniture.map(item => {
            const isSelected = item.id === selectedId
            const x = (stageWidth - width * scale) / 2 + (item.position[0] + width/2) * scale
            const y = (stageHeight - length * scale) / 2 + (item.position[2] + length/2) * scale
            const model = furnitureModels[item.type]

            return (
              <Group
                key={item.id}
                x={x}
                y={y}
                rotation={item.rotation[1] * (180/Math.PI)}
                draggable
                onDragMove={(e) => {
                  const newX = (e.target.x() - (stageWidth - width * scale) / 2) / scale - width/2
                  const newZ = (e.target.y() - (stageHeight - length * scale) / 2) / scale - length/2
                  onFurnitureUpdate(item.id, {
                    position: [newX, item.position[1], newZ]
                  })
                }}
                onClick={() => {
                  setSelectedId(item.id)
                  onFurnitureSelect(item.id)
                }}
              >
                {/* Furniture Shape */}
                <Rect
                  width={model.dimensions.width * scale}
                  height={model.dimensions.depth * scale}
                  x={-(model.dimensions.width * scale) / 2}
                  y={-(model.dimensions.depth * scale) / 2}
                  fill={item.color}
                  stroke={isSelected ? '#3b82f6' : '#e5e7eb'}
                  strokeWidth={isSelected ? 2 : 1}
                  shadowColor={isSelected ? 'rgba(59, 130, 246, 0.5)' : 'transparent'}
                  shadowBlur={10}
                  shadowOpacity={0.5}
                />
                
                {/* Furniture Label */}
                <Text
                  text={model.name}
                  fontSize={12}
                  fill={isSelected ? '#3b82f6' : '#6b7280'}
                  x={-(model.dimensions.width * scale) / 2}
                  y={-(model.dimensions.depth * scale) / 2 - 20}
                  width={model.dimensions.width * scale}
                  align="center"
                />
              </Group>
            )
          })}
        </Layer>
      </Stage>
    </div>
  )
}

export default RoomView2D 
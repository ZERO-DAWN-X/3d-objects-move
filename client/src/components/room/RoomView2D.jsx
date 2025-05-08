import { useRef, useState } from 'react'
import { Stage, Layer, Rect, Group, Circle, Line } from 'react-konva'

function RoomView2D({ width, length, furniture, wallColor, floorColor, onFurnitureUpdate, onFurnitureSelect }) {
  const stageRef = useRef()
  const [selectedId, setSelectedId] = useState(null)

  const scale = 50 // pixels per meter
  const stageWidth = Math.max(800, width * scale)
  const stageHeight = Math.max(600, length * scale)

  const handleRotate = (id, e) => {
    const item = furniture.find(f => f.id === id)
    if (!item) return

    const furniture = stageRef.current.getStage()
    const furniturePos = { x: item.position[0] * scale, y: item.position[2] * scale }
    const mousePos = furniture.getPointerPosition()

    const angle = Math.atan2(
      mousePos.y - furniturePos.y,
      mousePos.x - furniturePos.x
    )

    onFurnitureUpdate(id, {
      rotation: [0, angle, 0]
    })
  }

  return (
    <Stage 
      width={stageWidth} 
      height={stageHeight} 
      ref={stageRef}
      style={{ background: '#f0f0f0' }}
    >
      <Layer>
        {/* Room outline */}
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
              <Rect
                width={30}
                height={30}
                fill={item.color}
                offsetX={15}
                offsetY={15}
                stroke={isSelected ? '#2196F3' : undefined}
                strokeWidth={isSelected ? 2 : undefined}
              />
              {isSelected && (
                <>
                  {/* Rotation handle */}
                  <Circle
                    x={0}
                    y={-40}
                    radius={8}
                    fill="#2196F3"
                    draggable
                    onDragMove={(e) => {
                      e.cancelBubble = true
                      handleRotate(item.id, e)
                    }}
                  />
                  <Line
                    points={[0, 0, 0, -40]}
                    stroke="#2196F3"
                    strokeWidth={2}
                  />
                </>
              )}
            </Group>
          )
        })}
      </Layer>
    </Stage>
  )
}

export default RoomView2D 
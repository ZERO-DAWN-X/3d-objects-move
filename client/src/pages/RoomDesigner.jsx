import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function RoomDesigner() {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Tools</h2>
        <div className="space-y-4">
          <button className="w-full bg-gray-100 p-2 rounded hover:bg-gray-200">
            Add Furniture
          </button>
          <button className="w-full bg-gray-100 p-2 rounded hover:bg-gray-200">
            Room Settings
          </button>
          <button className="w-full bg-gray-100 p-2 rounded hover:bg-gray-200">
            Color Picker
          </button>
        </div>
      </div>

      {/* 3D Viewport */}
      <div className="flex-1 bg-gray-100">
        <Canvas camera={{ position: [5, 5, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls />
          {/* Room and furniture components will be added here */}
        </Canvas>
      </div>
    </div>
  )
}

export default RoomDesigner 
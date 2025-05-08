import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Furniture from './Furniture'

function FurniturePreview({ type }) {
  return (
    <div className="aspect-square bg-gray-50 rounded-lg">
      <Canvas camera={{ position: [2, 2, 2] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Furniture 
          type={type}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          scale={1}
          color="#ffffff"
          materials={{
            roughness: 0.7,
            metalness: 0.3,
            opacity: 1
          }}
        />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}

export default FurniturePreview 
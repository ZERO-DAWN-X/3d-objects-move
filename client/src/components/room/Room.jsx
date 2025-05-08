import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Grid, useTexture } from '@react-three/drei'

function Room({ 
  width = 10, 
  length = 10, 
  height = 3, 
  wallColor = '#ffffff', 
  floorColor = '#f0f0f0',
  showGrid = true 
}) {
  const roomRef = useRef()
  
  // Load textures for more realism
  const textures = useTexture({
    floorNormal: '/textures/wood_normal.jpg',
    floorRoughness: '/textures/wood_roughness.jpg',
    wallNormal: '/textures/wall_normal.jpg',
    wallRoughness: '/textures/wall_roughness.jpg'
  })

  useEffect(() => {
    if (roomRef.current) {
      const floor = roomRef.current.children[0]
      if (floor) {
        floor.position.y = 0
      }

      // Update walls positions
      const [_, leftWall, rightWall, backWall, frontWall] = roomRef.current.children
      if (leftWall) {
        leftWall.position.set(-width/2, height/2, 0)
      }
      if (rightWall) {
        rightWall.position.set(width/2, height/2, 0)
      }
      if (backWall) {
        backWall.position.set(0, height/2, -length/2)
      }
      if (frontWall) {
        frontWall.position.set(0, height/2, length/2)
      }
    }
  }, [width, length, height])

  useFrame(() => {
    // Animation logic can be added here if needed
  })

  return (
    <group ref={roomRef}>
      {/* Floor with enhanced materials */}
      <Box args={[width, 0.1, length]} position={[0, 0, 0]} receiveShadow>
        <meshStandardMaterial 
          color={floorColor}
          normalMap={textures.floorNormal}
          roughnessMap={textures.floorRoughness}
          roughness={0.8}
          metalness={0.2}
        />
      </Box>

      {/* Optional grid helper */}
      {showGrid && (
        <Grid
          position={[0, 0.01, 0]}
          args={[width, length, width, length]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={1}
          fadeDistance={30}
          fadeStrength={1}
        />
      )}

      {/* Walls with enhanced materials */}
      <Box args={[0.1, height, length]} position={[-width/2, height/2, 0]} castShadow receiveShadow>
        <meshStandardMaterial 
          color={wallColor}
          normalMap={textures.wallNormal}
          roughnessMap={textures.wallRoughness}
          roughness={0.95}
          metalness={0}
        />
      </Box>
      <Box args={[0.1, height, length]} position={[width/2, height/2, 0]} castShadow receiveShadow>
        <meshStandardMaterial 
          color={wallColor}
          normalMap={textures.wallNormal}
          roughnessMap={textures.wallRoughness}
          roughness={0.95}
          metalness={0}
        />
      </Box>
      <Box args={[width, height, 0.1]} position={[0, height/2, -length/2]} castShadow receiveShadow>
        <meshStandardMaterial 
          color={wallColor}
          normalMap={textures.wallNormal}
          roughnessMap={textures.wallRoughness}
          roughness={0.95}
          metalness={0}
        />
      </Box>
      <Box args={[width, height, 0.1]} position={[0, height/2, length/2]} castShadow receiveShadow>
        <meshStandardMaterial 
          color={wallColor}
          normalMap={textures.wallNormal}
          roughnessMap={textures.wallRoughness}
          roughness={0.95}
          metalness={0}
        />
      </Box>

      {/* Add baseboard trim */}
      <Box 
        args={[0.05, 0.2, length]} 
        position={[-width/2 + 0.025, 0.1, 0]}
      >
        <meshStandardMaterial color="#e5e5e5" />
      </Box>
      <Box 
        args={[0.05, 0.2, length]} 
        position={[width/2 - 0.025, 0.1, 0]}
      >
        <meshStandardMaterial color="#e5e5e5" />
      </Box>
      <Box 
        args={[width, 0.2, 0.05]} 
        position={[0, 0.1, -length/2 + 0.025]}
      >
        <meshStandardMaterial color="#e5e5e5" />
      </Box>
      <Box 
        args={[width, 0.2, 0.05]} 
        position={[0, 0.1, length/2 - 0.025]}
      >
        <meshStandardMaterial color="#e5e5e5" />
      </Box>
    </group>
  )
}

export default Room 
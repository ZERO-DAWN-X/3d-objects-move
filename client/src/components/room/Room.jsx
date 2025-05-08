import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box } from '@react-three/drei'

function Room({ width = 10, length = 10, height = 3, wallColor = '#ffffff', floorColor = '#f0f0f0' }) {
  const roomRef = useRef()

  // Update room dimensions when they change
  useEffect(() => {
    if (roomRef.current) {
      // Update floor position based on new height
      const floor = roomRef.current.children[0]
      if (floor) {
        floor.position.y = -height/2
      }

      // Update walls positions
      const [_, leftWall, rightWall, backWall, frontWall] = roomRef.current.children
      if (leftWall) {
        leftWall.position.set(-width/2, 0, 0)
      }
      if (rightWall) {
        rightWall.position.set(width/2, 0, 0)
      }
      if (backWall) {
        backWall.position.set(0, 0, -length/2)
      }
      if (frontWall) {
        frontWall.position.set(0, 0, length/2)
      }
    }
  }, [width, length, height])

  useFrame(() => {
    // Animation logic can be added here if needed
  })

  return (
    <group ref={roomRef}>
      {/* Floor */}
      <Box args={[width, 0.1, length]} position={[0, -height/2, 0]}>
        <meshStandardMaterial color={floorColor} />
      </Box>

      {/* Walls */}
      <Box args={[0.1, height, length]} position={[-width/2, 0, 0]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
      <Box args={[0.1, height, length]} position={[width/2, 0, 0]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
      <Box args={[width, height, 0.1]} position={[0, 0, -length/2]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
      <Box args={[width, height, 0.1]} position={[0, 0, length/2]}>
        <meshStandardMaterial color={wallColor} />
      </Box>
    </group>
  )
}

export default Room 
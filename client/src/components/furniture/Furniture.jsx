import { useRef, useState, useEffect, useMemo } from 'react'
import { useGLTF, Html } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { furnitureModels } from '../../config/furnitureModels'

function Furniture({ id, type, position, rotation, scale, color, onUpdate, onSelect, materials }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [selected, setSelected] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [useGeometric, setUseGeometric] = useState(false)
  const { camera, gl } = useThree()

  // Try to load GLB model with error handling
  let modelData = null
  try {
    modelData = useGLTF(furnitureModels[type].modelPath)
  } catch (error) {
    console.warn(`Failed to load model for ${type}, using geometric fallback`)
    if (!useGeometric) setUseGeometric(true)
  }

  // Create a new material for the model
  const material = useMemo(() => (
    new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: materials?.roughness || 0.7,
      metalness: materials?.metalness || 0.3,
      opacity: materials?.opacity || 1,
      transparent: materials?.opacity < 1
    })
  ), [color, materials])

  // Update model materials when color changes
  useEffect(() => {
    if (modelData && !useGeometric && meshRef.current) {
      meshRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material = material
        }
      })
    }
  }, [color, material, modelData, useGeometric])

  // Initial model setup
  useEffect(() => {
    if (modelData && !useGeometric && meshRef.current) {
      const clonedScene = modelData.scene.clone()
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          child.material = material
        }
      })
      meshRef.current.clear()
      meshRef.current.add(clonedScene)
    }
  }, [modelData, useGeometric, material])

  // Handle dragging
  const handlePointerDown = (e) => {
    e.stopPropagation()
    setIsDragging(true)
    gl.domElement.style.cursor = 'grabbing'
  }

  const handlePointerUp = () => {
    setIsDragging(false)
    gl.domElement.style.cursor = 'auto'
  }

  const handlePointerMove = (e) => {
    if (isDragging) {
      e.stopPropagation()
      const { point } = e
      onUpdate(id, {
        position: [point.x, position[1], point.z]
      })
    }
  }

  // Add rotation control
  const handleRotate = (angle) => {
    onUpdate(id, {
      rotation: [0, angle, 0]
    })
  }

  useFrame(() => {
    if (meshRef.current) {
      if (hovered && !isDragging) {
        meshRef.current.scale.lerp(new THREE.Vector3(scale * 1.1, scale * 1.1, scale * 1.1), 0.1)
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
      }
    }
  })

  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation()
        setSelected(!selected)
        if (onSelect) onSelect(id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        gl.domElement.style.cursor = 'grab'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        gl.domElement.style.cursor = 'auto'
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      {useGeometric || !modelData ? (
        <GeometricModel 
          modelConfig={furnitureModels[type].geometry} 
          color={color}
          selected={selected}
          materials={materials}
        />
      ) : null}
    </group>
  )
}

function GeometricModel({ modelConfig, color, selected, materials }) {
  const material = useMemo(() => (
    new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: materials?.roughness || 0.7,
      metalness: materials?.metalness || 0.3,
      opacity: materials?.opacity || 1,
      transparent: materials?.opacity < 1
    })
  ), [color, materials])

  if (!modelConfig || !modelConfig.parts) {
    // Fallback if no geometric model is defined
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <primitive object={material} attach="material" />
      </mesh>
    )
  }

  return (
    <group>
      {modelConfig.parts.map((part, index) => (
        <mesh
          key={index}
          position={part.position}
          rotation={part.rotation || [0, 0, 0]}
        >
          <primitive object={part.geometry} />
          <primitive object={material} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

function ControlHandles({ onRotate }) {
  return (
    <group position={[0, 2, 0]}>
      <mesh onClick={(e) => {
        e.stopPropagation()
        onRotate(Math.PI / 2)
      }}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="blue" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export default Furniture 
import * as THREE from 'three'

export const furnitureCategories = [
  { id: 'seating', name: 'Seating' },
  { id: 'tables', name: 'Tables' },
  { id: 'storage', name: 'Storage' },
  { id: 'decor', name: 'Decor' }
]

export const furnitureModels = {
  chair: {
    name: 'Chair',
    modelPath: '/models/chair.glb',
    category: 'seating',
    defaultScale: 1,
    dimensions: { width: 0.6, height: 0.9, depth: 0.6 },
    geometry: {
      type: 'group',
      parts: [
        // Seat
        {
          geometry: new THREE.BoxGeometry(0.5, 0.1, 0.5),
          position: [0, 0.45, 0],
          material: { color: '#8B4513' }
        },
        // Back
        {
          geometry: new THREE.BoxGeometry(0.5, 0.6, 0.1),
          position: [0, 0.75, -0.2],
          material: { color: '#8B4513' }
        },
        // Legs
        {
          geometry: new THREE.CylinderGeometry(0.05, 0.05, 0.45),
          position: [0.2, 0.225, 0.2],
          material: { color: '#4A3728' }
        },
        {
          geometry: new THREE.CylinderGeometry(0.05, 0.05, 0.45),
          position: [-0.2, 0.225, 0.2],
          material: { color: '#4A3728' }
        },
        {
          geometry: new THREE.CylinderGeometry(0.05, 0.05, 0.45),
          position: [0.2, 0.225, -0.2],
          material: { color: '#4A3728' }
        },
        {
          geometry: new THREE.CylinderGeometry(0.05, 0.05, 0.45),
          position: [-0.2, 0.225, -0.2],
          material: { color: '#4A3728' }
        }
      ]
    }
  },
  table: {
    name: 'Dining Table',
    modelPath: '/models/table.glb',
    category: 'tables',
    defaultScale: 1,
    dimensions: { width: 1.5, height: 0.75, depth: 0.9 },
    geometry: {
      type: 'group',
      parts: [
        // Table top
        {
          geometry: new THREE.BoxGeometry(1.5, 0.05, 0.9),
          position: [0, 0.75, 0],
          material: { color: '#8B4513' }
        },
        // Legs
        {
          geometry: new THREE.BoxGeometry(0.1, 0.75, 0.1),
          position: [0.65, 0.375, 0.35],
          material: { color: '#4A3728' }
        },
        {
          geometry: new THREE.BoxGeometry(0.1, 0.75, 0.1),
          position: [-0.65, 0.375, 0.35],
          material: { color: '#4A3728' }
        },
        {
          geometry: new THREE.BoxGeometry(0.1, 0.75, 0.1),
          position: [0.65, 0.375, -0.35],
          material: { color: '#4A3728' }
        },
        {
          geometry: new THREE.BoxGeometry(0.1, 0.75, 0.1),
          position: [-0.65, 0.375, -0.35],
          material: { color: '#4A3728' }
        }
      ]
    }
  },
  sofa: {
    name: 'Sofa',
    modelPath: '/models/sofa.glb',
    category: 'seating',
    defaultScale: 1,
    dimensions: { width: 2, height: 0.85, depth: 0.9 },
    geometry: {
      type: 'group',
      parts: [
        // Base
        {
          geometry: new THREE.BoxGeometry(2, 0.4, 0.9),
          position: [0, 0.2, 0],
          material: { color: '#666666' }
        },
        // Back
        {
          geometry: new THREE.BoxGeometry(2, 0.6, 0.2),
          position: [0, 0.7, -0.35],
          material: { color: '#666666' }
        },
        // Arms
        {
          geometry: new THREE.BoxGeometry(0.2, 0.5, 0.9),
          position: [0.9, 0.45, 0],
          material: { color: '#666666' }
        },
        {
          geometry: new THREE.BoxGeometry(0.2, 0.5, 0.9),
          position: [-0.9, 0.45, 0],
          material: { color: '#666666' }
        }
      ]
    }
  },
  diningTable: {
    name: 'Dining Table',
    category: 'tables',
    defaultScale: 1,
    dimensions: { width: 2.0, height: 0.75, depth: 1.2 },
    geometry: {
      type: 'group',
      parts: [
        // Table top with beveled edges
        {
          geometry: new THREE.BoxGeometry(2.0, 0.05, 1.2),
          position: [0, 0.75, 0],
          material: { 
            color: '#8B4513',
            roughness: 0.3,
            metalness: 0.1
          }
        },
        // Center support
        {
          geometry: new THREE.CylinderGeometry(0.15, 0.25, 0.65, 8),
          position: [0, 0.4, 0],
          material: { 
            color: '#654321',
            roughness: 0.5,
            metalness: 0.1
          }
        },
        // Base
        {
          geometry: new THREE.CylinderGeometry(0.6, 0.6, 0.05, 8),
          position: [0, 0.025, 0],
          material: { 
            color: '#654321',
            roughness: 0.5,
            metalness: 0.1
          }
        },
        // Base supports
        {
          geometry: new THREE.BoxGeometry(0.8, 0.05, 0.2),
          position: [0, 0.05, 0.4],
          material: { color: '#654321' }
        },
        {
          geometry: new THREE.BoxGeometry(0.8, 0.05, 0.2),
          position: [0, 0.05, -0.4],
          material: { color: '#654321' }
        },
        {
          geometry: new THREE.BoxGeometry(0.2, 0.05, 0.8),
          position: [0.4, 0.05, 0],
          material: { color: '#654321' }
        },
        {
          geometry: new THREE.BoxGeometry(0.2, 0.05, 0.8),
          position: [-0.4, 0.05, 0],
          material: { color: '#654321' }
        }
      ]
    }
  },
  diningChair: {
    name: 'Dining Chair',
    category: 'seating',
    defaultScale: 1,
    dimensions: { width: 0.5, height: 0.9, depth: 0.5 },
    geometry: {
      type: 'group',
      parts: [
        // Seat
        {
          geometry: new THREE.BoxGeometry(0.5, 0.05, 0.5),
          position: [0, 0.45, 0],
          material: { 
            color: '#8B4513',
            roughness: 0.3,
            metalness: 0.1
          }
        },
        // Seat padding
        {
          geometry: new THREE.BoxGeometry(0.48, 0.05, 0.48),
          position: [0, 0.48, 0],
          material: { 
            color: '#A0522D',
            roughness: 0.8,
            metalness: 0
          }
        },
        // Back frame
        {
          geometry: new THREE.BoxGeometry(0.5, 0.5, 0.05),
          position: [0, 0.75, -0.225],
          material: { 
            color: '#8B4513',
            roughness: 0.3,
            metalness: 0.1
          }
        },
        // Back padding
        {
          geometry: new THREE.BoxGeometry(0.48, 0.48, 0.05),
          position: [0, 0.75, -0.2],
          material: { 
            color: '#A0522D',
            roughness: 0.8,
            metalness: 0
          }
        },
        // Back supports
        {
          geometry: new THREE.BoxGeometry(0.05, 0.9, 0.05),
          position: [0.2, 0.45, -0.225],
          material: { color: '#8B4513' }
        },
        {
          geometry: new THREE.BoxGeometry(0.05, 0.9, 0.05),
          position: [-0.2, 0.45, -0.225],
          material: { color: '#8B4513' }
        },
        // Legs
        {
          geometry: new THREE.CylinderGeometry(0.02, 0.02, 0.45),
          position: [0.2, 0.225, 0.2],
          material: { 
            color: '#654321',
            roughness: 0.5,
            metalness: 0.3
          }
        },
        {
          geometry: new THREE.CylinderGeometry(0.02, 0.02, 0.45),
          position: [-0.2, 0.225, 0.2],
          material: { 
            color: '#654321',
            roughness: 0.5,
            metalness: 0.3
          }
        },
        {
          geometry: new THREE.CylinderGeometry(0.02, 0.02, 0.45),
          position: [0.2, 0.225, -0.2],
          material: { 
            color: '#654321',
            roughness: 0.5,
            metalness: 0.3
          }
        },
        {
          geometry: new THREE.CylinderGeometry(0.02, 0.02, 0.45),
          position: [-0.2, 0.225, -0.2],
          material: { 
            color: '#654321',
            roughness: 0.5,
            metalness: 0.3
          }
        }
      ]
    }
  },
  sideboard: {
    name: 'Sideboard',
    category: 'storage',
    defaultScale: 1,
    dimensions: { width: 1.8, height: 0.85, depth: 0.45 },
    geometry: {
      type: 'group',
      parts: [
        // Main body
        {
          geometry: new THREE.BoxGeometry(1.8, 0.85, 0.45),
          position: [0, 0.425, 0],
          material: { 
            color: '#8B4513',
            roughness: 0.3,
            metalness: 0.1
          }
        },
        // Top surface with slight overhang
        {
          geometry: new THREE.BoxGeometry(1.85, 0.03, 0.5),
          position: [0, 0.85, 0],
          material: { 
            color: '#8B4513',
            roughness: 0.3,
            metalness: 0.1
          }
        },
        // Doors (left)
        {
          geometry: new THREE.BoxGeometry(0.88, 0.7, 0.02),
          position: [-0.45, 0.425, 0.22],
          material: { 
            color: '#A0522D',
            roughness: 0.4,
            metalness: 0.1
          }
        },
        // Door handle left
        {
          geometry: new THREE.CylinderGeometry(0.01, 0.01, 0.1),
          position: [-0.1, 0.425, 0.23],
          rotation: [0, 0, Math.PI/2],
          material: { 
            color: '#B8860B',
            roughness: 0.3,
            metalness: 0.8
          }
        },
        // Doors (right)
        {
          geometry: new THREE.BoxGeometry(0.88, 0.7, 0.02),
          position: [0.45, 0.425, 0.22],
          material: { 
            color: '#A0522D',
            roughness: 0.4,
            metalness: 0.1
          }
        },
        // Door handle right
        {
          geometry: new THREE.CylinderGeometry(0.01, 0.01, 0.1),
          position: [0.1, 0.425, 0.23],
          rotation: [0, 0, Math.PI/2],
          material: { 
            color: '#B8860B',
            roughness: 0.3,
            metalness: 0.8
          }
        },
        // Feet
        {
          geometry: new THREE.BoxGeometry(0.1, 0.1, 0.45),
          position: [-0.85, 0.05, 0],
          material: { color: '#654321' }
        },
        {
          geometry: new THREE.BoxGeometry(0.1, 0.1, 0.45),
          position: [0.85, 0.05, 0],
          material: { color: '#654321' }
        }
      ]
    }
  }
} 
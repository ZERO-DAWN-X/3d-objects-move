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
    thumbnail: '/furniture/dining-table.png',
    dimensions: { width: 1.6, depth: 0.9, height: 0.75 },
    defaultScale: 1
  },
  diningChair: {
    name: 'Dining Chair',
    thumbnail: '/furniture/dining-chair.png',
    dimensions: { width: 0.5, depth: 0.5, height: 0.9 },
    defaultScale: 1
  },
  sideboard: {
    name: 'Sideboard',
    thumbnail: '/furniture/sideboard.png',
    dimensions: { width: 1.8, depth: 0.45, height: 0.85 },
    defaultScale: 1
  }
} 
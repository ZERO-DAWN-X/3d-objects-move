import { useState } from 'react'
import { furnitureModels, furnitureCategories } from '../../config/furnitureModels'

function FurniturePicker({ onSelect }) {
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredFurniture = activeCategory === 'all'
    ? Object.entries(furnitureModels)
    : Object.entries(furnitureModels).filter(([_, item]) => item.category === activeCategory)

  return (
    <div className="p-4">
      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        <button
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap
            ${activeCategory === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {furnitureCategories.map(category => (
          <button
            key={category.id}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap
              ${activeCategory === category.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Furniture Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredFurniture.map(([id, item]) => (
          <button
            key={id}
            className="bg-white p-2 rounded-lg shadow hover:shadow-md transition-shadow"
            onClick={() => onSelect(id)}
          >
            <div className="aspect-square bg-gray-100 rounded-md mb-2">
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-full h-full object-contain p-2"
              />
            </div>
            <p className="text-sm font-medium text-gray-800">{item.name}</p>
            <p className="text-xs text-gray-500">
              {item.dimensions.width}m × {item.dimensions.depth}m
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FurniturePicker 
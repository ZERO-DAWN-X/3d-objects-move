import { useDesignStore } from '../../store/designStore'

function RoomTemplateSelector() {
  const { roomTemplates, setRoomTemplate } = useDesignStore()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Object.entries(roomTemplates).map(([key, template]) => (
        <button
          key={key}
          onClick={() => setRoomTemplate(key)}
          className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-left w-full"
        >
          <h3 className="font-medium text-gray-900 mb-2 truncate">
            {template.name}
          </h3>
          <div className="text-sm text-gray-500">
            <p>Size: {template.width}m × {template.length}m</p>
          </div>
        </button>
      ))}
    </div>
  )
}

export default RoomTemplateSelector 
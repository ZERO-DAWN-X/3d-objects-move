import { useNavigate } from 'react-router-dom'
import { useDesignStore } from '../store/designStore'

function Home() {
  const navigate = useNavigate()
  const { designs, clearCurrentDesign, loadDesign } = useDesignStore()
  const recentDesigns = designs.slice(-3) // Show last 3 designs

  const handleStartNewDesign = () => {
    clearCurrentDesign()
    navigate('/designer')
  }

  const handleContinueDesign = (designId) => {
    if (designId) {
      loadDesign(designId)
      navigate('/designer')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Design Your Perfect Space
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Visualize your furniture in 3D before making a purchase
        </p>
        <div className="flex justify-center gap-4">
          <button 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={handleStartNewDesign}
          >
            Start Design
          </button>
          <button 
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200"
            onClick={() => navigate('/gallery')}
          >
            View Gallery
          </button>
        </div>
      </div>
      
      {/* Recent Designs Section */}
      {recentDesigns.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Designs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentDesigns.map(design => (
              <div key={design.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{design.name}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {new Date(design.timestamp).toLocaleDateString()}
                </p>
                <button
                  onClick={() => handleContinueDesign(design.id)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Continue Editing
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <FeatureCard 
          title="2D & 3D Visualization"
          description="View your room design from any angle"
          icon="🎨"
        />
        <FeatureCard 
          title="Room Customization"
          description="Adjust colors, sizes, and layouts"
          icon="🏠"
        />
        <FeatureCard 
          title="Furniture Library"
          description="Choose from our extensive collection"
          icon="🪑"
        />
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default Home 
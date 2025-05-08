function Home() {
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
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Start Designing
          </button>
          <button className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-200">
            View Gallery
          </button>
        </div>
      </div>
      
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
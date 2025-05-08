import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function Home() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Design Your Dream Space with Ease
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Transform your ideas into reality with our intuitive 3D room designer. 
                Create, customize, and visualize your perfect space in minutes.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate(isAuthenticated ? '/designer' : '/register')}
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Designing
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  View Gallery
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800"
                alt="Modern room design"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <p className="text-sm font-medium text-gray-900">1000+ Designs Created</p>
                <p className="text-xs text-gray-500">Join our growing community</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showcase Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Featured Designs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseImages.map((image, index) => (
              <div key={index} className="relative group overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-semibold text-lg">{image.title}</h3>
                    <p className="text-white/80 text-sm">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Data for showcase section
const showcaseImages = [
  {
    url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=500',
    title: 'Modern Living Room',
    description: 'Minimalist design with natural lighting'
  },
  {
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=500',
    title: 'Cozy Bedroom',
    description: 'Comfortable and stylish bedroom setup'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=500',
    title: 'Kitchen Design',
    description: 'Contemporary kitchen with modern appliances'
  }
]

export default Home 
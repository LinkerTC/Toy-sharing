import { useAuth } from '@/context/AuthContext'

const AuthDebug = () => {
  const { user, token, isAuthenticated, isLoading } = useAuth()

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">🔐 Auth Status</h3>
      <div className="text-xs space-y-1">
        <div>
          <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
        </div>
        <div>
          <strong>Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}
        </div>
        <div>
          <strong>User:</strong> {user ? user.profile?.firstName || 'Unknown' : 'None'}
        </div>
        <div>
          <strong>Token:</strong> {token ? '✅ Present' : '❌ Missing'}
        </div>
        <div>
          <strong>LocalStorage Token:</strong> {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}
        </div>
      </div>
      {!isAuthenticated && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-red-600 mb-2">⚠️ You need to log in first!</p>
          <a 
            href="/login" 
            className="text-xs bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600"
          >
            Go to Login
          </a>
        </div>
      )}
    </div>
  )
}

export default AuthDebug

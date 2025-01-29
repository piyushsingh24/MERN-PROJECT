import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'

const Oauth = () => {
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0()

  // Handle login for different providers
  const handleLogin = (provider) => {
    loginWithRedirect({
      connection: provider,
      redirectUri: window.location.origin, // Set redirect URI to your app's home page
    })
  }

  return (
    <div className="flex items-center justify-center max-h-screen bg-gray-50 rounded-4xl">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Login with Your Preferred Provider</h2>
        
        {/* Show login buttons only if not authenticated */}
        {!isAuthenticated ? (
          <div>
            <button
              onClick={() => handleLogin("google")}
              className="w-full py-3 px-4 mb-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Log in with Google
            </button>

            <button
              onClick={() => handleLogin("github")}
              className="w-full py-3 px-4 mb-4 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition"
            >
              Log in with GitHub
            </button>

            <button
              onClick={() => handleLogin("microsoft")}
              className="w-full py-3 px-4 mb-4 bg-[#0078D4] text-white rounded-lg shadow-md hover:bg-[#005a8f] transition"
            >
              Log in with Microsoft
            </button>

            <button
              onClick={() => handleLogin("facebook")}
              className="w-full py-3 px-4 mb-4 bg-[#3b5998] text-white rounded-lg shadow-md hover:bg-[#2d4373] transition"
            >
              Log in with Facebook
            </button>

            <button
              onClick={() => handleLogin("twitter")}
              className="w-full py-3 px-4 mb-4 bg-[#1DA1F2] text-white rounded-lg shadow-md hover:bg-[#0d8bdb] transition"
            >
              Log in with Twitter
            </button>

            <button
              onClick={() => handleLogin("apple")}
              className="w-full py-3 px-4 mb-4 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition"
            >
              Log in with Apple
            </button>
          </div>
        ) : (
          // If the user is logged in, show the user details and logout option
          <div className="text-center">
            <p className="text-xl font-semibold mb-4">Welcome back, {user?.name}!</p>
            <p className="text-lg mb-4">Email: {user?.email}</p>
            <img
              src={user?.picture}
              alt="User Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="w-full py-3 px-4 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Oauth

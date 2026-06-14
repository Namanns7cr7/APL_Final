import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CommandCenter from './pages/CommandCenter'
import ScenarioEngine from './pages/ScenarioEngine'
import DispatchHub from './pages/DispatchHub'
import DynamicRouting from './pages/DynamicRouting'
import SplashScreen from './components/SplashScreen'

// Minimal authentication context and guard
const AuthContext = React.createContext({ user: null })

function useAuth() {
  return React.useContext(AuthContext)
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/" replace />
  }
  return children
}

function App() {
  const [showSplash, setShowSplash] = useState(true)
  // Minimal fake auth state for demonstration
  const [user, setUser] = useState(null)

  // Simulate login for demonstration (replace with real auth in production)
  useEffect(() => {
    // Example: auto-login after splash
    if (!showSplash) {
      setUser({ name: 'DemoUser', role: 'admin' })
    }
  }, [showSplash])

  return (
    <AuthContext.Provider value={{ user }}>
      <Router>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
        <div className={`flex flex-col min-h-screen bg-[#03080F] transition-opacity duration-1000 ${showSplash ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              <Route path="/"         element={<ScenarioEngine />} />
              <Route path="/command"  element={<ProtectedRoute><CommandCenter /></ProtectedRoute>} />
              <Route path="/dispatch" element={<ProtectedRoute><DispatchHub /></ProtectedRoute>} />
              <Route path="/routing"  element={<ProtectedRoute><DynamicRouting /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App

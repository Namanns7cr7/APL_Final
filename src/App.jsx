import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CommandCenter from './pages/CommandCenter'
import ScenarioEngine from './pages/ScenarioEngine'
import DispatchHub from './pages/DispatchHub'
import DynamicRouting from './pages/DynamicRouting'
import SplashScreen from './components/SplashScreen'
import { getAuth, onAuthStateChanged } from './firebase'

function RequireAuth({ children }) {
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthed(!!user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading...</div>
  }
  if (!authed) {
    return <div className="flex items-center justify-center h-screen text-white">Unauthorized. Please log in.</div>
  }
  return children
}

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <Router>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      
      <div className={`flex flex-col min-h-screen bg-[#03080F] transition-opacity duration-1000 ${showSplash ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/"         element={<ScenarioEngine />} />
            <Route path="/command"  element={<RequireAuth><CommandCenter /></RequireAuth>} />
            <Route path="/dispatch" element={<RequireAuth><DispatchHub /></RequireAuth>} />
            <Route path="/routing"  element={<DynamicRouting />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CommandCenter from './pages/CommandCenter'
import ScenarioEngine from './pages/ScenarioEngine'
import DispatchHub from './pages/DispatchHub'
import DynamicRouting from './pages/DynamicRouting'
import SplashScreen from './components/SplashScreen'

// Minimal authentication guard
function PrivateRoute({ children }) {
  // Replace this with real auth logic as needed
  const isAuthenticated = localStorage.getItem('authenticated') === 'true'
  return isAuthenticated ? children : <Navigate to="/" />
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
            <Route path="/command"  element={<PrivateRoute><CommandCenter /></PrivateRoute>} />
            <Route path="/dispatch" element={<PrivateRoute><DispatchHub /></PrivateRoute>} />
            <Route path="/routing"  element={<PrivateRoute><DynamicRouting /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

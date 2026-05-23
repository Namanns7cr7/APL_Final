import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CommandCenter from './pages/CommandCenter'
import ScenarioEngine from './pages/ScenarioEngine'
import DispatchHub from './pages/DispatchHub'
import DynamicRouting from './pages/DynamicRouting'
import SplashScreen from './components/SplashScreen'

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
            <Route path="/command"  element={<CommandCenter />} />
            <Route path="/dispatch" element={<DispatchHub />} />
            <Route path="/routing"  element={<DynamicRouting />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

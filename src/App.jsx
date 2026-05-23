import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import EliteOpsHub from './pages/EliteOpsHub'
import ScenarioEngine from './pages/ScenarioEngine'
import DispatchHub from './pages/DispatchHub'
import DynamicRouting from './pages/DynamicRouting'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#07111F]">
        <Navbar />
        {/* Main Content Area */}
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<EliteOpsHub />} />
            <Route path="/simulation" element={<ScenarioEngine />} />
            <Route path="/dispatch" element={<DispatchHub />} />
            <Route path="/routing" element={<DynamicRouting />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

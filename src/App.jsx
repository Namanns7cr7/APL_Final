import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CommandCenter from './pages/CommandCenter'
import ScenarioEngine from './pages/ScenarioEngine'
import DispatchHub from './pages/DispatchHub'
import DynamicRouting from './pages/DynamicRouting'

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#03080F]">
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

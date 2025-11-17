import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React Router + Vite + TypeScript</h1>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/tabs">Tabs</Link>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/tabs" element={<TabsPage />} />
        </Routes>
      </main>
    </div>
  )
}

function HomePage() {
  return (
    <section>
      <h2>Home</h2>
      <p>This is the home page.</p>
    </section>
  )
}

function AboutPage() {
  return (
    <section>
      <h2>About</h2>
      <p>
        This starter uses React Router, TypeScript, Vitest, ESLint, and Prettier configured for a
        modern workflow.
      </p>
    </section>
  )
}

function TabsPage() {
  const [activeTab, setActiveTab] = useState<'red' | 'green' | 'blue'>('red')

  const backgroundColor = activeTab
  const text = activeTab.toUpperCase()

  return (
    <section>
      <h2>Color Tabs</h2>
      <div className="tabs">
        <button
          type="button"
          className={activeTab === 'red' ? 'tab tab-active' : 'tab'}
          onClick={() => setActiveTab('red')}
        >
          Red
        </button>
        <button
          type="button"
          className={activeTab === 'green' ? 'tab tab-active' : 'tab'}
          onClick={() => setActiveTab('green')}
        >
          Green
        </button>
        <button
          type="button"
          className={activeTab === 'blue' ? 'tab tab-active' : 'tab'}
          onClick={() => setActiveTab('blue')}
        >
          Blue
        </button>
      </div>
      <div className="tab-panel" style={{ backgroundColor }}>
        <p>{text}</p>
      </div>
    </section>
  )
}

export default App

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './components/Card'
import Header from './components/Header'
import { Route, Routes } from 'react-router-dom'
import { TopRated } from './components/TopRated'
import { LatestRelease } from './components/LatestRelease'
import { Upcoming } from './components/Upcoming'
import Details from './components/Details'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Card />} />
        <Route path="/top-rated" element={<TopRated />} />
        <Route path="/latest-release" element={<LatestRelease />} />
        <Route path="/upcoming" element={<Upcoming />} />
        <Route path="/movie/:id" element={<Details/>}/>
      </Routes>
    </>
  )
}

export default App

import '../styles/app/app.css'
import { useState } from 'react'
import Auth from '../components/auth/Auth'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../components/dashboard/dashboard'
function App() {

  return (
    <Routes>
      <Route path='/dashboard' exact='true' element={<Dashboard />}/>
      <Route path='/' exact='true' element={<Auth />} />
    </Routes>
  )
}

export default App

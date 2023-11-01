import '../styles/app/app.css'
import { useState } from 'react'
import Auth from '../components/auth/Auth'
import { Routes, Route } from 'react-router-dom'
import Dashboard from '../components/dashboard/dashboard'
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth'

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="app">
      {
      user 
      ? <Dashboard user={user}/> 
      : <Auth />
      }
    </div>
  )
}

export default App

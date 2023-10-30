import React from 'react'
import '../../styles/dashboard/dashboard.css'
import { signOut } from 'firebase/auth'
import { useNavigate, NavLink } from 'react-router-dom'
import { auth } from '../../config/firebase.jsx'
import logo from '../../assets/images/logo.svg'
import Swal from 'sweetalert2'

import Home from 'feather-icons-react/build/IconComponents/Home'
import UserPlus from 'feather-icons-react/build/IconComponents/UserPlus'
import Users from 'feather-icons-react/build/IconComponents/Users'
import Calendar from 'feather-icons-react/build/IconComponents/Calendar'
import BarChart2 from 'feather-icons-react/build/IconComponents/BarChart2'
import { Settings as SettingsIcon } from 'feather-icons-react/build/IconComponents'
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Routes, Route } from 'react-router-dom'
import Manage from '../routes/Manage'
import ManageEmployees from '../routes/ManageEmployees'
import EmployeeList from '../routes/EmployeeList'
import OnLeave from '../routes/OnLeave'
import Analytics from '../routes/Analytics'
import Settings from '../routes/Settings'
import { useState } from 'react'
function Dashboard({user}) {
  const [logout, setLogout] = useState(false)
  const navigate = useNavigate()
  const logoutHandler = () => {

    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure to logout?',
      icon: 'question',
      confirmButtonText: 'Close'
    })
      signOut(auth).then(() => {
        // Sign-out successful.
            navigate('/')
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
          alert(error)
        });
    
  }
  return (
    <div className='dashboard'>
      <aside className='dashboard__navigation'>
        <div className="home__icon">
            <NavLink to='/'>
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">    <path d="M 5 5 L 5 15 L 7 15 L 7 9.2910156 L 8.875 12.857422 L 10.001953 15 L 11.130859 12.857422 L 13 9.296875 L 13 15 L 15 15 L 15 5 L 13 5 L 10.003906 10.716797 L 7 5 L 5 5 z M 22 5 C 20.895 5 20 5.895 20 7 L 20 13 C 20 14.105 20.895 15 22 15 L 28 15 C 29.105 15 30 14.105 30 13 L 30 7 C 30 5.895 29.105 5 28 5 L 22 5 z M 37 5.015625 C 35.895 5.015625 35 5.9087188 35 7.0117188 L 35 13.003906 C 35 14.106906 35.895 15 37 15 L 43 15 C 44.105 15 45 14.106906 45 13.003906 L 45 7.0117188 C 45 5.9087188 44.105 5.015625 43 5.015625 L 37 5.015625 z M 7 20 C 5.895 20 5 20.895 5 22 L 5 28 C 5 29.105 5.895 30 7 30 L 13 30 C 14.105 30 15 29.105 15 28 L 15 22 C 15 20.895 14.105 20 13 20 L 7 20 z M 22 20 C 20.895 20 20 20.895 20 22 L 20 28 C 20 29.105 20.895 30 22 30 L 28 30 C 29.105 30 30 29.105 30 28 L 30 22 C 30 20.895 29.105 20 28 20 L 22 20 z M 37 20 C 35.895 20 35 20.895 35 22 L 35 28 C 35 29.105 35.895 30 37 30 L 43 30 C 44.105 30 45 29.105 45 28 L 45 22 C 45 20.895 44.105 20 43 20 L 37 20 z M 7 35 C 5.895 35 5 35.895 5 37 L 5 43 C 5 44.105 5.895 45 7 45 L 13 45 C 14.105 45 15 44.105 15 43 L 15 37 C 15 35.895 14.105 35 13 35 L 7 35 z M 22 35 C 20.895 35 20 35.895 20 37 L 20 43 C 20 44.105 20.895 45 22 45 L 28 45 C 29.105 45 30 44.105 30 43 L 30 37 C 30 35.895 29.105 35 28 35 L 22 35 z M 37 35 C 35.895 35 35 35.895 35 37 L 35 43 C 35 44.105 35.895 45 37 45 L 43 45 C 44.105 45 45 44.105 45 43 L 45 37 C 45 35.895 44.105 35 43 35 L 37 35 z"/></svg>
            <h2>Manager</h2>
            </NavLink>
        </div>
        <nav className="main__navigation">
          <ul>
            <div className="ul__wrapper">
            <li>
              <NavLink to='/manage'>
                <Home/>
                <span>Home</span>
                </NavLink>
            </li>
            <li>
              <NavLink to='/manageemployees'>
                <UserPlus/>
                <span>Add employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/employeelist'>
                <Users/>
                <span>All employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/onleave'>
                <Calendar/>
                <span>On leave</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/analytics'>
                <BarChart2/>
                <span>Analytics</span>
              </NavLink>
            </li>
            </div>
            <li data-mobile>
              <NavLink to='settings'>
                <SettingsIcon/>
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="settings">
              <NavLink to='settings'>
                <SettingsIcon/>
                <span>Settings</span>
              </NavLink>
        </div>
      </aside>
      <div className="main__section">
        <header className="dashboard__header">
          <div className="header__searchbar">
            <input type="text" placeholder='Search for an employee'/>
            <SearchIcon/>
          </div>
          <div className="header__userInfo">
            <div className="profile__details">
              <img src={user.photoURL} alt="profile picture" />
              <span>{user.displayName}</span>
            </div>
            <div className="profile__buttons">
              <button onClick={logoutHandler} data-signout>Sign out</button>
            </div>
          </div>
        </header>
        <div className="sections__page">
          <Routes>
            <Route path='/manage' element={<Manage />}/>
            <Route path='/employeelist' element={<EmployeeList />}/>
            <Route path='/manageemployees' element={<ManageEmployees />}/>
            <Route path='/onleave' element={<OnLeave />}/>
            <Route path='/analytics' element={<Analytics />}/>
            <Route path='/settings' element={<Settings />}/>
          </Routes>
        </div>
      </div>  
    </div>
      
  )
}

export default Dashboard
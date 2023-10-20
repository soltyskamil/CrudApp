import React from 'react'
import '../../styles/dashboard/dashboard.css'
import { signOut } from 'firebase/auth'
import { useNavigate, NavLink } from 'react-router-dom'
import { auth } from '../../config/firebase.jsx'
import Swal from 'sweetalert2'
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
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
  console.log(user)
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
            <NavLink><CloudCircleIcon/></NavLink>
        </div>
        <nav className="main__navigation">
          <ul>
            <li>
              <NavLink to='/manage'>
                <DashboardIcon/>
                <span>Dashboard</span>
                </NavLink>
            </li>
            <li>
              <NavLink to='/manageemployees'>
                <ManageAccountsIcon/>
                <span>Manage employees</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/employeelist'>
                <PeopleIcon/>
                <span>Employee List</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/onleave'>
                <CalendarMonthIcon/>
                <span>On leave</span>
              </NavLink>
            </li>
            <li>
              <NavLink to='/analytics'>
                <AnalyticsIcon/>
                <span>Analytics</span>
              </NavLink>
            </li>
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
            <input type="text" />
            <SearchIcon/>
          </div>
          <div className="header__userInfo">
            <div className="profile__details">
              <img src={user.photoURL} alt="profile picture" />
              <span>{user.displayName}</span>
            </div>
            <div className="profile__buttons">
              <button onClick={logoutHandler} data-signout>Sign out</button>
              <button data-options><KeyboardArrowDownIcon/></button>
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
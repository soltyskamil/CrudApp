import React from 'react'
import Users from 'feather-icons-react/build/IconComponents/Users'
import profile from '../../assets/images/profile.png'
import '../../styles/routes/manage.css'

function Manage() {
  return (
    <>
      <div className="section__title">
        <h2>Welcome Name Surname!</h2>
        <span>Have a nice day!</span>
      </div>
      <div className="grid__employees">
        <div className="employee__container">
          <div className="columns" data-users>
            <div className="icon__container">
              <Users />
            </div>
          </div>
          <div className="columns">
            <h3>5</h3>
            <span>Employees</span>
          </div>
        </div>
        <div className="employee__container">
          <div className="columns" data-users>
          <div className="icon__container">
              <Users />
            </div>
          </div>
          <div className="columns">
            <h3>5</h3>
            <span>Employees</span>
          </div>
        </div>
        <div className="employee__container">
          <div className="columns" data-users>
          <div className="icon__container">
              <Users />
            </div>
          </div>
          <div className="columns">
            <h3>5</h3>
            <span>Employees</span>
          </div>
        </div>
        <div className="employee__container">
          <div className="columns" data-users>
          <div className="icon__container">
              <Users />
            </div>
          </div>
          <div className="columns">
            <h3>5</h3>
            <span>Employees</span>
          </div>
        </div>
      </div>
      <div className="grid__employees__apps">
        <div className="grid__employees__app__element" data-employee>
          <div className="employee__data">
            <div className="employee__data__wrapper">
              <img src={profile} alt="profile picture" />
              <h3>User Name</h3>
            </div>
            <span>Active task</span>
          </div>
          <div className="employee__data">
            <div className="employee__data__wrapper">
              <img src={profile} alt="profile picture" />
              <h3>User Name</h3>
            </div>
            <span>Active task</span>
          </div>
          <div className="employee__data">
            <div className="employee__data__wrapper">
              <img src={profile} alt="profile picture" />
              <h3>User Name</h3>
            </div>
            <span>Active task</span>
          </div>
          <div className="employee__data">
            <div className="employee__data__wrapper">
              <img src={profile} alt="profile picture" />
              <h3>User Name</h3>
            </div>
            <span>Active task</span>
          </div>
          <div className="employee__data">
            <div className="employee__data__wrapper">
              <img src={profile} alt="profile picture" />
              <h3>User Name</h3>
            </div>
            <span>Active task</span>
          </div>
          <div className="employee__data">
            <div className="employee__data__wrapper">
              <img src={profile} alt="profile picture" />
              <h3>User Name</h3>
            </div>
            <span>Active task</span>
          </div>
        </div>  
        <div className="grid__employees__app__element">
          <div className="calendar">
   
          </div>
        </div>
      </div>
      <div className="recent__ended__tasks">
      
      </div>
    </>
  )
}

export default Manage
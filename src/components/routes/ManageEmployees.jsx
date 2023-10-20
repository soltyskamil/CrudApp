import React, { useState } from 'react'
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { useEffect } from 'react';
import '../../styles/routes/manageemployees.css'
import { useStateValue } from '../../reducer/StateProvider';
function ManageEmployees() {
    const initialFormState = {
      name: '',
      surname: '',
      role: '',
      salary: 0,
      timestamp: new Date,
    }
    const [state, dispatch] = useStateValue()
    const [formData, setFormData] = useState(initialFormState)
    useEffect(() => {
      async function fetchData(){
       try{
        const querySnapshot = await getDocs(collection(db, "employees"));
        const employeesArr = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          employeesArr.push(data)
          dispatch({
            type: 'FETCH__SUCCESS',
            payload: employeesArr,
           })
        });
      }catch(error){
        console.error('Error: ', error)
      } 
      }
      fetchData()
    }, [])
  const addEmployee = () => {
    document.querySelector('.employee__managment').classList.toggle('visible')
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    addDoc(collection(db, "employees"), {
      name: formData.name,
      surname: formData.surname,
      role: formData.role,
      salary: formData.salary,
      id: state.employees.length,
      timestamp: formData.timestamp,
    })
    setFormData(initialFormState)
  }
  console.log(state)
  return (
   <>
      <div className="section__title">
        <h2>Manage Employees</h2>
        <div className="section__title__action">
          <button onClick={() => addEmployee()}>
            Add employee
          </button>
        </div>
        <div className="employee__managment">
          <form>
            <input type="text" placeholder='name' value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}/>
            <input type="text" placeholder='surname' value={formData.surname} onChange={(e) => setFormData({...formData, surname: e.target.value})}/>
            <input type="text" placeholder='salary' value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})}/>
            <input type="text" placeholder='role' value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}/>
            <input type="date" placeholder='started working' value={formData.timestamp} onChange={(e) => setFormData({...formData, timestamp: e.target.value})}/>
            <button type='submit' onClick={handleSubmit}>
              Confirm
            </button>
          </form>
        </div>
      </div>
      <div className="section__app">
        <table className='employees'>
          <thead>
            <tr>
              <th>Employees</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Started working</th>
              <th>Id</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!state.loading && state.employees.map((item, i) => (
            <tr key={i}>
              <td>{item.name} {item.surname}</td>
              <td>{item.role}</td>
              <td>{item.salary}</td>
              <td>{item.timestamp}</td>
              <td>{item.id}</td>
              <td><button>EDIT</button></td>
            </tr>)
            )}
          </tbody>
        </table>
        
      </div>
   </>
  )
}

export default ManageEmployees
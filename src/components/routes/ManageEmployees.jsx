import React, { useState } from 'react'
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../../config/firebase';
import { useEffect } from 'react';
import '../../styles/routes/manageemployees.css'
import { useStateValue } from '../../reducer/StateProvider';
import { useRef } from 'react';
import Swal from 'sweetalert2';
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
            const employeeId = doc.id;
            const data = doc.data()
            employeesArr.push({employeeId, data})
            dispatch({
              type: 'FETCH__SUCCESS',
              payload: employeesArr,
            })
          })}
          catch(error){
            console.error('Error: ', error)
          } 
      }
      fetchData()
    }, [])
    console.log(state.employees.length)
  const addEmployee = () => {
    document.querySelector('.employee__managment').classList.toggle('visible')
  }

  const handleDelete = (e, index, id) => {
    let decision = false;
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete employee from database?',
        icon: 'warning',
        confirmButtonText: 'Yes'
      })
      .then(decision = !decision)
    if(decision){
      deleteDoc(doc(db, "employees", id));
    }
  }
 
  const handleEdit = (e, index, id) => {
    const name = document.querySelectorAll('input[data-name]')[index]
    const surname = document.querySelectorAll('input[data-surname]')[index]
    const role = document.querySelectorAll('input[data-role]')[index]
    const salary = document.querySelectorAll('input[data-salary]')[index]
    const timestamp = document.querySelectorAll('input[data-timestamp]')[index]
    const confirmButton = document.querySelectorAll('td button[data-edit]')[index]
    const inputs = [name, surname, role, salary, timestamp]

    confirmButton.classList.toggle('editData')
    if(confirmButton.classList.contains('editData')) {
      confirmButton.textContent = 'APPLY'
      inputs.forEach((item, i) => item.removeAttribute('readonly'))
    }
    else if(!confirmButton.classList.contains('editData')) {
      const employeeRef = doc(db, "employees", id)
      updateDoc(employeeRef, {
        name: name.value,
        surname: surname.value,
        role: role.value,
        salary: salary.value,
        timestamp: timestamp.value
      })
      inputs.forEach((item, i) => item.setAttribute('readonly', true))
      confirmButton.textContent = 'EDIT'
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    addDoc(collection(db, "employees"), {
      name: formData.name,
      surname: formData.surname,
      role: formData.role,
      salary: formData.salary,
      timestamp: formData.timestamp,
    })
    setFormData(initialFormState)
  }

  const q = query(collection(db, "employees"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
          console.log("New employee: ", change.doc.data());
      }
      if (change.type === "modified") {
          console.log("Modified employee data: ", change.doc.data());
      }
      if (change.type === "removed") {
          console.log("Removed employee: ", change.doc.data());
      }
    });
  });

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
              <th>Name</th>
              <th>Surname</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Started working</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!state.loading && state.employees.map((item, index) => (
            <tr key={index} id='employee__table__details'>
              <td><input type="text" data-name defaultValue={item.data.name} readOnly/></td>
              <td><input type="text" data-surname defaultValue={item.data.surname} readOnly/></td>
              <td><input type="text" data-role defaultValue={item.data.role} readOnly/></td>
              <td><input type="number" data-salary defaultValue={item.data.salary} readOnly/></td>
              <td><input type="date" data-timestamp defaultValue={item.data.timestamp} readOnly/></td>
              <td style={{display:'flex'}}>
                <button data-edit onClick={(e) => handleEdit(e, index, item.employeeId)}>EDIT</button>
                <button onClick={(e) => handleDelete(e, index, item.employeeId)}>DELETE</button>
              </td>
            </tr>)
            )}
          </tbody>
        </table>
        
      </div>
   </>
  )
}

export default ManageEmployees
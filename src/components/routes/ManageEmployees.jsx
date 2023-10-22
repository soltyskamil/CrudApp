import React, { useState } from 'react'
import { collection, getDocs, orderBy , addDoc, doc, updateDoc, deleteDoc, query, onSnapshot } from "firebase/firestore";
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
    const [workers, setWorkers] = useState([])

    useEffect(() => {
      const q = query(collection(db, "employees"), orderBy('name'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const employees = [];
        querySnapshot.forEach((doc) => {
          employees.push({data: doc.data(), id: doc.id});
        });
        setWorkers(employees);
        console.log("Current employees", employees);
      });
    
      return () => {
        unsubscribe();
      };
    }, []);
    

  const addEmployee = () => {
    document.querySelector('.employee__managment').classList.toggle('visible')
    console.log(workers)
  }

  const handleDelete = (e, index, id) => {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete employee from database?',
        icon: 'warning',
        confirmButtonText: 'Yes'
      })
      .then((result) => {
        if(result.isConfirmed){
          deleteDoc(doc(db, "employees", id));
        }
      })
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
    const form = document.querySelector('#form')
    const name = document.querySelector('input[data-addname]').value
    const surname = document.querySelector('input[data-addsurname]').value
    const salary = document.querySelector('input[data-addsalary]').value
    const role = document.querySelector('input[data-addrole]').value
    const timestamp = document.querySelector('input[data-addtimestamp]').value
    console.log(name, surname, salary, role, timestamp)
    addDoc(collection(db, "employees"), {
      name: name,
      surname: surname,
      role: role,
      salary: salary,
      timestamp: timestamp,
    })
    form.reset()
  }


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
          <form onSubmit={handleSubmit} id='form'>
            <input type="text" data-addname placeholder='name' required/>
            <input type="text" data-addsurname placeholder='surname' required/>
            <input type="text" data-addsalary placeholder='salary' required/>
            <input type="text" data-addrole placeholder='role' required/>
            <input type="date" data-addtimestamp placeholder='started working' required/>
            <button type='submit'>
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
            {workers.length > 0 && workers.map((item, index) => (
            <tr key={item.id} id='employee__table__details'>
              <td><input type="text" data-name defaultValue={item.data.name} readOnly/></td>
              <td><input type="text" data-surname defaultValue={item.data.surname} readOnly/></td>
              <td><input type="text" data-role defaultValue={item.data.role} readOnly/></td>
              <td><input type="number" data-salary defaultValue={item.data.salary} readOnly/></td>
              <td><input type="date" data-timestamp defaultValue={item.data.timestamp} readOnly/></td>
              <td style={{display:'flex'}}>
                <button data-edit onClick={(e) => handleEdit(e, index, item.id)}>EDIT</button>
                <button onClick={(e) => handleDelete(e, index, item.id)}>DELETE</button>
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
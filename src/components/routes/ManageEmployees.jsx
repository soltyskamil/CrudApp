import React, { useState } from 'react'
import { collection, getDocs, orderBy , addDoc, doc, updateDoc, deleteDoc, query, onSnapshot } from "firebase/firestore";
import { db } from '../../config/firebase';
import { useEffect } from 'react';
import '../../styles/routes/manageemployees.css'
import { useRef } from 'react';
import Swal from 'sweetalert2';
function ManageEmployees() {
  
    const initialFormState = {
      name: '',
      surname: '',
      role: '',
      salary: 0,
      timestamp: '',
    }

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
      });
    
      return () => {
        unsubscribe();
      };
    }, []);



  const handleActions = (e, index, id) => {
    console.log(id)
    const { name, textContent } = e.target
    const table = [...document.getElementById(`${id}`).children]
    const inputObject = {}

    const inputs = table.map((item, i) => {
      return item.children[0]
    }).slice(0, -1)

    inputs.forEach((input) => {
      const name = input.getAttribute('name')
      const value = input.value;
      console.log(inputObject[name] = value)
      inputObject[name] = value
    })

    if(textContent === 'EDIT') {
      e.target.textContent = 'APPLY'
      inputs.forEach((item, i) => item.removeAttribute('readonly'))
    }
    if(textContent === 'DELETE'){
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
    if(textContent === 'APPLY'){
      updateDoc(doc(db, "employees", id), {...inputObject})
      inputs.forEach((item, i) => item.setAttribute('readonly', true))
      e.target.textContent = 'EDIT'
    }
  }
  const handleSubmit = (e) => {  
    e.preventDefault()
    addDoc(collection(db, 'employees'), formData)
    setFormData(initialFormState)
  }
  const handleForm = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({...prevData, [name]: value}))
  }

  return (
   <>
      <div className="section__title">
        <h2>Manage Employees</h2>
        <div className="section__title__action">
          <button onClick={() => 
            document.querySelector('.employee__managment').classList.toggle('visible')
          }>
            Add employee
          </button>
        </div>
        <div className="employee__managment">
          <form onSubmit={handleSubmit} id='form'>
            <input type="text" 
              data-addname 
              placeholder='name'
              name='name'
              value={formData.name}
              onChange={handleForm}
              required
            />
            <input type="text" 
              data-addsurname 
              placeholder='surname'
              name='surname'
              value={formData.surname}
              onChange={handleForm}
              required
            />
            <input type="text" 
              data-addsalary 
              placeholder='salary'
              name='salary' 
              value={formData.salary}
              onChange={handleForm}
              required
            />
            <input type="text" 
              data-addrole 
              placeholder='role'
              name='role'
              value={formData.role}
              onChange={handleForm} 
              required
            />
            <input type="date" 
              data-addtimestamp 
              placeholder='started working'
              name='timestamp'
              value={formData.timestamp}
              onChange={(e) => handleForm(e)} 
              required
            />
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
            <tr key={item.id} id={item.id}>
              <td><input type="text" name='name' data-name defaultValue={item.data.name} readOnly/></td>
              <td><input type="text" name='surname' data-surname defaultValue={item.data.surname} readOnly/></td>
              <td><input type="text" name='role' data-role defaultValue={item.data.role} readOnly/></td>
              <td><input type="number" name='salary' data-salary defaultValue={item.data.salary} readOnly/></td>
              <td><input type="date" name='timestamp' data-timestamp defaultValue={item.data.timestamp} readOnly/></td>
              <td style={{display:'flex'}}>
                <button name='edit' data-edit onClick={(e) => handleActions(e, index, item.id)}>EDIT</button>
                <button name='delete' onClick={(e) => handleActions(e, index, item.id)}>DELETE</button>
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
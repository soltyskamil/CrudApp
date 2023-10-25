import React, { useState, useEffect } from 'react'
import { db } from '../../config/firebase'
import { collection, getDocs, orderBy , addDoc, getDoc, doc, updateDoc, deleteDoc, query, onSnapshot, arrayUnion } from "firebase/firestore";
import { useStateValue } from '../../reducer/StateProvider'
import Swal from 'sweetalert2';
import '../../styles/routes/manageemployees.css'
function EmployeeList() {

  const date = new Date()
  const initialFormState = {
    employee: '',
    details: '',
    priority: '',
    deadline: '',
    id: '',
    taskId: date.getTime(),
  }

  const [{employees}, dispatch] = useStateValue()
  const [formData, setFormData] = useState(initialFormState)
  useEffect(() => {
    const q = query(collection(db, "employees"), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const employees = [];
      querySnapshot.forEach((doc) => {
        employees.push({data: doc.data(), id: doc.id});
      });
      dispatch({
        type: 'FETCH__SUCCESS',
        payload: employees
      })
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    const employeeRef = doc(db, "employees", formData.id)
    updateDoc(employeeRef, {
        tasks: arrayUnion({...formData})
    })
    setFormData(initialFormState)
  }

  const handleActions = (e, index, id, employeeId) => {
    const { name, textContent } = e.target
    const table = [...document.getElementById(`${id}`).children]
    const inputObject = {
      taskId: id,
      id: employeeId,
    }

    const inputs = table.map((item, i) => {
      return item.children[0]
    }).slice(0, -1)

    inputs.forEach((input) => {
      const name = input.getAttribute('name')
      const value = input.value;
      inputObject[name] = value
    })


    if(textContent === 'EDIT') {
      e.target.textContent = 'APPLY'
      inputs.forEach((item, i) => item.removeAttribute('readonly'))
    }
    if(textContent === 'APPLY'){ 
      inputs.forEach((item, i) => item.setAttribute('readonly', true))
      e.target.textContent = 'EDIT'
      const employeeRef = doc(db, 'employees', employeeId)
      getDoc(employeeRef)
        .then((employeeDoc) => {
          if(employeeDoc.exists()){
            const employeeData = employeeDoc.data()
            const selectedTask = employeeData.tasks.filter(item => item.taskId === id)[0]
            for(const key in inputObject){
              if(selectedTask.hasOwnProperty(key)){
                selectedTask[key] = inputObject[key]
              }
            }
            const updatedArray = employeeData.tasks
            updateDoc(employeeRef, {
              tasks: updatedArray
            })
          }
        })
    }
    if(textContent === 'FINISHED'){
      const employeeRef = doc(db, 'employees', employeeId)
      getDoc(employeeRef)
        .then((employeeDoc) => {
          if(employeeDoc.exists()){
            const employeeData = employeeDoc.data()
            const updatedArray = employeeData.tasks.filter(item => item.taskId !== id)
            console.log(updatedArray)
            Swal.fire({
              title: 'Are you sure?',
              text: 'Do you want to end this task?',
              icon: 'error',
              confirmButtonText: 'Yes'
            })
            .then((result) => {
              if(result.isConfirmed){
                updateDoc(employeeRef, {
                  tasks: updatedArray
                })
              }
            })
            .then(() => {
              Swal.fire({
                title: 'Task has been finished',
                // text: 'Do you want to end this task?',
                icon: 'success',
                confirmButtonText: 'Close'
              })
            })
            
          }
        })
    }
  }

  const handleForm = (e) => {
    const { name, value } = e.target
    const employeeOption = document.querySelector('select[name]')
    const selectedIndex = employeeOption.options.selectedIndex;
    const id = employeeOption.options[selectedIndex].getAttribute('data-id')
    setFormData((prevData) => ({...prevData, [name]: value, id: id}))
  }
  


  return (
    <>
      <div className='section__title'>
        Manage Tasks
        <button onClick={() => console.log(employees)}>check</button>
        <button onClick={() => document.querySelector('.add__task').classList.toggle('visible')}>Add task</button>
      </div>
      <div className="add__task">
        <div className="add__task__wrapper">
          <form onSubmit={handleSubmit}>
          <table>
            <thead>
              <tr>
                <th>Task attached to:</th>
                <th>Task details</th>
                <th>Task priority</th>
                <th>Task deadline</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select name='employee' value={formData.employee} onChange={handleForm}>
                    {employees.map((item, i) => (
                      <option key={item.id} data-id={item.id}>
                        {item.data.name + ' ' + item.data.surname}
                      </option>
                    ))}
                  </select>
                </td>
                <td><input type="text" name='details' value={formData.details} onChange={handleForm}/></td>
                <td>
                  <select name='priority' value={formData.priority} onChange={handleForm}>
                    <option value="veryhigh">Very high</option>
                    <option value="high">High</option>
                    <option value="moderate">Moderate</option>
                    <option value="low">Low</option>
                  </select>
                </td>
                <td><input type="datetime-local" value={formData.deadline} name='deadline' onChange={handleForm}/></td>
                <td style={{display: 'flex'}}>
                  <button type='submit'>Accept</button>
                  <button>Cancel</button>
                </td>
              </tr>
            </tbody>
          </table>
          </form>
        </div>
      </div>
      <div className="task__managment__section">
      <table className='employees'>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Task details</th>
              <th>Priority</th>
              <th>Task deadline</th>
              <th>Task status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 && employees.map((item) => (
              item.data.tasks && item.data.tasks.map((item, index) => (
                <tr key={item.taskId} id={item.taskId}>
                  <td><input type="text" name='employee' data-name defaultValue={item.employee} readOnly/></td>
                  <td><input type="text" name='details' data-timestamp defaultValue={item.details} readOnly/></td>
                  <td><input type="select" name='priority' data-timestamp defaultValue={item.priority} readOnly/></td>
                  <td><input type="datetime-local" name='deadline' data-timestamp defaultValue={item.deadline} readOnly/></td>
                  <td style={{display:'flex'}}>
                    <button onClick={(e) => handleActions(e, index ,item.taskId, item.id)}>EDIT</button>
                    <button onClick={(e) => handleActions(e, index ,item.taskId, item.id)}>FINISHED</button>
                  </td>
                </tr>
              ))
            )
            )}
           
          </tbody>
        </table>
      </div>
    </>
  )
}

export default EmployeeList
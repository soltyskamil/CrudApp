import React, { useState, useEffect } from 'react'
import { db } from '../../config/firebase'
import { collection, getDocs, orderBy, addDoc, getDoc, doc, updateDoc, deleteDoc, query, onSnapshot, arrayUnion } from "firebase/firestore";
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

  const [{ employees }, dispatch] = useStateValue()
  const [formData, setFormData] = useState(initialFormState)
  useEffect(() => {
    const q = query(collection(db, "employees"), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const employees = [];
      querySnapshot.forEach((doc) => {
        employees.push({ data: doc.data(), id: doc.id });
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
    const values = Object.values(formData).slice(0, -1)
    const every = values.every((el) => {
      if (el === '') return false
      else return true
    })
    if (every) {
      const employeeRef = doc(db, "employees", formData.id)
      updateDoc(employeeRef, {
        allTasks: arrayUnion({ ...formData, started: new Date().getTime() }), 
        tasks: arrayUnion({ ...formData, started: new Date().getTime() })
      })
      setFormData(initialFormState)
    } else {
      console.error('Proszę uzupełnić brakujące pola w formularzu!')
    }
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


    if (textContent === 'EDIT') {
      e.target.textContent = 'APPLY'
      const filteredInputs = inputs.filter((item, i) => item.name !== 'employee')
      const select = filteredInputs.filter((item, i) => item.localName === 'select')
      select[0].removeAttribute('disabled')
      filteredInputs.forEach((item, i) => item.removeAttribute('readonly'))
      console.log(inputObject)
    }
    if (textContent === 'APPLY') {
      const filteredInputs = inputs.filter((item, i) => item.name !== 'employee')
      const select = filteredInputs.filter((item, i) => item.localName === 'select')
      select[0].setAttribute('disabled', true)
      inputs.forEach((item, i) => item.setAttribute('readonly', true))
      e.target.textContent = 'EDIT'
      const employeeRef = doc(db, 'employees', employeeId)
      getDoc(employeeRef)
        .then((employeeDoc) => {
          if (employeeDoc.exists()) {
            const employeeData = employeeDoc.data()
            const selectedTask = employeeData.tasks.filter(item => item.taskId === id)[0]
            for (const key in inputObject) {
              if (selectedTask.hasOwnProperty(key)) {
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
    if (textContent === 'FINISHED') {
      const employeeRef = doc(db, 'employees', employeeId)
      getDoc(employeeRef)
        .then((employeeDoc) => {
          if (employeeDoc.exists()) {
            const employeeData = employeeDoc.data()
            const date = new Date().getTime()
            const employeeTime = employeeData.tasks.map(item => {
              if (item.taskId === id) {
                return item.started
              }
            }).filter((item, i) => item !== undefined)
            const updatedArray = employeeData.tasks.filter(item => item.taskId !== id)
            Swal.fire({
              title: 'Are you sure?',
              text: 'Do you want to end this task?',
              icon: 'error',
              confirmButtonText: 'Yes'
            })
              .then((result) => {
                if (result.isConfirmed) {
                  const date = new Date().getTime()
                  updateDoc(employeeRef, {
                    tasks: updatedArray,
                    finishedTasks: {
                      ended: employeeData.finishedTasks.ended + 1,
                      time: (date - new Date(employeeTime[0]).getTime()) / (employeeData.finishedTasks.ended + 1),
                    }
                  })
                }
              })
              .then(() => {
                Swal.fire({
                  title: 'Task has been finished',
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
    setFormData((prevData) => ({ ...prevData, [name]: value, id: id }))
  }



  return (
    <>
      <div className='section__title'>
      <div className="section__title__action">
          <div className="title__action">
            <h2>Employees tasks</h2>
            <button onClick={() => 
              document.querySelector('.add__task').classList.add('visible')
            }>
              Add task
            </button>
          </div>
        </div>
      </div>
      <div className="add__task">
          <h3>Add task</h3>
          <form onSubmit={handleSubmit}>
            
                    <select name='employee' value={formData.employee} onChange={handleForm}>
                      <option hidden>Choose employee</option>
                      {employees.map((item, i) => (
                        <option key={item.id} data-id={item.id}>
                          {item.data.name + ' ' + item.data.surname}
                        </option>
                      ))}
                    </select>
                 
                  <input type="text" placeholder='Write more details..' name='details' value={formData.details} onChange={handleForm} />
                  
                    <select name='priority' value={formData.priority} onChange={handleForm}>
                      <option hidden>Choose priority</option>
                      <option value="veryhigh">Very high</option>
                      <option value="high">High</option>
                      <option value="moderate">Moderate</option>
                      <option value="low">Low</option>
                    </select>
                  <input type="datetime-local" value={formData.deadline} name='deadline' onChange={handleForm} />
                  <div style={{ display: 'flex', gap: '.25rem' }}>
                    <button type='submit'>Accept</button>
                    <button style={{backgroundColor: '#e02d3c'}} onClick={() => 
                      document.querySelector('.add__task').classList.remove('visible')
                    }>
                      Cancel
                    </button>
                  </div>
            
          </form>
      </div>
      <div className="section__app">
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
                  <td>
                    <input type="text" name='employee' readOnly defaultValue={item.employee} />
                  </td>
                  <td><input type="text" name='details' data-timestamp defaultValue={item.details} readOnly /></td>
                  <td>
                    <select type="select" disabled name='priority' data-timestamp defaultValue={item.priority} >
                      <option value="veryhigh">Very high</option>
                      <option value="high">High</option>
                      <option value="moderate">Moderate</option>
                      <option value="low">Low</option>
                    </select>
                  </td>
                  <td><input type="datetime-local" name='deadline' data-timestamp defaultValue={item.deadline} readOnly /></td>
                  <td style={{ display: 'flex' }}>
                    <button onClick={(e) => handleActions(e, index, item.taskId, item.id)}>EDIT</button>
                    <button onClick={(e) => handleActions(e, index, item.taskId, item.id)}>FINISHED</button>
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
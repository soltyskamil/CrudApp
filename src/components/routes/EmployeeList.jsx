import React, { useState, useEffect } from 'react'
import { db } from '../../config/firebase'
import { collection, getDocs, orderBy , addDoc, doc, updateDoc, deleteDoc, query, onSnapshot, arrayUnion } from "firebase/firestore";
import { useStateValue } from '../../reducer/StateProvider'
import Swal from 'sweetalert2';
import '../../styles/routes/manageemployees.css'
function EmployeeList() {

  const initialFormState = {
    employee: '',
    details: '',
    priority: '',
    deadline: '',
    id: '',
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
            {/* {employees.length > 0 && employees.map((item, index) => (
            <tr key={item.id} id={item.id}>
              <td><input type="text" name='name' data-name defaultValue={item.data.name + ' ' + item.data.surname} readOnly/></td>
              <td><input type="text" name='taskdetails' data-timestamp defaultValue={item.data.task.details} readOnly/></td>
              <td><input type="text" name='taskpriority' data-timestamp defaultValue={item.data.task.priority} readOnly/></td>
              <td><input type="datetime-local" name='timestamp' data-timestamp defaultValue={item.data.task.deadline} readOnly/></td>
              <td><input type="text" name='taskstatus' data-timestamp defaultValue='NOT FINISHED' readOnly/></td>
            </tr>)
            )} */}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default EmployeeList
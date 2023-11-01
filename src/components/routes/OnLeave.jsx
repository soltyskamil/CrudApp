import React, { useEffect, useState } from 'react'
import { useStateValue } from '../../reducer/StateProvider';
import { db } from '../../config/firebase';
import { collection, getDocs, orderBy , addDoc, doc, updateDoc, deleteDoc, query, onSnapshot } from "firebase/firestore";
function OnLeave() {
  const [{employees}, dispatch] = useStateValue()
  useEffect(() => {
    const q = query(collection(db, "employees"));
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

  const trimmedTasks = employees.reduce((acc, employee) => {
    if(employee.data.tasks){
      const date = new Date()
      const employeeTasks = employee.data.tasks.map((item, i) => {
        if(date.setDate(date.getDate() + 7) > new Date(item.deadline)){
         return item
        }
      })
      acc.push(
        ...employeeTasks.filter((item, i) => item !== undefined)
      )
    }
    return acc
  }, [])

  const sortedTasks = trimmedTasks.sort((a, b) => {
    const deadlineA = new Date(a.deadline).getTime()
    const deadlineB = new Date(b.deadline).getTime()
    return deadlineA - deadlineB;
  })
  console.log(Boolean(trimmedTasks))
  return (
    <div className='section__app'>
      <table className='employees'>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Task details</th>
              <th>Priority</th>
              <th>Task deadline</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.length > 0 
            ? sortedTasks.map((item, index) => (
                <tr key={item.taskId} id={item.taskId}>
                  <td>
                    <input type="text" name='employee' readOnly defaultValue={item.employee}/>
                  </td>
                  <td>
                    <input type="text" name='details' data-timestamp defaultValue={item.details} readOnly/>
                  </td>
                  <td>
                    <input type="text" defaultValue={item.priority}/>
                  </td>
                  <td>
                    <input type="datetime-local" name='deadline' data-timestamp defaultValue={item.deadline} readOnly/>
                  </td>
                </tr>
              ))
            : <span>No tasks for upcoming 7 days</span>
            }
          </tbody>
        </table>
    </div>
  )
}

export default OnLeave
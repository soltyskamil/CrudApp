import React, { useState, useEffect } from 'react'
import { useStateValue } from '../../reducer/StateProvider';
import { db } from '../../config/firebase';
import { collection, getDocs, orderBy , addDoc, doc, updateDoc, deleteDoc, query, onSnapshot } from "firebase/firestore";
function Analytics() {
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
  console.log(employees)
  return (
    <div>
      Analytics
      <table className='employees'>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Task finished</th>
            <th>Most common task priority</th>
            <th>Average time needed to finish the task</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 && employees.map((item, i) => {
            function millisToMinutesAndSeconds(millis) {
              var minutes = Math.floor(millis / 60000);
              var seconds = ((millis % 60000) / 1000).toFixed(0);
              return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
            }
            return (
              <tr key={item.data.id}>
                <td>{item.data.name}</td>
                <td>{item.data.finishedTasks.ended}</td>
                <td></td>
                <td>
                  {item.data.finishedTasks.time 
                  ? millisToMinutesAndSeconds(item.data.finishedTasks.time)
                  : <span>No ended tasks</span>
                  }
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      
    </div>
  )
}

export default Analytics
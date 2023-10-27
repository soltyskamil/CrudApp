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
          <th>Employee</th>
          <th>Task finished</th>
          <th>Most common task priority</th>
          <th>Average time needed to finish the task</th>
        </thead>
        <tbody>

        </tbody>
      </table>
      
    </div>
  )
}

export default Analytics
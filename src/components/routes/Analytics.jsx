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

  const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  const employeesTaskPriority = (item) => {
    if(item.data.allTasks){
      const tasks = item.data.allTasks.map((item, i) => item.priority) 
      const propertyCount = {};
      tasks.forEach(item => {
        if(propertyCount[item]){
          propertyCount[item]++
        } else {
          propertyCount[item] = 1;
        }
      }) 
      
      let mostFrequentProperty = null;
      let maxCount = 0;

      for (const item in propertyCount) {
        if (propertyCount[item] > maxCount) {
            mostFrequentProperty = item;
            maxCount = propertyCount[item];
        }
      }
      return mostFrequentProperty + ' ' + maxCount
    }
  }
  
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
            return (
              <tr key={item.data.id}>
                <td>{item.data.name}</td>
                <td>{item.data.finishedTasks.ended}</td>
                <td>
                  { item.data.allTasks 
                    ? employeesTaskPriority(item)
                    : <span>No data yet</span>
                  }
                </td>
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
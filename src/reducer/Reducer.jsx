import { db } from "../config/firebase"
export const initialState = {
    employees: [],
    loading: true
}

//reducer
export const reducer = (state, action) => {
    switch(action.type){
        case 'FETCH__SUCCESS':
            return {
                employees: [...action.payload],
                loading: false
            }
        case 'ADD_EMPLOYEE':
            return {
                
            }
    }
}
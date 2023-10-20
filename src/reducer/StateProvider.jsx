import { useContext, createContext, useReducer } from "react";

// creating the data layer

export const StateContext = createContext()

// passing the data

export const StateProvider = ({initialState, reducer, children}) => (
    <StateContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </StateContext.Provider>
)

// passing the data

export const useStateValue = () => useContext(StateContext)
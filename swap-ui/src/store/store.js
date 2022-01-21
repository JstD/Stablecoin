import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
const INITIAL_STATE = {
    address: undefined,
    price: undefined,
    totalSupply: undefined,
    swapFee: undefined,
}

export const setAddress = (address)=>{
    return {
        type: 'SET_ADDRESS',
        payload: address,
    }
}

export const setPrice = (price)=>{
    return {
        type: 'SET_PRICE',
        payload: price,
    }
}

export const setTotalSupply = (totalSupply)=>{
    return {
        type: 'SET_TOTALSUPPLY',
        payload: totalSupply,
    }
}

export const setSwapFee = (swapFee)=>{
    return {
        type: 'SET_SWAPFEE',
        payload: swapFee,
    }
}

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_ADDRESS':
            return {
                ...state,
                address: action.payload
            }
        case 'SET_PRICE':
            return {
                ...state,
                price: action.payload
            }
        case 'SET_TOTALSUPPLY':
            return {
                ...state,
                totalSupply: action.payload
            }
        case 'SET_SWAPFEE':
            return {
                ...state,
                swapFee: action.payload
            }
        default:
            return state
    }
}

const store = createStore(userReducer, composeWithDevTools(
    applyMiddleware()))

export default store
import { createSlice } from '@reduxjs/toolkit'

export interface CartState {
    tickets: Ticket[],
    concessions: number[],
    donation: Donation[],
}

interface Ticket {
    eventName: string,
    quantity: number,
    date: Date
}

interface Donation {
    donor: string,
    amount: number,
    message: string
}

const initialState: CartState = {
    tickets: [],
    concessions: [],
    donation: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addTickets: (state, action: { type: string, payload: Ticket}) => {
            const res = [...state.tickets];
            res.push(action.payload)
            state.tickets = res
        },
    },
})

export default cartSlice.reducer
export const { addTickets } = cartSlice.actions
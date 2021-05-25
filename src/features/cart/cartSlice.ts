import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartState {
    tickets: Ticket[],
    concessions: number[],
    donation: Donation[],
}

export interface Ticket {
    eventName: string,
    quantity: number,
    date: Date
}

export interface Donation {
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
        addTicket: (state, action: PayloadAction<Ticket>) => {
            state.tickets.push(action.payload)
        },
    },
})

export const { addTicket } = cartSlice.actions

export default cartSlice.reducer
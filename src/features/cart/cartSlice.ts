import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartState {
    tickets: Ticket[],
    donation: Donation | null | undefined,
}

// TODO: define interface for Play/Event
export interface Ticket {
    eventName: string,
    eventId: number,
    participantName: string,
    concessions: boolean,
    datetime: Date
}

export interface Donation {
    donor: string,
    amount: number,
    message: string
}

const initialState: CartState = {
    tickets: [],
    donation: null
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
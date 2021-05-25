import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface CartState {
    tickets: Ticket[],
    donation: Donation | null | undefined,
    // status: 'pending' | 'loading' | 'failed' | 'success'
}

// TODO: define interface for Play/Event
export interface Ticket {
    eventName: string,
    eventId: number,
    participantId: number,
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
    donation: null,
    // status: 'pending'
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

export const selectContents = (state: RootState) => ({
    tickets: [...state.cart.tickets],
    donation: state.cart.donation
})

export default cartSlice.reducer
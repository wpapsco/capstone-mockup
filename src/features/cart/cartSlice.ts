import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface CartState {
    tickets: Ticket[],
    donation: Donation | null | undefined,
    // status: 'pending' | 'loading' | 'failed' | 'success'
}

// TODO: define interface for Play/Event
export interface Ticket {
    eventName: string,
    participantName: string,
    concessions: boolean,
    datetime: Date
    id: string
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
        addTicket: {
            reducer(state, action: PayloadAction<Ticket>) {
                // TODO: check doesn't already exist in state.tickets
                state.tickets.push(action.payload)
            },
            prepare(ename: string, pname: string, concessions: boolean, date: Date) {
                return {
                    payload: {
                        id: nanoid(),
                        eventName: ename,
                        participantName: pname,
                        concessions,
                        datetime: date
                    }
                }
            }
        },
        removeTicket: (state, action: PayloadAction<string>) => {
            const qry = action.payload
            const ticketIndex = state.tickets.findIndex(t => t.id === qry)
            console.log('ticket index', ticketIndex)
            console.log('pre splice', state.tickets)

            if (ticketIndex > 0) {
                state.tickets.splice(ticketIndex, 1)
                console.log('post splice', state.tickets)
            }
        },
        editTicket: (state) => {
            console.log('not yet implemented')
        }
    },
})

export const { addTicket, removeTicket, editTicket } = cartSlice.actions

export const selectContents = (state: RootState) => ({
    tickets: [...state.cart.tickets],
    donation: state.cart.donation
})

export default cartSlice.reducer
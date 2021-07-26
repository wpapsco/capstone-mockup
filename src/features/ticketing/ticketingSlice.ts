import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, Event, LoadStatus, Ticket } from './ticketingTypes'

export interface ticketingState {
    cart: CartItem[],
    tickets: Ticket[],
    events: Event[],
    eventsStatus: LoadStatus,
    ticketsStatus: LoadStatus,
}

const INITIAL_STATE: ticketingState = {
    cart: [],
    tickets: [],
    events: [],
    eventsStatus: 'idle',
    ticketsStatus: 'idle',
}

// async thunks
export const fetchTickets = createAsyncThunk(
    'tickets/fetch',
    async () => {
        try {
            const res = await fetch('/api/tickets')
            return await res.json()
        } catch (err) {
            console.error(err.message)
        }
    }
)

//TODO: fetchEvents
export const fetchEvents = null

const ticketingSlice = createSlice({
    name: 'cart',
    initialState: INITIAL_STATE,
    reducers: {
        addTicket: (state, action) => state,
        removeTicket: (state, action) => state,
        editQty: (state, action) => state,
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTickets.pending, state => {
                state.ticketsStatus = 'loading'
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.ticketsStatus = 'success'
                state.tickets = (action.payload)
                    ? action.payload
                    : []
            })
    }
})

export default ticketingSlice.reducer
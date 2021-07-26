import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { CartItem, LoadStatus, Play, Ticket } from './ticketingTypes'

export interface ticketingState {
    cart: CartItem[],
    tickets: Ticket[],
    plays: Play[],
    status: LoadStatus,
}

const INITIAL_STATE: ticketingState = {
    cart: [],
    tickets: [],
    plays: [],
    status: 'idle',
}

const fetchData = async (url: string) => {
    try {
        const res = await fetch(url)
        return await res.json()
    }
    catch(err) {
        console.error(err.message)
    }
}

//TODO: fetchEvents
export const fetchTicketingData = createAsyncThunk(
    'events/fetch',
    async () => {
        const plays: Play[] = await fetchData('/api/plays')
        const tickets: Ticket[] = await fetchData('/api/tickets')
        return { plays, tickets }
    }
)

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
            .addCase(fetchTicketingData.pending, state => {
                state.status = 'loading'
            })
            .addCase(fetchTicketingData.fulfilled, (state, action) => {
                state.status = 'success'
                state.tickets = (action.payload.tickets)
                    ? action.payload.tickets
                    : []
                state.plays = (action.payload.plays)
                    ? action.payload.plays
                    : []
            })
            .addCase(fetchTicketingData.rejected, state => {
                state.status = 'failed'
            })
    }
})

export default ticketingSlice.reducer
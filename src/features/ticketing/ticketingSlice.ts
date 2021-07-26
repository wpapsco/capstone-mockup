import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { CartItem, LoadStatus, Play, Ticket } from './ticketingTypes'

export interface ticketingState {
    cart: CartItem[],
    tickets: Ticket[],
    plays: Play[],
    status: LoadStatus,
    selectedTicket: number | null,
}

const INITIAL_STATE: ticketingState = {
    cart: [],
    tickets: [],
    plays: [],
    status: 'idle',
    selectedTicket: null,
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
        selectTicket: (state, action: PayloadAction<number>) => ({
            ...state,
            selectedTicket: (action.payload)
                ? action.payload
                : null
        }),
        clearSelection: (state) => ({...state, selectedTicket: null})
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

export const selectSelectedTicket = (state: RootState) => state.ticketing.selectedTicket
export const { selectTicket, clearSelection } = ticketingSlice.actions
export default ticketingSlice.reducer
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { NumericLiteral } from 'typescript'
import { RootState } from '../../app/store'
import { CartItem, LoadStatus, Play, Ticket } from './ticketingTypes'

export interface ticketingState {
    cart: CartItem[],
    tickets: Ticket[],
    plays: Play[],
    status: LoadStatus,
    selection: {
        selectedTicket: number | null,
        qty: number | '',
    }
}

const INITIAL_STATE: ticketingState = {
    cart: [],
    tickets: [],
    plays: [],
    status: 'idle',
    selection: {
        selectedTicket: null,
        qty: '',
    }
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

// TODO: sort by date
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
            selection: {
                ...state.selection,
                selectedTicket: (action.payload)
                    ? action.payload
                    : null
            }
        }),
        setQty: (state, action: PayloadAction<number>) => ({
            ...state,
            selection: {
                ...state.selection,
                qty: (action.payload > 0)
                    ? action.payload
                    : 0
            }
        }),
        clearSelection: (state) => ({
            ...state,
            selection: {
                selectedTicket: null,
                qty: '',
            }
        })
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

export const selectSelectedTicket = (state: RootState) => state.ticketing.selection.selectedTicket
export const selectTicketQty = (state: RootState) => state.ticketing.selection.qty
export const { selectTicket, clearSelection, setQty } = ticketingSlice.actions
export default ticketingSlice.reducer
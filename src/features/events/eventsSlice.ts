import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface EventsState {
    data: Event[],
    status: 'pending' | 'loading' | 'success' | 'failed'
}

const initialState: EventsState = {
    data: [],
    status: 'pending'
}

export interface Event {
    id: string,
    name: string,
    description: string,
    img_url: string,
    date: Date
}

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        test: () => {
            console.log('Not implemented')
        }
    }
})

// TODO: Create thunk for fetching events from server
export const { test } = eventsSlice.actions
export const selectEvents = (state: RootState) => state.events.data

export default eventsSlice.reducer

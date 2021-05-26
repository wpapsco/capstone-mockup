import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

import TestData from './testEvents'

export interface EventsState {
    data: Event[],
    status: 'pending' | 'loading' | 'success' | 'failed'
}

const initialState: EventsState = {
    data: TestData,
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
export const selectEventById = (state: RootState, id: string) => state.events.data.find(ev=>ev.id===id)

export default eventsSlice.reducer

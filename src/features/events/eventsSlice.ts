import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

import TestData from './testEvents'

export interface EventDetails {
    id: string,
    name: string,
    shortDesc: string,
    imgUrl: string,
    date: Date,
    pageSections: { heading: string, contents: string }[],
    address: string,
}

export interface EventsState {
    data: EventDetails[],
    status: 'pending' | 'loading' | 'success' | 'failed'
}

const initialState: EventsState = {
    data: TestData,
    status: 'pending'
}

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        CreateEvent: () => {
            console.log('Not implemented')
        }
    }
})

// TODO: Create thunk for fetching events from server
export const { CreateEvent } = eventsSlice.actions
export const selectAllEvents = (state: RootState) => state.events.data
export const selectEventById =
    (state: RootState, id: string): EventDetails | undefined => state.events.data.find(ev=>ev.id===id)

export default eventsSlice.reducer

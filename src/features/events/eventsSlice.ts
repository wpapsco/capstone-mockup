import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import {
    urlFriendly,
    groupByKey,
    ItemGroup,
} from '../../utils'

export interface Event {
     id: number,
     playname: string,
     playdescription?: string,
     eventdate: string,
     starttime: string,
     totalseats: number,
     availableseats: number,
}
export type Showing = Omit<Event, "playname"|"playdescription">

export const groupPlays = (events: Event[]): ItemGroup<Event> =>
    groupByKey<Event>(events, 'playname', urlFriendly)

export const fetchEventData = createAsyncThunk(
    'events/fetchAll',
    async () => {
        try {
            const res = await fetch('/api/event-list')
            // [{id, playname, playdesc, eventdate, starttime, totalseats, availableseats}]
            const allEvents: Event[] = await res.json()
            return groupPlays(allEvents)
        } catch (err) {
            console.error(err.message)
        }
    }
)

export interface EventsState {
    data: ItemGroup<Event>,
    status: 'idle' | 'loading' | 'success' | 'failed'
}

const initialState: EventsState = {
    data: {},
    status: 'idle'
}

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEventData.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchEventData.fulfilled, (state, action) => {
                state.status = 'idle'
                state.data = (action.payload) ? action.payload : {}
            })
            .addCase(fetchEventData.rejected, (state) => {
                state.status = 'failed'
            })
    }
})

export const selectAllEvents = (state: RootState) => 
    Object.keys(state.events.data).map(key => {
        const { playname, playdescription } = state.events.data[key][0]
        return {
            playname,
            playdescription: (playdescription) ?
                playdescription : ''
        }
    })

// Returns list of showings for the event
export const selectEventShowings =
    (state: RootState, name: string): Event[] | undefined => (state.events.data) ?
        state.events.data[name] :
        undefined

export default eventsSlice.reducer

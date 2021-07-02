import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

// TODO: pre-process response before shoving into Redux
// Sample shape:
export const fetchEventData = createAsyncThunk(
    'events/fetchAll',
    async () => {
        try {
            const res = await fetch('/api/event-list')
            console.log(res)
            return await res.json()
        } catch (err) {
            console.error(err.message)
        }
    }
    )

// Date interger ranging 1-31
export interface Showing {
    month: 'Jan'|'Feb'|'Mar'|'Apr'|'May'|'Jun'|'Jul'|'Aug'|'Sep'|'Oct'|'Nov'|'Dec',
    weekday: 'Mon'|'Tue'|'Wed'|'Thu'|'Fri'|'Sat'|'Sun',
    date: number,
    civilianTime: string,
}
// TODO: replace date prop with calendarDate & civilianTime
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
    status: 'idle' | 'loading' | 'success' | 'failed'
}

const initialState: EventsState = {
    data: [],
    status: 'idle'
}

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        CreateEvent: () => {
            console.log('Not implemented')
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEventData.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchEventData.fulfilled, (state, action) => {
                state.status = 'idle'
                state.data = action.payload
            })
            .addCase(fetchEventData.rejected, (state) => {
                state.status = 'failed'
            })
    }
})

// TODO: Create thunk for fetching events from server
export const { CreateEvent } = eventsSlice.actions
export const selectAllEvents = (state: RootState) => state.events.data
export const selectEventById =
    (state: RootState, id: string): EventDetails | undefined => state.events.data.find(ev=>ev.id===id)

export default eventsSlice.reducer

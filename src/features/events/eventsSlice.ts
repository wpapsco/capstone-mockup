import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

// TODO: pre-process response before shoving into Redux
// Sample shape:
// export interface Event {
//      id: number,
//      playname: string,
//      playdescription?: string,
//      eventdate: string,
//      starttime: string,
//      totalseats: number,
//      availableseats: number,
// }
export type Event = Showing & Omit<Play, 'showings'>
export interface Showing {
    id: number,
    eventdate: string,
    starttime: string,
    totalseats: number,
    availableseats: number,
}

export interface Play {
    playname: string,
    playdescription?: string,
    showings: Showing[],
}

interface Item<T = any> {
    [key: string]: T
}
interface ItemGroup<T> {
    [key: string]: T[]
}

function groupByKey<T extends Item>(arr: any[], key: keyof T): ItemGroup<T> {
    return arr.reduce<ItemGroup<T>>((map, item) => {
        const itemKey = item[key]
        if(map[itemKey]) {
            map[itemKey].push(item)
        } else {
            map[itemKey] = [item]
        }
        return map
    }, {})
}

const getShowing = (e: Event): Showing => {
    const {id, eventdate, starttime, totalseats, availableseats} = e
    return {id, eventdate, starttime, totalseats, availableseats}
}

export const groupPlays = (events: Event[]) =>
    groupByKey<Play>(events, 'playname')
        .

// Group Plays by name from Event[]
    // Extract Showing from Event
    // Group Showings by Play name
    
export const fetchEventData = createAsyncThunk(
    'events/fetchAll',

     
    async () => {
        try {
            const res = await fetch('/api/event-list')
            // [{id, playname, playdesc, eventdate, starttime, totalseats, availableseats}]
            const allEvents: Event[] = await res.json()
            return allEvents
        } catch (err) {
            console.error(err.message)
        }
    }
)


// TODO: replace date prop with calendarDate & civilianTime
export interface EventDetails {
    id: string,
    name: string,
    shortDesc: string,
    imgUrl: string,
    eventdate: string,
    starttime: string,
    pageSections: { heading: string, contents: string }[],
    address: string,
}

export interface EventsState {
    data: Play[] | undefined,
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
    (state: RootState, name: string): Play | undefined => (state.events.data) ?
        state.events.data.find(ev=>ev.playname===name) :
        undefined

export default eventsSlice.reducer

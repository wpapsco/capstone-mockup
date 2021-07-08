import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

// TODO: pre-process response before shoving into Redux
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

export const groupPlays = (events: Event[]) =>
    groupByKey<Event>(events, 'playname')

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
    data: ItemGroup<Event> | undefined,
    status: 'idle' | 'loading' | 'success' | 'failed'
}

const initialState: EventsState = {
    data: {},
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

export const { CreateEvent } = eventsSlice.actions
export const selectAllEvents = (state: RootState) => state.events.data
// Returns list of showings for the event
export const selectEventByName =
    (state: RootState, name: string): Event[] | undefined => (state.events.data) ?
        state.events.data[name] :
        undefined

export default eventsSlice.reducer

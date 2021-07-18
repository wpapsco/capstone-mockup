import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Dictionary } from '../../utils'

export interface Event {
     id: number,
     playname: string,
     playdescription?: string,
     image_url: string,
     eventdate: string,
     starttime: string,
     totalseats: number,
     availableseats: number,
}

export type Showing = Omit<Event, "playname"|"playdescription"|"image_url">

export interface Play {
    playname: string,
    playdescription?: string,
    image_url: string,
    showings: Showing[],
}


export const aggregateShowings = (events: Event[]) =>
    events.reduce<Dictionary<Play>>((plays, event) => {
        const { playname, playdescription, image_url, ...showing } = event
        const key = playname.replace(/ /g, '_')
        return (plays[key]) ?
            { ...plays, [key]: {...plays[key], showings: [...plays[key].showings, showing] as Showing[]}} :
            { ...plays, [key]: { playname, playdescription, image_url, showings: [showing] }}
        },
        {}
    )

export const fetchEventData = createAsyncThunk(
    'events/fetchAll',
    async () => {
        try {
            const res = await fetch('/api/event-list')
            const allEvents: Event[] = await res.json()
            return aggregateShowings(allEvents)
        } catch (err) {
            console.error(err.message)
        }
    }
)

export interface EventsState {
    data: Dictionary<Play>,
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
                state.status = 'success'
                state.data = (action.payload) ? action.payload : {}
            })
            .addCase(fetchEventData.rejected, (state) => {
                state.status = 'failed'
            })
    }
})

// Returns {playname, playdescription, image_url}[]
export const selectAllEvents = (state: RootState) => 
    Object.keys(state.events.data).map(key => {
        const { playname, playdescription, image_url } = state.events.data[key]
        return {
            playname,
            playdescription: (playdescription) ?
                playdescription : '',
            image_url,
        }
    })

// Returns list of showings for given event, or undefined if play doesn't exist
export const selectEventShowings =
    (state: RootState, name: string): Showing[] | undefined => {
        const key = name.replace(/ /g, '_')
        return (state.events.data[key]) ?
            state.events.data[key].showings :
            undefined
    }

export default eventsSlice.reducer

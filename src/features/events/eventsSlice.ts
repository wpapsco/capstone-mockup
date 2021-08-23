import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Dictionary } from '../../utils'

export interface EventInstance {
     id: number,
     eventid: number,
     eventname: string,
     eventdescription?: string,
     image_url: string,
     eventdate: string,
     starttime: string,
     totalseats: number,
     availableseats: number,
}

export type Instance = Omit<EventInstance, "eventid"|"eventname"|"eventdescription"|"image_url">

export interface Event {
    eventname: string,
    eventdescription?: string,
    image_url: string,
    eventid: number,
    instances: Instance[],
}


export const aggregateInstances = (events: EventInstance[]) =>
    events.reduce<Dictionary<Event>>((events, event) => {
        const { eventname, eventdescription, image_url, eventid, ...showing } = event

        return (events[eventid]) ?
            { ...events, [eventid]: {...events[eventid], instances: [...events[eventid].instances, showing] as Instance[]}} :
            { ...events, [eventid]: { eventid, eventname, eventdescription, image_url, instances: [showing] }}
        }, {})

export const fetchEventInstanceData = createAsyncThunk(
    'events/fetchAll',
    async () => {
        try {
            const res = await fetch('/api/active-event-instance-list')
            const allEventInstances: EventInstance[] = await res.json()
            return aggregateInstances(allEventInstances)
        } catch (err) {
            console.error(err.message)
        }
    }
)

export interface EventInstancesState {
    data: Dictionary<Event>,
    status: 'idle' | 'loading' | 'success' | 'failed'
}

export const INITIAL_STATE: EventInstancesState = {
    data: {},
    status: 'idle'
}

const eventsSlice = createSlice({
    name: 'events',
    initialState: INITIAL_STATE,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEventInstanceData.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchEventInstanceData.fulfilled, (state, action) => {
                state.status = 'success'
                state.data = (action.payload) ? action.payload : {}
            })
            .addCase(fetchEventInstanceData.rejected, (state) => {
                state.status = 'failed'
            })
    }
})

// Returns {eventname, eventdescription, image_url}[]
export const selectAllEventInstances = (state: RootState) => 
    Object.keys(state.events.data).map(key => {
        const { eventname, eventdescription, image_url, eventid } = state.events.data[key]
        return {
            eventname,
            eventdescription: (eventdescription) ?
                eventdescription : '',
            image_url,
            eventid
        }
    })

// Returns list of instances for given event, or undefined if play doesn't exist
export const selectEventInstanceData =
    (state: RootState, id: number): Event | undefined => {
        const key = id
        return (state.events.data[key]) ?
            state.events.data[key] :
            undefined
    }

export default eventsSlice.reducer

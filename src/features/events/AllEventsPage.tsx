import { selectAllEvents, fetchEventData } from './eventsSlice'
import { appSelector, useAppDispatch } from '../../app/hooks'
import { useEffect } from 'react'

import { Typography } from '@material-ui/core'
import EventRow from './EventRow'

export default function AllEventsPage() {
    const dispatch = useAppDispatch()
    const allEvents = appSelector(selectAllEvents)
    const loadStatus = appSelector(state => state.events.status)

    useEffect(() => {
        if (loadStatus === 'idle') {
            dispatch(fetchEventData())
        }
    }, [dispatch, loadStatus])


    if (allEvents === undefined || allEvents.length === 0) {
        return <div>No events to show. Please check again later.</div>
    }

    // TODO: Make event data in redux is compatible with EventRow component
    return (
        <section>
            <Typography variant='h4' component='h1'>Upcoming Events</Typography>
            {allEvents.map(details => <EventRow {...details} />)}
        </section>
    )
}
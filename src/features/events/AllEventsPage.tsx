import { useEffect } from 'react'
import { appSelector, useAppDispatch } from '../../app/hooks'
import { selectAllEvents, fetchEventData } from './eventsSlice'

import { Typography } from '@material-ui/core'

export default function AllEventsPage() {
    const dispatch = useAppDispatch()
    const allEvents = appSelector(selectAllEvents)
    const loadStatus = appSelector(state => state.events.status)

    useEffect(() => {
        if (loadStatus === 'idle') {
            dispatch(fetchEventData())
        }
    }, [dispatch])

    if (allEvents.length < 1) {
        return <div>No events to show. Please check again later.</div>
    }

    // TODO: Display events
    return (
        <section>
            <Typography variant='h4' component='h1'>Upcoming Events</Typography>
        </section>
    )
}
import { useEffect } from 'react'
import { appSelector, useAppDispatch } from '../../app/hooks'
import { fetchEventData } from './eventsSlice'
import EventsList from './EventsList'

import { Typography } from '@material-ui/core'

export default function AllEventsPage() {
    const dispatch = useAppDispatch()
    const loadStatus = appSelector(state => state.events.status)

    useEffect(() => {
        if (loadStatus === 'idle') {
            dispatch(fetchEventData())
        }
    }, [dispatch])

    return (
        <section>
            <Typography
                variant='h4'
                component='h1'
                className='mt-2 '>Upcoming Events</Typography>
            <EventsList />
        </section>
    )
}
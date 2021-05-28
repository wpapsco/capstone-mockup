import { EventDetails, selectAllEvents } from './eventsSlice'
import { appSelector } from '../../app/hooks'

import { Link } from 'react-router-dom'
import Showtime from '../../components/Showtime'
import { Card, CardActionArea } from '@material-ui/core'
import EventRow from './EventRow'

export default function AllEventsPage() {
    const allEvents = appSelector(selectAllEvents)

    if (!allEvents) {
        return <div>No events to show. Please check again later.</div>
    }

    const eventCards = allEvents.map(details => <EventRow {...details} />)

    return (
        <section>
            <h1>Upcoming Events</h1>
            {eventCards}
        </section>
    )
}
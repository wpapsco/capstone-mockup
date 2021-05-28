import { selectAllEvents } from './eventsSlice'
import { appSelector } from '../../app/hooks'

import { Typography } from '@material-ui/core'
import EventRow from './EventRow'

export default function AllEventsPage() {
    const allEvents = appSelector(selectAllEvents)

    if (!allEvents) {
        return <div>No events to show. Please check again later.</div>
    }

    const eventCards = allEvents.map(details => <EventRow {...details} />)

    return (
        <section>
            <Typography variant='h4' component='h1'>Upcoming Events</Typography>
            {eventCards}
        </section>
    )
}
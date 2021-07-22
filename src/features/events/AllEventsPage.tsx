import EventsList from './EventsList'
import { Typography } from '@material-ui/core'

export default function AllEventsPage() {
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
import { selectAllEvents } from './eventsSlice'
import EventCard from './EventCard'
import { appSelector } from '../../app/hooks'

import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
}))

const EventsList = () => {
    const allEvents = appSelector(selectAllEvents)
    const loadStatus = appSelector(state => state.events.status)

    const classes = useStyles()    

    return (
        <section className={classes.root}>
            {(loadStatus === 'loading') && <p>Loading...</p>}
            {
                (loadStatus === 'success') &&
                    (allEvents.length > 0) ?
                        allEvents.map(evnt => <EventCard key={evnt.playname} {...evnt} />) :
                        <p>No upcoming events</p>
            }
        </section>
    )
}
export default EventsList
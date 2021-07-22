import { selectAllEvents } from './eventsSlice'
import EventCard from './EventCard'
import { appSelector } from '../../app/hooks'

import { CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    loading: {
        padding: '20px',
        alignSelf: 'center',
    }
}))

const EventsList = () => {
    const allEvents = appSelector(selectAllEvents)
    const loadStatus = appSelector(state => state.events.status)

    const classes = useStyles()    

    return (
        <section className={classes.root}>
            {(loadStatus === 'loading') && <CircularProgress className={classes.loading}/>}
            {(loadStatus === 'success') &&
                allEvents.map(evnt => <EventCard key={evnt.playname} {...evnt} />)
            }
        </section>
    )
}
export default EventsList

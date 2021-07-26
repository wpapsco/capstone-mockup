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
    const allEvents = appSelector(state => state.ticketing.plays)
    const loadStatus = appSelector(state => state.ticketing.status)

    const classes = useStyles()    

    return (
        <section className={classes.root}>
            {(loadStatus === 'loading') && <CircularProgress className={classes.loading}/>}
            {(loadStatus === 'success') &&
                allEvents.map(event => <EventCard key={event.id} {...event} />)
            }
        </section>
    )
}
export default EventsList

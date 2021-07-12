import { selectAllEvents } from './eventsSlice'
import { capitalize } from '../../utils'
import { appSelector } from '../../app/hooks'

const EventsList = () => {
    const allEvents = appSelector(selectAllEvents)
    const loadStatus = appSelector(state => state.events.status)

    return (
        <ul>
            {(loadStatus === 'loading') && <p>Loading...</p>}
            {
                (loadStatus === 'success') &&
                    (allEvents.length > 0) ?
                        allEvents.map(evnt => <li>{capitalize(evnt.playname)}</li>) :
                        <p>No upcoming events</p>
            }
        </ul>
    )
}
export default EventsList
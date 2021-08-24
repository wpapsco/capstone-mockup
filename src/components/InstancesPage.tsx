import { appSelector } from '../app/hooks'
import Typography from '@material-ui/core/Typography'
import InstancesGroup from './InstancesGroup'

export default function InstancesPage() {
    const eventsLoadStatus = appSelector(state => state.events.status)
    const instancesByEvent = appSelector(state => state.events.data)
    const groupedInstances = Object.keys(instancesByEvent).map(key => {
        const {eventname, eventdescription, ...data} = instancesByEvent[key]
        return <InstancesGroup
            key={key}
            {...data}
            eventTitle={eventname}
            eventDesc={eventdescription}
        />
    })

    return (
        <div>
            <Typography variant="h2">Select a Showing</Typography>
            {(eventsLoadStatus === 'loading') && <p>Loading...</p>}
            {(eventsLoadStatus === 'success') && groupedInstances}
        </div>
    )
}

// Want: Display showings by event
// 

import { appSelector } from '../app/hooks'
import Typography from '@material-ui/core/Typography'
import ShowingsGroup from './ShowingsGroup'

export default function ShowingsPage() {
    const eventsLoadStatus = appSelector(state => state.events.status)
    const showingsByEvent = appSelector(state => state.events.data)
    const groupedShowings = Object.keys(showingsByEvent).map(key => {
        const first = showingsByEvent[key][0]
        return <ShowingsGroup
            key={key}
            eventTitle={first.playname}
            showings={showingsByEvent[key]}
        />
    })

    return (
        <div>
            <Typography variant="h2">Select a Showing</Typography>
            {(eventsLoadStatus === 'loading') && <p>Loading...</p>}
            {(eventsLoadStatus === 'success') && groupedShowings}
        </div>
    )
}

// Want: Display showings by event
// 

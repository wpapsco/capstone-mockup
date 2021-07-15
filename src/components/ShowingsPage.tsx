import { appSelector, useAppDispatch } from '../app/hooks'
import { fetchEventData } from '../features/events/eventsSlice'
import { useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import ShowingsGroup from './ShowingsGroup'


export default function ShowingsPage(props: {showingSelected: () => void}) {
    const dispatch = useAppDispatch()
    const eventsLoadStatus = appSelector(state => state.events.status)
    useEffect(() => {
        if (eventsLoadStatus === 'idle') { dispatch(fetchEventData) }
    }, [dispatch])

    const showingsByEvent = appSelector(state => state.events.data)
    const groupedShowings = Object.keys(showingsByEvent).map(key => {
        const first = showingsByEvent[key][0]
        return <ShowingsGroup
            key={key}
            eventTitle={first.playname}
            imageUrl={first.image_url}
            showings={showingsByEvent[key]}
        />
    })

    return (
        <div>
            <Typography variant="h2">Select a Showing</Typography>
            {groupedShowings}
        </div>
    )
}

// Want: Display showings by event
// 

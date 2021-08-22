import { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../../app/hooks'
import { fetchTicketingData } from '../../../ticketing/ticketingSlice'
import { fetchEventData } from '../../../events/eventsSlice'
import { openSnackbar } from '../../../snackbarSlice'

import EventForm, { NewEventData } from './EventForm'
import { Typography } from '@material-ui/core'
import { format } from 'date-fns'

const formatShowingData = (playid: number) => (data: any) => {
    const {DateTime, totalseats, ticketTypeId} = data
    const eventdate = format(DateTime, 'yyyy-MM-dd')
    const starttime = format(DateTime, 'HH:mm:00')
    return {playid, eventdate, starttime, totalseats, tickettype: ticketTypeId}
}

export default function CreateEventPage() {
    const dispatch = useAppDispatch()
    const [ticketTypes, setTicketTypes] = useState([])

    const fetchTicketTypes = async () => {
        const res = await fetch('/api/tickets/type')
        setTicketTypes(await res.json())
    }
    
    useEffect(() => {
        fetchTicketTypes()
    }, [])
    
    // TODO: create endpoint that combines /api/create-play & /api/create-showings
    const onSubmit = async (formData: NewEventData) => {
        const {image_url, playname, playdescription, showings} = formData
        
        const createPlayRes = await fetch('/api/create-play', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({playname, playdescription, image_url})
        })

        if (createPlayRes.ok) {
            const playData = await createPlayRes.json()
            const { id } = playData.rows[0]
            const showingdata = showings.map(formatShowingData(id))

            const postShowings = await fetch('/api/create-showings', {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({showings: showingdata})
            })
            // update Redux state with new event & available tickets
            if (postShowings.ok) {
                console.log('dispatch')
                dispatch(fetchEventData())
                dispatch(fetchTicketingData())
                dispatch(openSnackbar('New Event Created'))
            }
        }   
        else {
            console.error('New play creation failed', createPlayRes.statusText)
        }
    }

    return (
        <div>
            <Typography variant='h3' component='h1'>Create New Event</Typography>
            <EventForm onSubmit={onSubmit} ticketTypes={ticketTypes} />
        </div>
    )
}

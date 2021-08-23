import { useEffect, useState } from 'react'
import { useAppDispatch } from '../../../../app/hooks'
import { fetchTicketingData } from '../../../ticketing/ticketingSlice'
import { fetchEventInstanceData } from '../../../events/eventsSlice'
import { openSnackbar } from '../../../snackbarSlice'

import EventForm, { NewEventData } from './EventForm'
import { Typography } from '@material-ui/core'
import { format } from 'date-fns'

const formatShowingData = (eventid: number) => (data: any) => {
    const {DateTime, totalseats, ticketTypeId} = data
    const eventdate = format(DateTime, 'yyyy-MM-dd')
    const starttime = format(DateTime, 'HH:mm:00')
    return {eventid, eventdate, starttime, totalseats, tickettype: ticketTypeId}
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
    
    // TODO: create endpoint that combines /api/create-event & /api/create-showings
    const onSubmit = async (formData: NewEventData) => {
        const {image_url, eventname, eventdescription, showings} = formData
        
        const createPlayRes = await fetch('/api/create-event', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({eventname, eventdescription, image_url})
        })

        if (createPlayRes.ok) {
            const eventData = await createPlayRes.json()
            const { id } = eventData.rows[0]
            const showingdata = showings.map(formatShowingData(id))

            const postShowings = await fetch('/api/create-event-instances', {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({instances: showingdata})
            })
            // update Redux state with new event & available tickets
            if (postShowings.ok) {
                console.log('dispatch')
                dispatch(fetchEventInstanceData())
                dispatch(fetchTicketingData())
                dispatch(openSnackbar('New Event Created'))
            }
        }   
        else {
            console.error('New event creation failed', createPlayRes.statusText)
        }
    }

    return (
        <div>
            <Typography variant='h3' component='h1'>Create New Event</Typography>
            <EventForm onSubmit={onSubmit} ticketTypes={ticketTypes} />
        </div>
    )
}

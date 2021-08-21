import { useEffect, useState } from 'react'
import EventForm, { NewEventData } from './EventForm'
import { Typography } from '@material-ui/core'
import { format } from 'date-fns'


export default function CreateEventPage() {
    const [ticketTypes, setTicketTypes] = useState([])

    const fetchTicketTypes = async () => {
        const res = await fetch('/api/tickets/type')
        const tTypes = await res.json()
        setTicketTypes(tTypes)
    }
    
    useEffect(() => {
        fetchTicketTypes()
    }, [])
    
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
            const showingdata = showings.map(s => {
                const {DateTime, totalseats, ticketType} = s
                const eventdate = format(DateTime, 'yyyy-MM-dd')
                const starttime = format(DateTime, 'HH:mm:00')
                const dat = {playid: id, eventdate, starttime, totalseats, tickettype: ticketType}
                return dat
            })
            const createShowingsRes = await fetch('/api/create-showings', {
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify({showings: showingdata})
            })
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

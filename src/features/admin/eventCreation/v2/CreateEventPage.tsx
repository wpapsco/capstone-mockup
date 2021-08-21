import { useEffect, useState } from 'react'
import EventForm from './EventForm'
import { Typography } from '@material-ui/core'


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
    
    const onSave = async (formData: any) => {
        const {image_url, playname, playdescription, showings} = formData
        
        const createPlayRes = await fetch('/api/create-play', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({playname, playdescription, image_url})
        })
        if (createPlayRes.ok) {
            const playData = await createPlayRes.json()
            console.log(playData)
        }
        else {
            console.error('New play creation failed', createPlayRes.statusText)
        }
    }

    return (
        <div>
            <Typography variant='h3' component='h1'>Create New Event</Typography>
            <EventForm onSave={onSave} ticketTypes={ticketTypes} />
        </div>
    )
}

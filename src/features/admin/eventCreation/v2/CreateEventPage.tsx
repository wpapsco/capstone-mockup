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
    
    const onSave = (formData: any) => {
        console.log('CreateEventPage', formData)
    }

    return (
        <div>
            <Typography variant='h3' component='h1'>Create New Event</Typography>
            <EventForm onSave={onSave} ticketTypes={ticketTypes} />
        </div>
    )
}

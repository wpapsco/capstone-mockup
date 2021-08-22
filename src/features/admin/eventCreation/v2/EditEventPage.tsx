import { useState, useEffect, useMemo } from 'react'
import EventForm, { NewEventData } from './EventForm'
import { useParams } from 'react-router-dom'
import { fetchTicketingData, selectPlayData, EventPageData } from '../../../ticketing/ticketingSlice'
import { appSelector } from '../../../../app/hooks'

interface EditEventPageProps { playid: string }

const formatToEventFormData = (data: EventPageData): Partial<NewEventData> => {

    return {
        playname: data.title,
        playdescription: data.description,
        image_url: data.image_url,
        showings: data.tickets.map(t => ({
            DateTime: t.date,
            totalseats: t.totalseats ?? 0,
            ticketTypeId: '0'
        }))
    }
}

export default function EditEventPage() {
    const { playid } = useParams<EditEventPageProps>()
    const [ticketTypes, setTicketTypes] = useState([])

    const playData = appSelector(state => selectPlayData(state, playid))
    const eventData = playData ? formatToEventFormData(playData) : undefined

    const fetchTicketTypes = async () => {
        const res = await fetch('/api/tickets/type')
        setTicketTypes(await res.json())
    }

    useEffect(() => {
        fetchTicketTypes()
    }, [])

    // TODO
    const onSubmit = async (formData: NewEventData) => {
        const res = await fetch('/api/EditEvent?playid', {
            method: 'PUT',
            credentials: 'include'
        })

        if (res.ok) {
            const resBody = await res.json()
        }
        else {
            console.error(res.statusText)
        }

    }

    return (
        <div>
            <EventForm
            ticketTypes={ticketTypes}
            onSubmit={onSubmit}
            initialValues={eventData}
            editMode
        />
            <pre style={{backgroundColor: 'lightgrey', padding: '30px', width: '50%', margin: '15px auto'}}>
                playid: {playid}
            </pre>
        </div>
    )
}



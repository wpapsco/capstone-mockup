import { useState, useEffect } from 'react'
import EventForm, { NewEventData } from './EventForm'
import { Typography } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { selectPlayData, EventPageData } from '../../../ticketing/ticketingSlice'
import { appSelector } from '../../../../app/hooks'
import { diff } from 'deep-diff'


interface EditEventPageProps { playid: string }

const formatToEventFormData = (data: EventPageData): Partial<NewEventData> => ({
    playname: data.title,
    playdescription: data.description,
    image_url: data.image_url,
    showings: data.tickets.map(t => ({
        id: t.eventid,
        DateTime: t.date,
        totalseats: t.totalseats ?? 0,
        ticketTypeId: '0'
    }))
})

// TODO compare which fields are 
export default function EditEventPage() {
    const { playid } = useParams<EditEventPageProps>()
    const [ticketTypes, setTicketTypes] = useState([])

    const playData = appSelector(state => selectPlayData(state, playid))
    const initValues = playData ? formatToEventFormData(playData) : undefined

    const fetchTicketTypes = async () => {
        const res = await fetch('/api/tickets/type')
        setTicketTypes(await res.json())
    }
    useEffect(() => {
        fetchTicketTypes()
    }, [])

    // TODO update in database
    const onSubmit = async (updatedData: NewEventData) => {
        // calc diff between init values and new values
        const changes = diff(initValues, updatedData)
        console.log('init', initValues)
        console.log('newdata', updatedData)
        console.log('diff', changes)
        
        // const res = await fetch('/api/EditEvent?playid', {
        //     method: 'PUT',
        //     credentials: 'include',
        //     body: JSON.stringify(changes)
        // })

        // if (res.ok) {
        //     const resBody = await res.json()
        // }
        // else {
        //     console.error(res.statusText)
        // }
    }

    return (
        <div>
            <Typography component='h1' variant='h3'>
                Edit {playData?.title ?? 'Your Event'}
            </Typography>
            <EventForm
                ticketTypes={ticketTypes}
                onSubmit={onSubmit}
                initialValues={initValues}
                editMode
            />
            <pre style={{backgroundColor: 'lightgrey', padding: '30px', width: '50%', margin: '15px auto'}}>
                playid: {playid}
            </pre>
        </div>
    )
}



import { useState, useEffect } from 'react'
import EventForm, { NewEventData } from './EventForm'
import { Typography } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { selectPlayData, EventPageData, fetchTicketingData } from '../../../ticketing/ticketingSlice'
import { appSelector, useAppDispatch } from '../../../../app/hooks'
import { diff } from 'deep-diff'
import { fetchEventData } from '../../../events/eventsSlice'
import { openSnackbar } from '../../../snackbarSlice'


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
    const dispatch = useAppDispatch()
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

    const [changes, setChanges] = useState<ReturnType<typeof diff>>() //TODO: delete after testing
    const onSubmit = async (updatedData: NewEventData) => {
        const deltas = diff(initValues, updatedData)
        setChanges(deltas)  //TODO: delete after testing
        
        const res = await fetch('/api/edit-event', {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playid, deltas })
        })
        if (res.ok) {
            const results = await res.json()
            console.log(results)
            dispatch(fetchTicketingData())
            dispatch(fetchEventData())
            dispatch(openSnackbar(`Saved edit to ${playData?.title ?? 'event'}`))
        }
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
        </div>
    )
}



import { appSelector } from '../../app/hooks'
import { selectEventById } from '../events/eventsSlice'
export interface TicketSummaryProps {
    eventId: string,
    participant: string,
    concessions: boolean,
    showDate: Date
}

const TicketSummary = (props: TicketSummaryProps) => {
    console.log('event id:', props.eventId)
    const eventInfo = appSelector(state => selectEventById(state, props.eventId))
    if (!eventInfo) {
        return <p>No matching event</p>
    }
    
    const { name, description, date } = eventInfo
    return (
        <article>
            <h2>{name}</h2>
            <h4>{props.participant}</h4>
            <p>Concessions: {props.concessions ? 'Yes' : 'No'}</p>
            <p>{date.toDateString}</p>
            <p>{description}</p>
        </article>
    )
}

export default TicketSummary
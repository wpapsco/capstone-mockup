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
    
    // TODO: reformat show date and time
    const { playname, playdescription } = eventInfo
    return (
        <article>
            <h2>{playname}</h2>
            <h4>{props.participant}</h4>
            <p>Concessions: {props.concessions ? 'Yes' : 'No'}</p>
            {playdescription && <p>{playdescription}</p>}
        </article>
    )
}

export default TicketSummary
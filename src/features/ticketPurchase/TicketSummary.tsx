import { appSelector } from '../../app/hooks'
export interface TicketSummaryProps {
    eventId: string,
    participant: string,
    concessions: boolean,
    showDate: Date
}

const TicketSummary = (props: TicketSummaryProps) => {
    const event = appSelector(state => {
        const tickets = state.cart.items.filter(i=>i.type==='ticket')
    })
    
    return (
        <article>
            <h4>{props.participant}</h4>
            <p>Concessions: {props.concessions ? 'Yes' : 'No'}</p>
            <p>{props.showDate.toDateString}</p>
        </article>
    )
}

export default TicketSummary
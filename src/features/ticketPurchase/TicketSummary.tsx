import { Ticket } from '../cart/cartSlice'

const TicketSummary = (data: Ticket) => {
    return (
        <article>
            <h2>{data.eventName}</h2>
            <h4>{data.participantName}</h4>
            <p>Concessions: {data.concessions ? 'Yes' : 'No'}</p>
            <p>{data.datetime.toDateString}</p>
        </article>
    )
}

export default TicketSummary
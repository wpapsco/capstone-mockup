import { dateTimeFormatter } from '@material-ui/data-grid'
import { eventNames } from 'process'
import { appSelector, useAppDispatch } from '../../app/hooks'
import { selectContents, Ticket } from './cartSlice'

const Cart = () => {
    const contents = appSelector(selectContents)

    return (
        <div>
            <h1>Cart</h1>
            {contents.tickets.map(ticket => 
                <TicketCard
                    key={ticket.eventId.toString() + ticket.participantId.toString()}
                    {...ticket} />
            )}
        </div>
    )
}

export const TicketCard = (data: Ticket) => {
    return (
        <article>
            <h2>{data.eventName}</h2>
            <h4>{data.participantName}</h4>
            <p>Concessions: {data.concessions ? 'Yes' : 'No'}</p>
            <p>{data.datetime.toDateString}</p>
        </article>
    )
} 

export default Cart
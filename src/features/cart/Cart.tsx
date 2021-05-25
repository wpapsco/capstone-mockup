import { appSelector, useAppDispatch } from '../../app/hooks'
import { selectContents, Ticket, addTicket } from './cartSlice'

import Button from '@material-ui/core/Button';

const Cart = () => {
    const contents = appSelector(selectContents)

    const dispatch = useAppDispatch()

    const handleAddTicket = () => {
        const ticketData: Ticket = {
            eventName: 'Fundraiser',
            eventId: 1,
            participantId: 1,
            participantName: 'Jane Doe',
            concessions: true,
            datetime: new Date(Date.now())
        }

        dispatch(addTicket(ticketData))
    }

    return (
        <div>
            <h1>Cart</h1>
            {contents.tickets.map(ticket => 
                <TicketSummary
                    key={ticket.eventId.toString() + ticket.participantId.toString()}
                    {...ticket} />
            )}
            <Button
                variant='contained'
                color='primary'
                onClick={() => handleAddTicket()}>Add Ticket Test</Button>
        </div>
    )
}

export const TicketSummary = (data: Ticket) => {
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
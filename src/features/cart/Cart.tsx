import { appSelector, useAppDispatch } from '../../app/hooks'
import { selectContents, addTicket } from './cartSlice'

import Button from '@material-ui/core/Button';
import TicketSummary from '../ticketPurchase/TicketSummary'

const Cart = () => {
    const contents = appSelector(selectContents)
    const dispatch = useAppDispatch()

    const handleAddTicket = () => {
        const eventName = 'Fundraiser'
        const participantName = 'Jane Doe'
        const concessions = true

        dispatch(addTicket(
            eventName,
            participantName,
            concessions,
            new Date(Date.now())
        ))
    }

    return (
        <div>
            <h1>Cart</h1>
            {contents.tickets.map(ticket => 
                <TicketSummary
                    key={ticket.id}
                    {...ticket} />
            )}
            <Button
                variant='contained'
                color='primary'
                onClick={() => handleAddTicket()}>Add Ticket Test</Button>
        </div>
    )
}


export default Cart
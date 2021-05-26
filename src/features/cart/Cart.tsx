import { appSelector } from '../../app/hooks'
import { selectContents } from './cartSlice'

import TicketSummary from '../ticketPurchase/TicketSummary'

const Cart = () => {
    const contents = appSelector(selectContents)

    const numTickets = contents.tickets.length
    return (
        <div>
            <h2>Cart</h2>
            <h3>Tickets</h3>
            {numTickets===0 && <p>No tickets</p>}
            {numTickets > 0 &&
                contents.tickets.map(ticket => <TicketSummary key={ticket.id} {...ticket} /> )}
        </div>
    )
}


export default Cart
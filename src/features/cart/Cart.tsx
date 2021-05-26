import { appSelector } from '../../app/hooks'
import { selectItemsByType } from './cartSlice'
import { Ticket } from '../cart/cartSlice'

import TicketSummary from '../ticketPurchase/TicketSummary'

const Cart = () => {
    const tickets = appSelector((state, type='ticket') => selectItemsByType(state, type))
    const ticketItems = tickets.map(item => item.data as Ticket).map(ticket => {
        return (
            <TicketSummary  key={ticket.id}
                            eventId={ticket.id}
                            participant={ticket.participant}
                            concessions={ticket.concessions}
                            showDate={ticket.showDate} />
        )
    })

    return (
        <div>
            <h2>Cart</h2>
            <h3>Tickets</h3>
            {tickets.length>0 ? ticketItems : <p>No tickets</p>}
        </div>
    )
}


export default Cart
import {Ticket, Play, ticketingState} from './ticketingTypes'
import ticketReducer, {
    addTicketToCart,
    createCartItem,
} from './ticketingSlice'

const play: Play = {
    id: '1',
    title: 'Play 1',
    description: 'lorem ipsum donor',
    image_url: 'https://image'
}

const ticket: Ticket = {
    eventid: 1,
    playid: '1',
    admission_type: 'General Admission',
    eventdate: '2021-07-31',
    starttime: '19:00:00',
    ticket_price: 15.99,
    concession_price: 4.99,
    available: 34
}

const initialState: ticketingState = {
    cart: [],
    tickets: [ticket],
    plays: [play],
    status: 'idle',
}

const newCartItem = {
    product_id: ticket.eventid,
    qty: 1,
    name: 'Play 1 Ticket',
    desc: 'General Admission - Fri, Jul 30, 7:00 PM',
    product_img_url: 'https://image',
    price: 15.99,
}

describe('ticketing slice', () => {
    
    it('createCartItem', () => {
        expect(createCartItem({ticket, play, qty: 1}))
            .toEqual(newCartItem)
    })

    it('addTicketReducer', () => {
        const payload = {id: 1, qty: 1, concessions: false}
        const res = ticketReducer(initialState, addTicketToCart(payload))
        expect(res)
            .toEqual({
                ...initialState,
                cart: [newCartItem]
            })
    })
})
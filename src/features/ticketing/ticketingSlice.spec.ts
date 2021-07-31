import { RootState } from '../../app/store'
import { INITIAL_STATE as eventsInitState} from '../events/eventsSlice'
import {Ticket, Play, ticketingState} from './ticketingTypes'
import ticketReducer, {
    addTicketToCart,
    createCartItem,
    selectPlayData,
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
const ticket2: Ticket = {
    eventid: 2,
    playid: '1',
    admission_type: 'General Admission',
    eventdate: '2021-08-07',
    starttime: '16:00:00',
    ticket_price: 19.99,
    concession_price: 9.99,
    available: 20
}

const ticketingInitState: ticketingState = {
    cart: [],
    tickets: [ticket, ticket2],
    plays: [play],
    status: 'idle',
}

const ROOT_INIT_STATE: RootState = {
    events: eventsInitState,
    snackbar: {message: '', shown: false},
    ticketing: ticketingInitState
}


describe('ticketing slice', () => {
    const newCartItem = {
        product_id: ticket.eventid,
        qty: 1,
        name: 'Play 1 Ticket',
        desc: 'General Admission - Fri, Jul 30, 7:00 PM',
        product_img_url: 'https://image',
        price: 15.99,
    }

    it('createCartItem', () => {
        expect(createCartItem({ticket, play, qty: 1}))
            .toEqual(newCartItem)
    })

    it('addTicketReducer', () => {
        const payload = {id: 1, qty: 1, concessions: false}
        const res = ticketReducer(ticketingInitState, addTicketToCart(payload))
        expect(res)
            .toEqual({
                ...ticketingInitState,
                cart: [newCartItem]
            })
    })

    it('selectPlayData', () => {
        const playid = '1'
        expect(selectPlayData(ROOT_INIT_STATE, playid))
            .toEqual({
                title: 'Play 1',
                description: 'lorem ipsum donor',
                image_url: 'https://image',
                tickets: [{
                    eventid: 1,
                    playid: '1',
                    admission_type: 'General Admission',
                    ticket_price: 15.99,
                    concession_price: 4.99,
                    available: 34,
                    date: new Date('2021-07-31T19:00:00')
                },{
                    eventid: 2,
                    playid: '1',
                    admission_type: 'General Admission',
                    ticket_price: 19.99,
                    concession_price: 9.99,
                    available: 20,
                    date: new Date('2021-08-07T16:00:00')
                }]
            })
    })
})




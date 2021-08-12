import { RootState } from '../../app/store'
import { INITIAL_STATE as eventsInitState} from '../events/eventsSlice'
import ticketReducer, {
    addTicketToCart,
    editItemQty,
    selectPlayData,
    selectCartTicketCount,
    Ticket,
    Play,
    ticketingState
} from './ticketingSlice'
import { User } from '../../../server/server'

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
    date: new Date('2021-07-31T19:00:00'),
    ticket_price: 15.99,
    concession_price: 4.99,
    availableseats: 34
}
const ticket2: Ticket = {
    eventid: 2,
    playid: '1',
    admission_type: 'General Admission',
    date: new Date('2021-08-07T16:00:00'),
    ticket_price: 19.99,
    concession_price: 9.99,
    availableseats: 20
}

const ticketingInitState: ticketingState = {
    cart: [],
    tickets: {
        byId: {
            1: ticket,
            2: ticket2
        },
        allIds: [1,2]
    },
    plays: [play],
    status: 'idle',
}

const ROOT_INIT_STATE: RootState = {
    user: {username: 'user1', id: 1, is_superadmin: false},
    events: eventsInitState,
    snackbar: {message: '', shown: false},
    ticketing: ticketingInitState
}


describe('ticketing slice', () => {
    const newCartItem = {
        product_id: ticket.eventid,
        qty: 1,
        name: 'Play 1 Ticket',
        desc: 'General Admission - Sat, Jul 31 - 7:00 PM',
        product_img_url: 'https://image',
        price: 15.99,
    }

    const concessionsItem = {
        ...newCartItem,
        name: 'Play 1 Ticket + Concessions',
        price: newCartItem.price + ticket.concession_price,
        desc: newCartItem.desc + ' with concessions ticket'
    }

    describe('selectors', () => {
        it('selectCartTicketCount', () => {
            const init: RootState = {
                ...ROOT_INIT_STATE,
                ticketing: {
                    ...ROOT_INIT_STATE.ticketing,
                    cart: [{
                        product_id: 1,     // references state.tickets.eventid
                        qty: 2,
                        name: 'thing',
                        desc: 'desc1',
                        product_img_url: 'www.com',
                        price: 2.99,
                    },{
                        product_id: 2,     // references state.tickets.eventid
                        qty: 4,
                        name: 'thing2',
                        desc: 'desc2',
                        product_img_url: 'www.com',
                        price: 3.99,
                    }]
                }
            }
            expect(selectCartTicketCount(init))
                .toEqual({1: 2, 2: 4})
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
                        availableseats: 34,
                        date: new Date('2021-07-31T19:00:00')
                    },{
                        eventid: 2,
                        playid: '1',
                        admission_type: 'General Admission',
                        ticket_price: 19.99,
                        concession_price: 9.99,
                        availableseats: 20,
                        date: new Date('2021-08-07T16:00:00')
                    }]
                })
        })
    
        it('Date data is deserialized', () => {
            const playid = '1'
            const playData = selectPlayData(ROOT_INIT_STATE, playid)
            expect(playData!.tickets[0].date instanceof Date).toEqual(true)
        })
    })
    
    describe('reduers', () => {
        let init = ticketingInitState
        it('addTicketReducer: new ticket', () => {
            const payload = {id: 1, qty: 1, concessions: false}
            const res = ticketReducer(init, addTicketToCart(payload))
            expect(res)
                .toEqual({
                    ...ticketingInitState,
                    cart: [newCartItem]
                })
            init = res
        })

        it('addTicketReducer: exists in cart', () => {
            const payload = {id: 1, qty: 1, concessions: false}
            expect(ticketReducer(init, addTicketToCart(payload)))
                .toEqual({
                    ...init,
                    cart: [{...newCartItem, qty: 2}]
                })
        })

        it('addTicketReducer: in cart & add concessions', () => {
            const res = ticketReducer(init, addTicketToCart({id: 1, qty: 1, concessions: true}))
            expect(res).toEqual({...init, cart: [{...concessionsItem, qty: 2}]})
            init = res
        })

        it('addTicketReducer: in cart (w/ concession) & add w/o concessions', () => {
            const res = ticketReducer(init, addTicketToCart({id: 1, qty: 1, concessions: false}))
            expect(res).toEqual({...init, cart: [{...concessionsItem, qty: 3}]})
            init = res
        })

        // ticket 1 currently in cart
        it("editItemQty: can set qty = available", () => {
            expect(ticketReducer(init, editItemQty({id: 1, qty: ticket.availableseats})))
                .toEqual({...init, cart: [{...concessionsItem, qty: ticket.availableseats}]})
        })

        it("editItemQty: can't set qty > available", () => {
            expect(ticketReducer(init, editItemQty({id: 1, qty: ticket.availableseats + 1})))
                .toEqual({...init, cart: [{...concessionsItem, qty: 3}]})
        })

        it('editItemQty: item exists in cart', () => {
            const res = ticketReducer(init, editItemQty({id: 1, qty: 4}))
            expect(res)
                .toEqual({...init, cart: [{...concessionsItem, qty: 4}]})
            init = res
        })
            
        it('editItemQty: item not in cart', () => {
            expect(ticketReducer(init, editItemQty({id: 2, qty: 4})))
                .toEqual({...init})
        })

        it("editItemQty: can't set negative qty", () => {
            expect(ticketReducer(init, editItemQty({id: 1, qty: -1})))
                .toEqual({...init, cart: [{...concessionsItem, qty: 0}]})
        })

    })
})




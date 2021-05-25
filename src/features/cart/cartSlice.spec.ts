import cartReducer, {
    CartState,
    addTicket,
    Ticket
} from './cartSlice'

describe('counter reducer', () => {
    const initialState: CartState = {
        tickets: [],
        donation: null
    }

    it('should handle initial state', () => {
        expect(cartReducer(undefined, { type: 'unknown' }))
            .toEqual(initialState)
    });

    it('should handle add ticket', () => {
        let newTicket: Ticket = {
            eventName: 'Fundraiser',
            participantName: 'Jane Doe',
            concessions: true,
            datetime: new Date(Date.now()),
            id: ''
        }
        
        const newstate = cartReducer(
            initialState,
            addTicket('Fundraiser', 'Jane Doe', true, new Date(Date.now())))
        
        expect(newstate.tickets.length).toEqual(1)

        // Get auto generated ticket ID
        const id = newstate.tickets[0].id
        expect(newstate).toEqual({
            tickets: [{...newTicket, id}],
            donation: null
        })
    })
})
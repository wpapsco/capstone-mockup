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
        const newTicket: Ticket = {
            eventName: 'Fundraiser',
            eventId: 1,
            participantName: 'Jane Doe',
            concessions: true,
            datetime: new Date(Date.now())
        }

        expect(cartReducer(initialState, addTicket(newTicket)))
            .toEqual({
                tickets: [newTicket],
                donation: null
            })
    })
})
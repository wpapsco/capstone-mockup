import cartReducer, {
    ShopState,
    addTicket,
    editQty,
    removeItem,
} from './cartSlice'

describe('Cart reducer', () => {
    const initialState: ShopState = {
        cart: [],
        donation: 0,
    }

    it('should handle initial state', () => {
        const result = cartReducer(undefined, { type: 'unknown' })
        expect(result).toEqual(initialState)
    });

    const playid = 'play1'
    const addTicketResult = {
        cart: [{
            id: playid,
            type: 'ticket',
            name: 'Ticket(s)',
            description: 'General admission',
            unitPrice: 15.99,
            qty: 1,
            concessions: true,
        }],
        donation: 0
    }
    
    it('should handle adding an ticket', () => {
        expect(
            cartReducer(initialState, addTicket({
                eventId: 'play1',
                concessions: true
            }))
        ).toEqual(addTicketResult)
    })

    it('should handle editing item quantity', () => {
        const newQty = 3
        expect(cartReducer(
            addTicketResult,
            editQty({id: playid, qty: newQty})
        )).toEqual({
            cart: [{
                id: playid,
                type: 'ticket',
                name: 'Ticket(s)',
                description: 'General admission',
                unitPrice: 15.99,
                qty: newQty,
                concessions: true,
            }],
            donation: 0
        })
    })

    it('should handle removing an item', () => {
        expect(cartReducer(addTicketResult, removeItem(playid)))
            .toEqual(initialState)
    })})
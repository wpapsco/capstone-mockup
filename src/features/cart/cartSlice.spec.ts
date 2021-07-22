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

    const playId = 1
    const eventId = 2
    const addTicketResult = {
        cart: [{
            playId: playId,
            id: eventId,
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
                playId,
                eventId,
                concessions: true,
                qty: 1,
            }))
        ).toEqual(addTicketResult)
    })

    it('should handle editing item quantity', () => {
        const newQty = 3
        expect(cartReducer(
            addTicketResult,
            editQty({id: playId, qty: newQty})
        )).toEqual({
            cart: [{
                id: playId,
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

    it('shnould not be able to set negative quantities', () => {
        expect(cartReducer(
            addTicketResult,
            editQty({id: playId, qty: -1})
        )).toEqual({
            cart: [{
                id: playId,
                type: 'ticket',
                name: 'Ticket(s)',
                description: 'General admission',
                unitPrice: 15.99,
                qty: 0,
                concessions: true,
            }],
            donation: 0
        })
    })

    it('should handle removing an item', () => {
        expect(cartReducer(addTicketResult, removeItem(playId)))
            .toEqual(initialState)
    })})
import { nanoid } from '@reduxjs/toolkit';
import cartReducer, {
    CartState,
    addTicket,
    TicketData,
} from './cartSlice'

describe('counter reducer', () => {
    const initialState: CartState = {
        items: [],
        status: 'pending'
    }

    it('should handle initial state', () => {
        expect(cartReducer(undefined, { type: 'unknown' }))
            .toEqual(initialState)
    });

    it('should handle add ticket', () => {
        console.log('Needs to be updated')
    //     const newstate = cartReducer(
    //         initialState,
    //         addTicket({
    //             eventId: nanoid(),
    //             participant: 'Jane Doe',
    //             unitPrice: 7.99,
    //             showDate: new Date(Date.now()),
    //             concessions: true,
    //             id:''
    //         })
    //     )
        
    //     expect(newstate.items.length).toEqual(1)
    //     // TODO: Check correctness of state contents
    })
})
import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface CartState {
    items: CartItem<TicketData>[],
    status: 'pending' | 'loading' | 'failed' | 'success',
}

const initialState: CartState = {
    items: [],
    status: 'pending',
}

// also other stuff that might be shared between cart items like name, description, etc
export interface CartItem<T extends TicketData> {
    id: string,
    name: string,
    description: string,
    unitPrice: number,
    quantity: number,
    itemData: T,
}
type CartItemProps = { unitPrice: number, quantity: number, description: string, name: string }

// TODO: Donation (donor name, message) & discount (discount code) cart item types
// TODO: Should concessions be a prop of TicketData or a separate Cart Item type?
export interface TicketData {
    id: string,
    eventId: string,
    participant: string,
    concessions: boolean,
    showDate: Date
}


const cartSlice = createSlice({
    name: 'cart',
    initialState, 
    reducers: {
        addTicket: {
            reducer(
                state,
                action: PayloadAction<TicketData, string, CartItemProps>
            ) {
                const newItem: CartItem<TicketData> = {
                    id: nanoid(),
                    ...action.meta,
                    itemData: { ...action.payload },
                }
                state.items.push(newItem)
            },
            prepare(payload: TicketData, cartData: CartItemProps) {
                const newTicket: TicketData = {...payload, id: nanoid() }
                return { payload: newTicket, meta: cartData }
            }
        }
    },
        // removeTicket: (state, action: PayloadAction<string>) => {
        //     const qry = action.payload
        //     const ticketIndex = state.tickets.findIndex(t => t.id === qry)
        //     console.log('ticket index', ticketIndex)
        //     console.log('pre splice', state.tickets)

        //     if (ticketIndex > 0) {
        //         state.tickets.splice(ticketIndex, 1)
        //         console.log('post splice', state.tickets)
        //     }
        // },
        // editTicket: (state) => {
        //     console.log('not yet implemented')
        // }
})

export const { addTicket } = cartSlice.actions

export const selectCartItems = (state: RootState) => state.cart.items

export default cartSlice.reducer

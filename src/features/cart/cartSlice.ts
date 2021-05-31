import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface CartState<T extends Ticket | Donation | Discount> {
    items: CartItem<T>[],
    status: 'pending' | 'loading' | 'failed' | 'success',
}

const initialState: CartState<Ticket | Donation | Discount> = {
    items: [],
    status: 'pending',
}

type CartItemType = 'donation' | 'discount' | 'ticket'
export interface CartItem<T extends Ticket | Donation | Discount> {
    id: string,
    type: CartItemType,
    data: T,
    unitPrice: number
    // also other stuff that might be shared between cart items like name, description, etc etc
}

// TODO: define interface for Play/Event
export interface Ticket {
    id: string,
    eventId: string,
    participant: string,
    concessions: boolean,
    showDate: Date
}

export interface Donation {
    donor: string,
    message: string
}

export interface Discount {
    discountCode: string,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState, 
    reducers: {
        addTicket: {
            reducer(
                state,
                action: PayloadAction<Ticket, string, { unitPrice: number } >
            ) {
                const newItem: CartItem<Ticket> = {
                    id: nanoid(),
                    type: 'ticket',
                    data: { ...action.payload },
                    unitPrice: action.meta.unitPrice
                }
                state.items.push(newItem)
            },
            prepare(payload: Ticket, unitPrice: number) {
                const newTicket: Ticket = {...payload, id: nanoid() }
                return { payload: newTicket, meta: { unitPrice } }
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

export const selectContents = (state: RootState) => state.cart
export const selectItemsByType = (state: RootState, type: string) => state.cart.items.filter(i=>i.type===type)

export default cartSlice.reducer

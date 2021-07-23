import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

// TODO: Load products thunk

export interface CartItem {
    id: number,
    name: string,
    description: string,
    unitPrice: number,
    qty: number,
    type: string,        //TODO: 'ticket' | 'seasonPackage' | '
}

// TODO: Donation type (donor name, message)
// TODO: Discount code
// TODO: Auto-apply misc. fees (ex: tax)
// TODO: Should concessions be a prop of TicketData or a separate Cart Item type?
export interface TicketItem extends CartItem {
    type: 'ticket',
    playId: number,
    concessions: boolean,
}

export interface ShopState {
    cart: CartItem[],
    donation: number,
}

const INITIAL_STATE: ShopState = {
    cart: [], // { itemId, name, desc, unitPrice, qty }
    donation: 0,  // { custId, message, amount, date }
}

type SHOWID = number

const cartSlice = createSlice({
    name: 'cart',
    initialState: INITIAL_STATE, 
    reducers: {
        // TODO: prevent duplicating the same item (subsequent addTicket actions w/ matching
        // item ID should add the new quantity to the current one)
        addTicket: (state, action: PayloadAction<{
            playId: number,
            eventId: SHOWID,
            concessions: boolean,
            qty: number,
        }>) => {
            const {playId, eventId, concessions, qty} = action.payload
            return {
                ...state,
                cart: [
                    ...state.cart,
                    {
                        id: eventId,
                        type: 'ticket',
                        name: 'Ticket(s)',
                        description: 'General admission',
                        unitPrice: 15.99,
                        qty,
                        concessions,
                        playId,
                    } as TicketItem
                ]
            }
        },
        addItem: (state, action: PayloadAction<Omit<CartItem,'id'|'type'|'unitPrice'>>) => {
            const newItem: CartItem = {
                ...action.payload,
                id: 1,
                type: 'ticket',
                unitPrice: 12.99,
            }
            return {
                ...state,
                contents: [...state.cart, newItem]
            }
        },
        removeItem: (state, action: PayloadAction<SHOWID>) => ({
            ...state,
            cart: state.cart.filter(item => item.id!==action.payload)
        }),
        editQty: (state, action: PayloadAction<{id: number, qty: number}>): ShopState => {
            const newQty = (action.payload.qty >= 0) ? action.payload.qty : 0
            return {
                ...state,
                cart: state.cart.map(item => {
                    return (item.id === action.payload.id) ?
                       {...item, qty: newQty} :
                       item
                })
            }
        },
        setDonation: (state, action: PayloadAction<number>) => {
            return { ...state, donation: action.payload }
        }
    },
})

// Actions
export const { addTicket, addItem, removeItem, editQty, setDonation } = cartSlice.actions

// Selectors
export const selectCartContents = (state: RootState) => state.shop.cart
export const selectDonation = (state: RootState) => state.shop.donation

export default cartSlice.reducer

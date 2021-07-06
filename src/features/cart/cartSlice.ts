import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

// TODO: Load products thunk

export interface CartItem {
    id: string,
    name: string,
    description: string,
    unitPrice: number,
    qty: number,
}

// TODO: Donation type (donor name, message)
// TODO: Discount code
// TODO: Auto-apply misc. fees (ex: tax)
// TODO: Should concessions be a prop of TicketData or a separate Cart Item type?
export interface TicketItem extends CartItem {
    eventId: string,
    concessions: boolean,
    // showing: Date,
}

export interface ShopState {
    cart: CartItem[],
    donation: number,
}

const INITIAL_STATE: ShopState = {
    cart: [], // { itemId, name, desc, unitPrice, qty }
    donation: 0,  // { custId, message, amount, date }
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: INITIAL_STATE, 
    reducers: {
        addItem: (
            state,
            action: PayloadAction<Omit<TicketItem, 'id' | 'unitPrice'>>
        ) => {
            const newItem: CartItem = {
                ...action.payload,
                id: nanoid(),
                unitPrice: 12.99,
            }
            return {
                ...state,
                contents: [...state.cart, newItem]
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            return state
        },
        editQty: (state, action: PayloadAction<{id: string, qty: number}>) => {
            return state
        },
        setDonation: (state, action: PayloadAction<number>) => {
            return { ...state, donation: action.payload }
        }
    },
})

// Actions
export const { addItem, removeItem, editQty, setDonation } = cartSlice.actions

// Selectors
export const selectCartContents = (state: RootState) => state.shop.cart
export const selectDonation = (state: RootState) => state.shop.donation

export default cartSlice.reducer

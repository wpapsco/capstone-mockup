import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface CartItem {
    id: string,
    name: string,
    description: string,
    unitPrice: number,
    quantity: number,
}

// TODO: Donation (donor name, message) & discount (discount code) cart item types
// TODO: Should concessions be a prop of TicketData or a separate Cart Item type?
export interface TicketItem extends CartItem {
    eventId: string,
    // showing: Date,
    concessions: boolean,
}

export interface CartState {
    items: CartItem[],
    donation: number
}

const initialState: CartState = {
    items: [],
    donation: 0
}

type CartItemProps = { unitPrice: number, quantity: number, description: string, name: string }

const cartSlice = createSlice({
    name: 'cart',
    initialState, 
    reducers: {
        addTicket: (
            state,
            action: PayloadAction<Omit<TicketItem, 'id' | 'unitPrice'>>
        ) => {
            const newItem: CartItem = {
                ...action.payload,
                id: nanoid(),
                unitPrice: 12.99,
            }
            state.items.push(newItem)
        },
        setDonation: (state, action: PayloadAction<number>) => {
            return { ...state, donation: action.payload }
        }
    },
})

// Actions
export const { addTicket, setDonation } = cartSlice.actions

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectDonation = (state: RootState) => state.cart.donation

export default cartSlice.reducer

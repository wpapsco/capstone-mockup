import { createSlice, createAsyncThunk, PayloadAction, CaseReducer } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { CartItem, Play, Ticket, ticketingState } from './ticketingTypes'
import { titleCase } from '../../utils'

const fetchData = async (url: string) => {
    try {
        const res = await fetch(url)
        return await res.json()
    }
    catch(err) {
        console.error(err.message)
    }
}

const capitalizeTitles = (ticket: Ticket) => ({...ticket, event_title: titleCase(ticket.event_title)})
// TODO: sort by date
export const fetchTicketingData = createAsyncThunk(
    'events/fetch',
    async () => {
        const plays: Play[] = await fetchData('/api/plays')
        const tickets: Ticket[] = await fetchData('/api/tickets')
        return {plays, tickets: tickets.map(capitalizeTitles)}
    }
)

const someInList = <T>(list: Array<T>, prop: keyof T) => (value: T[keyof T]) =>
    list.some(i => i[prop]===value)

const selectTicketReducer = (state: ticketingState, action: PayloadAction<number>) => {
    const idInTickets = someInList(state.tickets, 'eventid')
    return {
        ...state,
        selection: {
            ...state.selection,
            selectedTicket: (idInTickets(action.payload))
                ? action.payload
                : null
        }
    }
}

// TODO: Don't allow more than available
const setQtyReducer = (state: ticketingState, action: PayloadAction<number>) => ({
    ...state,
    selection: {...state.selection, qty: (action.payload > 0) ? action.payload : 0}
})


const byEventId = (id: number) => (obj: Ticket) => obj.eventid===id

const applyConcession = (c_price: number) => (item: CartItem) => {
    const name = item.name + ' + Concessions'
    const price = c_price + item.price
    const desc = `${item.desc} with concessions ticket`
    return ({...item, name, price, desc})
}

const makeTicketDesc = (t: Ticket) => `${t.admission_type} - ${t.eventdate}, ${t.starttime}`

const toPartialCartItem = (t: Ticket) => ({
    product_id: t.eventid,
    name: t.event_title + ' ticket(s)',
    price: t.ticket_price,
    desc: makeTicketDesc(t),
})

const addTicketReducer: CaseReducer<ticketingState, PayloadAction<{
    id: number,
    qty: number,
    concessions: boolean
}>> = (state, action) => {
    const idInTickets = someInList(state.tickets, 'eventid')
    const ticketData = (idInTickets(action.payload.id))
        ? state.tickets.find(byEventId(action.payload.id))
        : null
    
    if (ticketData===null || ticketData===undefined) {
        return state
    }
    else {
        const addConcession = applyConcession(ticketData.concession_price)
        const newCartItem = {
            ...toPartialCartItem(ticketData),
            qty: action.payload.qty,
            product_img_url: state.plays.find(p => p.id===ticketData.playid)!.image_url,
        }

        return {
            ...state,
            cart: (action.payload.concessions)
                ? [...state.cart, addConcession(newCartItem)]
                : [...state.cart, newCartItem]
        }
    }
}

const editQtyReducer: CaseReducer<ticketingState, PayloadAction<{id: number, qty: number}>> =
    (state, action) => ({
        ...state,
        cart: state.cart.map(item => (item.product_id===action.payload.id)
            ? {
                ...item,
                qty: (action.payload.qty > 0)
                    ? action.payload.qty
                    : 0
            }
            : item
        )
    })

const INITIAL_STATE: ticketingState = {
    cart: [],
    tickets: [],
    plays: [],
    status: 'idle',
    selection: {
        selectedTicket: null,
    }
}

const ticketingSlice = createSlice({
    name: 'cart',
    initialState: INITIAL_STATE,
    reducers: {
        addTicketToCart: addTicketReducer,
        editItemQty: editQtyReducer,
        removeTicketFromCart: (state, action: PayloadAction<number>) => ({
            ...state,
            cart: state.cart.filter(item => item.product_id!==action.payload)
        }),
        selectTicket: selectTicketReducer,
        setQty: setQtyReducer,
        clearSelection: (state) => ({ ...state, selection: {selectedTicket: null}})
    },
    extraReducers: builder => {
        builder
            .addCase(fetchTicketingData.pending, state => {
                state.status = 'loading'
            })
            .addCase(fetchTicketingData.fulfilled, (state, action) => {
                state.status = 'success'
                state.tickets = (action.payload.tickets)
                    ? action.payload.tickets
                    : []
                state.plays = (action.payload.plays)
                    ? action.payload.plays
                    : []
            })
            .addCase(fetchTicketingData.rejected, state => {
                state.status = 'failed'
            })
    }
})

export const selectSelectedTicket = (state: RootState) => state.ticketing.selection.selectedTicket
export const selectCartContents = (state: RootState): CartItem[] => state.ticketing.cart
export const { addTicketToCart, editItemQty, selectTicket, clearSelection, removeTicketFromCart } = ticketingSlice.actions
export default ticketingSlice.reducer
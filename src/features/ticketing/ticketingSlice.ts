import { createSlice, createAsyncThunk, PayloadAction, CaseReducer } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import format from "date-fns/format";
import { bound, titleCase } from '../../utils'

export interface CartItem {
    product_id: number,     // references state.tickets.eventid
    qty: number,
    name: string,
    desc: string,
    product_img_url: string,
    price: number,
}

export interface Ticket {
    eventid: number,             // references showtime.id in database
    playid: string,
    admission_type: 'General Admission',
    date: Date,
    ticket_price: number,
    concession_price: number,
    totalseats?: number,
    availableseats: number,
}

export interface Play {
    id: string,
    title: string,
    description: string,
    image_url: string,
}

type TicketsState = {byId: {[key: number]: Ticket}, allIds: number[]}
export type LoadStatus = 'idle' | 'loading' | 'success' | 'failed'
export interface ticketingState {
    cart: CartItem[],
    tickets: TicketsState,
    plays: Play[],
    status: LoadStatus,
}


const fetchData = async (url: string) => {
    try {
        const res = await fetch(url)
        return await res.json()
    }
    catch(err) {
        console.error(err.message)
    }
}

export const fetchTicketingData = createAsyncThunk(
    'ticketing/fetch',
    async () => {
        const plays: Play[] = await fetchData('/api/plays')
        const ticketRes: TicketsState = await fetchData('/api/tickets')
        const tickets = Object.entries(ticketRes.byId)
            .reduce((res, [key, val]) => ({...res, [key]: {...val, date: new Date(val.date)}}), {})
        return {plays, tickets: {byId: tickets, allIds: ticketRes.allIds}}
    }
)


export const toPartialCartItem = <T extends Ticket>(ticketLike: T) => ({
    product_id: ticketLike.eventid,
    price: ticketLike.ticket_price,
    desc: `${ticketLike.admission_type} - ${format(ticketLike.date, 'eee, MMM dd - h:mm a')}`,
})

const appendCartField = <T extends CartItem>(key: keyof T, val: T[typeof key]) => (obj: any) => ({...obj, [key]: val})

export const createCartItem = (data: {ticket: Ticket, play: Play, qty: number}): CartItem =>
    [data.ticket].map(toPartialCartItem)
        .map(appendCartField('name', `${titleCase(data.play.title)} Ticket${(data.qty>1) ? 's' : ''}`))
        .map(appendCartField('qty', data.qty))
        .map(appendCartField('product_img_url', data.play.image_url))[0]

type PlayId = string
const isTicket = (obj: any): obj is Ticket => Object.keys(obj).some(k => k==='eventid')
const isCartItem = (obj: any): obj is CartItem => Object.keys(obj).some(k => k==='product_id')

const byId = (id: number|PlayId) => (obj: Ticket|Play|CartItem) =>
    (isTicket(obj))
        ? obj.eventid===id
        : isCartItem(obj)
            ? obj.product_id===id
            : obj.id===id


const hasConcessions = (item: CartItem) => item.name.includes('Concessions')
const applyConcession = (c_price: number, item: CartItem) => (hasConcessions(item)) ? item
    : {
        ...item,
        name: item.name + ' + Concessions',
        price: c_price + item.price,
        desc: `${item.desc} with concessions ticket`
    }


interface ItemData {id: number, qty: number, concessions?: number}
const updateCartItem = (cart: CartItem[], {id, qty, concessions}: ItemData) =>
    cart.map(item => (item.product_id===id)
        ? (concessions)
            ? applyConcession(concessions, {...item, qty})
            : {...item, qty}
        : item
    )

const addTicketReducer: CaseReducer<ticketingState, PayloadAction<{ id: number, qty: number, concessions: boolean }>> = (state, action) => {
    const {id, qty, concessions} = action.payload
    const tickets = state.tickets
    
    if (!tickets.allIds.includes(id)) return state
    
    const ticket = tickets.byId[id]
    const inCart = state.cart.find(byId(id))
    const validRange = bound(0, ticket.availableseats)

    if (inCart) {
        return {
            ...state,
            cart: updateCartItem(state.cart, {
                id,
                qty: validRange(qty+inCart.qty),
                concessions: concessions ? ticket.concession_price : undefined
            })
        }
    }
    else {
        const play = state.plays.find(byId(ticket.playid))
        const newCartItem = play ? createCartItem({ticket, play, qty}) : null
        return newCartItem
            ? {
                ...state,
                cart: (concessions)
                        ? [...state.cart, applyConcession(ticket.concession_price, newCartItem)]
                        : [...state.cart, newCartItem]
            }
            : state
    }
}

// Do not update state if 1) ticket doesn't exist, 2) try to set more than available
const editQtyReducer: CaseReducer<ticketingState, PayloadAction<{id: number, qty: number}>> = (state, action) => {
    const {id, qty} = action.payload
    if (!state.tickets.allIds.includes(id)) return state
    const avail = state.tickets.byId[id].availableseats
    const validRange = bound(0, state.tickets.byId[id].availableseats)

    return (qty <= avail)
        ? {...state, cart: updateCartItem(state.cart, {id, qty: validRange(qty)})}
        : state
}

export const INITIAL_STATE: ticketingState = {
    cart: [],
    tickets: {byId: {}, allIds: []},
    plays: [],
    status: 'idle',
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
        removeAllTicketsFromCart: (state) => ({
            ...state,
            cart: []
        })
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
                    : {byId: {}, allIds: []}
                state.plays = (action.payload.plays)
                    ? action.payload.plays
                    : []
            })
            .addCase(fetchTicketingData.rejected, state => {
                state.status = 'failed'
            })
    }
})

export const selectCartSubtotal = (state: RootState): number => state.ticketing.cart.reduce((tot, item) => tot + (item.price * item.qty), 0)
export const selectCartIds = (state: RootState): number[] => state.ticketing.cart.map(i => i.product_id)
export const selectCartItem = (state: RootState, id: number): CartItem|undefined => state.ticketing.cart.find(i => i.product_id===id)
export const selectCartTicketCount = (state: RootState): {[key: number]: number} =>
    state.ticketing.cart.reduce(
        (acc, item) => {
            const key = item.product_id
            if (key in acc) {
                return acc
            } else {
                return {...acc, [key]: item.qty}
            }
        }
        ,{}
    )
export const selectNumInCart = (state: RootState) => state.ticketing.cart.length
export const selectCartContents = (state: RootState): CartItem[] => state.ticketing.cart
export interface EventPageData {
    title: string,
    description: string,
    image_url: string,
    tickets: Ticket[],
}
export const selectPlayData = (state: RootState, playId: PlayId): EventPageData|undefined => {
    const ticketData = state.ticketing.tickets
    const play = state.ticketing.plays.find(byId(playId))
    if (play) {
        const {id, ...playData} = play
        const tickets = state.ticketing.tickets.allIds
            .reduce((filtered, id) => {
                return (ticketData.byId[id].playid===playId)
                    ? [...filtered, ticketData.byId[id]]
                    : filtered
            }, [] as Ticket[])
        return {...playData, tickets}
    }
    else {
        return undefined
    }
}

export const selectNumAvailable = (state: RootState, ticketid: number) => {
    const ticket = state.ticketing.tickets.byId[ticketid]
    return (ticket)
        ? ticket.availableseats
        : ticket
}

export const { addTicketToCart, editItemQty, removeTicketFromCart, removeAllTicketsFromCart } = ticketingSlice.actions
export default ticketingSlice.reducer

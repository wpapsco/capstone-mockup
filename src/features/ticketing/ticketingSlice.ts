import { createSlice, createAsyncThunk, PayloadAction, CaseReducer } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import format from "date-fns/format";
import { titleCase } from '../../utils'

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
    availableseats: number,
}

export interface Play {
    id: string,
    title: string,
    description: string,
    image_url: string,
    tickets: number[],
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
        const tickets: TicketsState = await fetchData('/api/tickets')
        return {plays, tickets}
    }
)


const applyConcession = (c_price: number, item: CartItem) => {
    const name = item.name + ' + Concessions'
    const price = c_price + item.price
    const desc = `${item.desc} with concessions ticket`
    return ({...item, name, price, desc})
}

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const toCivilian = (n: number) => (n > 12) ? n - 12 : n
const formatDate = (d: Date) => {
    const date = new Date(d)
    const hr = date.getHours()
    date.setHours(toCivilian(hr))
    return `${DAYS[date.getDay()]}, ${format(date, 'MMM d, H:mm')} ${hr > 12 ? 'PM' : 'AM'}`
}
export const toPartialCartItem = (t: Ticket) => ({
    product_id: t.eventid,
    price: t.ticket_price,
    desc: `${t.admission_type} - ${formatDate(t.date)}`,
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

/*
- check it ticket is already in cart
Y: Update matching cart item qty:
    -- check (action.qty + item.qty) < tickets.byId[ticketid]
    -- > 
N: Create new cart item

*/

const addTicketReducer: CaseReducer<ticketingState, PayloadAction<{ id: number, qty: number, concessions: boolean }>> = (state, action) => {
    const {id, qty, concessions} = action.payload
    const fromCart = state.cart.find(byId(id))
    const ticket = state.tickets.byId[id]

    // already in cart
    if (fromCart && ticket) {
        const updatedItem = {...fromCart, qty: fromCart.qty + qty}
        return {
            ...state,
            cart: state.cart.map(i => (byId(id)(i))
                // NOTE: this will change the item type to one with concessions!
                ? (concessions && !hasConcessions(fromCart))
                    ? applyConcession(ticket.concession_price, updatedItem)
                    : updatedItem
                : fromCart
            )
        }
    } else {
        const play = ticket ? state.plays.find(byId(ticket.playid)) : null
        const newCartItem = (ticket && play)
            ? createCartItem({ticket, play, qty})
            : null
            
        return (ticket && newCartItem)
            ? {
                ...state,
                cart: (concessions)
                        ? [...state.cart, applyConcession(ticket.concession_price, newCartItem)]
                        : [...state.cart, newCartItem]
            }
            : state
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
/* Returns play data with shape: {
    title, description, image_url,
    tickets: [{
        eventid,
        playid,
        admission_type,
        date: Date
        ticket_price: number,
        concession_price: number,
        available: number,
    }]
} */
export const selectPlayData = (state: RootState, playId: PlayId) => {
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
            .map(t => ({...t, date: new Date(t.date)}))
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

export const { addTicketToCart, editItemQty, removeTicketFromCart } = ticketingSlice.actions
export default ticketingSlice.reducer

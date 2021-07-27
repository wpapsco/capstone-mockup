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

const createTitleMap = (plays: Play[]) =>
    plays.reduce((titleMap, play) => {
        const key = play.id
        return (titleMap[key])
            ? {...titleMap}
            : {...titleMap, [key]: play.title}
    }, {} as {[index:string] : string})

const addPlayTitles = (titleMap: any) => (ticket: Ticket): Ticket => ({
    ...ticket,
    event_title: (titleMap[ticket.playid])
        ? titleCase(titleMap[ticket.playid])
        : 'Play'
})

// TODO: sort by date
export const fetchTicketingData = createAsyncThunk(
    'events/fetch',
    async () => {
        const plays: Play[] = await fetchData('/api/plays')
        const titleMap = createTitleMap(plays)
        const appendTitles = addPlayTitles(titleMap)
        const ticketdata: Ticket[] = await fetchData('/api/tickets')

        return { plays, tickets: ticketdata.map(appendTitles)}
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
const sumMoneyStrings = (moneyStrings: string[]) =>
    moneyStrings
        .map(s => s.slice(1))
        .map(s => Number.parseFloat(s))
        .reduce((tot, n) => tot + n, 0)
        .toString()

const addConcessionPrice = (t: {ticket_price: string, concession_price: string}) =>
    sumMoneyStrings([t.ticket_price, t.concession_price])

const makeTicketDesc = (t: Ticket, boughtConcession: boolean) =>
    `${t.admission_type} ${boughtConcession && '+ concessions'}
    ${t.eventdate} @ ${t.starttime}`

const addTicketReducer: CaseReducer<ticketingState, PayloadAction<{
    id: number,
    qty: number,
    concessions: boolean
}>> = (state, action) => {
    const idInTickets = someInList(state.tickets, 'eventid')
    const ticketData = (idInTickets(action.payload.id))
        ? state.tickets.find(byEventId(action.payload.id))
        : null

    const newCartItem = (ticketData)
        ? {
            product_id: ticketData.eventid,
            name: ticketData.event_title + ' ticket(s)',
            price: (action.payload.concessions)
                ? addConcessionPrice(ticketData)
                : ticketData.ticket_price,
            desc: makeTicketDesc(ticketData, action.payload.concessions),
            qty: action.payload.qty,
            product_img_url: state.plays.find(p => p.id===ticketData.playid)!.image_url,
        }
        : null
    
    return {
        ...state,
        cart: (newCartItem) ? [...state.cart, newCartItem] : [...state.cart]
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
        qty: '',
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
        clearSelection: (state) => ({ ...state, selection: {selectedTicket: null, qty: ''}})
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
export const selectTicketQty = (state: RootState) => state.ticketing.selection.qty
export const selectCartContents = (state: RootState): CartItem[] => state.ticketing.cart
export const { addTicketToCart, selectTicket, clearSelection, setQty, editItemQty, removeTicketFromCart } = ticketingSlice.actions
export default ticketingSlice.reducer
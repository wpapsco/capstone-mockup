export interface CartItem {
    product_id: string,     // references state.tickets[event_id]
    qty: number,
    name: string,
    desc: string,
    product_url: string,
}

export interface Ticket {
    event_id: string,
    desc: 'general admission'
    ticket_price: number,
    concession_price?: number,
}

export interface Event {
    id: string,
    title: string,
    desc: string,
    date: string,
    time: string,
    day: string,
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'failed'
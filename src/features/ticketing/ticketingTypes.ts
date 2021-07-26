export interface CartItem {
    product_id: number,     // references state.tickets[event_id]
    qty: number,
    name: string,
    desc: string,
    product_url: string,
}

export interface Ticket {
    number: string,
    event_title: string,
    desc: string,
    eventdate: string,
    starttime: string,
    ticket_price: number,
    concession_price?: number,
    available: number,
}

export interface Play {
    id: number,
    title: string,
    description: string,
    image_url: string,
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'failed'
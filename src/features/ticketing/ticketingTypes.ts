export interface CartItem {
    product_id: number,     // references state.tickets.eventid
    qty: number,
    name: string,
    desc: string,
    product_url: string,
}

export interface Ticket {
    eventid: number,             // references showtime.id in database
    playid: string,
    event_title: string,
    desc: string,
    eventdate: string,
    starttime: string,
    ticket_price: string,
    concession_price: string,
    available: number,
}

export interface Play {
    id: string,
    title: string,
    description: string,
    image_url: string,
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'failed'
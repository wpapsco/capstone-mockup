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
    available: number,
}

export interface Play {
    id: string,
    title: string,
    description: string,
    image_url: string,
}

export interface ticketingState {
    cart: CartItem[],
    tickets: Ticket[],
    plays: Play[],
    status: LoadStatus,
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'failed'
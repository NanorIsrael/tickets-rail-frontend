export type TicketTypes = {
    id: number,
    label: string,
    price_display: string,
    price: number,
    available: number
}

export type Ticket = {
    slug: string,
    title: string,
    starts_at: string,
    venue_name: string,
    amount: number,
    category: { id: string, slug: string, name: string },
    ticket_types: TicketTypes[]
}

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/orders/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <OrdersListPage />
}
import React, { useMemo, useState } from 'react';
import {
    Calendar,
    MapPin,
    ChevronDown,
    ChevronUp,
    Search,
    CreditCard,
    Ticket as TicketIcon,
} from 'lucide-react';

// ---------- Types ----------

type OrderStatus = 'paid' | 'pending' | 'cancelled' | 'refunded' | 'failed';
type TicketStatus = 'valid' | 'used' | 'void' | 'refunded';
type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
type SalesChannel = 'partner' | 'online' | 'box_office' | 'app';

interface EventInfo {
    slug: string;
    title: string;
    starts_at: string; // ISO date string
    venue_name: string;
    venue_address: string | null;
    cover_image: string | null;
}

interface TicketInstance {
    code: string;
    status: TicketStatus;
    seat_number: string | null;
    seat_label: string | null;
}

interface OrderItem {
    ticket_type: string;
    quantity: number;
    unit_price: number;
    unit_price_display: string;
    tickets: TicketInstance[];
}

interface TotalsDisplay {
    subtotal: string;
    fee: string;
    total: string;
}

interface PaymentInfo {
    status: PaymentStatus;
    gateway: string;
}

interface Order {
    reference: string;
    status: OrderStatus;
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    sales_channel: SalesChannel;
    subtotal: number;
    fee: number;
    total: number;
    currency: string;
    totals_display: TotalsDisplay;
    event: EventInfo;
    items: OrderItem[];
    payment: PaymentInfo;
}

// ---------- Mock data ----------

const mockOrders: Order[] = [
    {
        reference: 'MTKVKECKWIKX',
        status: 'paid',
        buyer_name: 'israel teye',
        buyer_email: 'iteye074@gmail.com',
        buyer_phone: '0244925195',
        sales_channel: 'partner',
        subtotal: 20,
        fee: 1,
        total: 21,
        currency: 'GHS',
        totals_display: {
            subtotal: 'GH₵ 0.20',
            fee: 'GH₵ 0.01',
            total: 'GH₵ 0.21',
        },
        event: {
            slug: 'the-mega-band-concert',
            title: 'The Mega Band Concert',
            starts_at: '2026-08-08T09:27:00+00:00',
            venue_name: 'GV Events',
            venue_address: null,
            cover_image: null,
        },
        items: [
            {
                ticket_type: 'Diamond',
                quantity: 1,
                unit_price: 20,
                unit_price_display: 'GH₵ 0.20',
                tickets: [{ code: 'A5WN-TKLL', status: 'valid', seat_number: null, seat_label: null }],
            },
        ],
        payment: { status: 'completed', gateway: 'mojopay' },
    },
    {
        reference: 'XJ29PLQMNZKA',
        status: 'pending',
        buyer_name: 'Ama Boateng',
        buyer_email: 'ama.boateng@example.com',
        buyer_phone: '0201234567',
        sales_channel: 'online',
        subtotal: 350,
        fee: 15,
        total: 365,
        currency: 'GHS',
        totals_display: {
            subtotal: 'GH₵ 350.00',
            fee: 'GH₵ 15.00',
            total: 'GH₵ 365.00',
        },
        event: {
            slug: 'the-mega-band-concert',
            title: 'The Mega Band Concert',
            starts_at: '2026-08-08T09:27:00+00:00',
            venue_name: 'GV Events',
            venue_address: null,
            cover_image: null,
        },
        items: [
            {
                ticket_type: 'VIP',
                quantity: 1,
                unit_price: 350,
                unit_price_display: 'GH₵ 350.00',
                tickets: [{ code: 'B7QK-9MXL', status: 'valid', seat_number: 'A12', seat_label: 'Row A' }],
            },
        ],
        payment: { status: 'pending', gateway: 'mojopay' },
    },
];

// ---------- Style maps ----------

const orderStatusStyles: Record<OrderStatus, string> = {
    paid: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    cancelled: 'bg-gray-100 text-gray-500',
    refunded: 'bg-blue-50 text-blue-700',
    failed: 'bg-red-50 text-red-700',
};

const ticketStatusStyles: Record<TicketStatus, string> = {
    valid: 'bg-emerald-50 text-emerald-700',
    used: 'bg-gray-100 text-gray-500',
    void: 'bg-red-50 text-red-700',
    refunded: 'bg-blue-50 text-blue-700',
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
    completed: 'text-emerald-700',
    pending: 'text-amber-700',
    failed: 'text-red-700',
    refunded: 'text-blue-700',
};

// ---------- Helpers ----------

const formatDate = (isoString: string): string => {
    const d = new Date(isoString);
    const date = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `${date} · ${time}`;
};

const totalTicketCount = (order: Order): number =>
    order.items.reduce((sum, item) => sum + item.quantity, 0);

// ---------- Row component ----------

interface OrderRowProps {
    order: Order;
}

const OrderRow: React.FC<OrderRowProps> = ({ order }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="flex w-full flex-col gap-3 p-5 text-left sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-gray-900">{order.reference}</span>
                        <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${orderStatusStyles[order.status]}`}
                        >
                            {order.status}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-600">
                            {order.sales_channel.replace('_', ' ')}
                        </span>
                    </div>

                    <p className="mt-1.5 truncate text-sm font-medium text-gray-900">{order.event.title}</p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(order.event.starts_at)}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {order.event.venue_name}
                        </span>
                        <span className="flex items-center gap-1">
                            <TicketIcon size={14} />
                            {totalTicketCount(order)} ticket{totalTicketCount(order) > 1 ? 's' : ''}
                        </span>
                    </div>

                    <p className="mt-1.5 text-xs text-gray-500">
                        {order.buyer_name} · {order.buyer_email} · {order.buyer_phone}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                    <span className="text-lg font-bold text-gray-900">{order.totals_display.total}</span>
                    {expanded ? (
                        <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                        <ChevronDown size={18} className="text-gray-400" />
                    )}
                </div>
            </button>

            {expanded && (
                <div className="border-t border-gray-100 px-5 py-4">
                    {/* Payment info */}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <CreditCard size={16} className="text-gray-400" />
                        <span>
                            Payment via <span className="font-medium capitalize">{order.payment.gateway}</span> ·{' '}
                            <span className={`font-medium capitalize ${paymentStatusStyles[order.payment.status]}`}>
                                {order.payment.status}
                            </span>
                        </span>
                    </div>

                    {/* Items */}
                    <div className="mt-4 space-y-3">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="rounded-lg bg-gray-50 p-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-gray-900">
                                        {item.quantity} x {item.ticket_type}
                                    </span>
                                    <span className="text-gray-600">{item.unit_price_display} each</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {item.tickets.map((ticket) => (
                                        <div
                                            key={ticket.code}
                                            className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs"
                                        >
                                            <span className="font-mono font-medium text-gray-800">{ticket.code}</span>
                                            {ticket.seat_label && (
                                                <span className="text-gray-400">
                                                    {ticket.seat_label} {ticket.seat_number}
                                                </span>
                                            )}
                                            <span
                                                className={`rounded-full px-2 py-0.5 font-medium capitalize ${ticketStatusStyles[ticket.status]}`}
                                            >
                                                {ticket.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Totals breakdown */}
                    <div className="mt-4 space-y-1 border-t border-gray-100 pt-3 text-sm">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span>{order.totals_display.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Fee</span>
                            <span>{order.totals_display.fee}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-900">
                            <span>Total</span>
                            <span>{order.totals_display.total}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ---------- Page component ----------

const orderStatusFilters: Array<OrderStatus | 'all'> = ['all', 'paid', 'pending', 'cancelled', 'refunded', 'failed'];

const OrdersListPage: React.FC<{ orders?: Order[] }> = ({ orders = mockOrders }) => {
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            const q = query.trim().toLowerCase();
            const matchesQuery =
                !q ||
                order.reference.toLowerCase().includes(q) ||
                order.buyer_name.toLowerCase().includes(q) ||
                order.buyer_email.toLowerCase().includes(q) ||
                order.buyer_phone.includes(q);
            return matchesStatus && matchesQuery;
        });
    }, [orders, query, statusFilter]);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Ticket Orders</h1>
                    <p className="mt-1 text-gray-500">{filteredOrders.length} order{filteredOrders.length === 1 ? '' : 's'}</p>
                </div>

                {/* Search + filters */}
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by reference, name, email, or phone"
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {orderStatusFilters.map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${statusFilter === status
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500">
                            No orders match your search.
                        </div>
                    ) : (
                        filteredOrders.map((order) => <OrderRow key={order.reference} order={order} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersListPage;
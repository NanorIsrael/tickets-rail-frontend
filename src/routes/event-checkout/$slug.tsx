import { createFileRoute } from '@tanstack/react-router'
import { QueryFunctionContext, useMutation } from "@tanstack/react-query";

export const Route = createFileRoute('/event-checkout/$slug')({
    component: RouteComponent,
})

function RouteComponent() {
    return <TicketDetailPage />
}
import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, MapPin, Minus, Plus, ArrowLeft } from 'lucide-react';
import { Ticket, TicketTypes } from '@/types/ticket';
import { useQuery } from '@tanstack/react-query';
const apiKey = import.meta.env.VITE_MOJOTICKETS_API_KEY;
// Example shape of the ticket passed in (from the tickets list page)


const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    const date = d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `${date} · ${time}`;
};

const fetchTicketDetail = async ({ queryKey }: QueryFunctionContext<[string, string]>) => {
    const [, slug] = queryKey;

    const response = await fetch(`https://mojotickets.adfocusgh.com/api/v1/partner/events/${slug}`, {
        headers: {
            "authorization": `Bearer ${apiKey}`
        }
    })
    if (!response.ok) {
        throw new Error("Network response was not ok")
    }
    return (response.json())
}
const createCheckout = async (order: any) => {
    const response = await fetch(`https://mojotickets.adfocusgh.com/api/v1/partner/checkout`, {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${apiKey}`
        }
    })
    if (!response.ok) {
        throw new Error("Network response was not ok")
    }
    return (response.json())
}

const TicketDetailPage = () => {
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [errors, setErrors] = useState<{
        name?: string
        email?: string
        phone?: string
    }>({});
    const [submitting, setSubmitting] = useState(false);
    const { slug } = Route.useParams()
    const navigate = Route.useNavigate()

    const { data: ticket, isLoading, error } = useQuery({
        queryKey: ["ticket-detail", slug],
        queryFn: fetchTicketDetail,
        select: (response) => response.data as Ticket,
    })

    const {
        mutate,
        data: created_checkout,
        isPending,
        isError,
        error: checkoutError } = useMutation({
            mutationFn: createCheckout,
            onSuccess: (created_checkout) => {
                window.open(
                    created_checkout.authorization_url,
                    "_blank",
                    "noopener,noreferrer"
                );
            },
        })

    const selectedType = useMemo(
        () => ticket?.ticket_types?.find((t: any) => t.id === selectedTypeId),
        [ticket?.ticket_types, selectedTypeId]
    );

    const maxQty = Math.min(selectedType?.available ?? 1, selectedType ? selectedType.available : 10);
    const total = (selectedType?.price ?? 0) * quantity;
    const isValidForm = form.email && form.phone && form.name

    const handleTypeChange = (typeId: number) => {
        setSelectedTypeId(typeId);
        setQuantity(1);
    };

    const adjustQty = (delta: number) => {
        setQuantity((q) => Math.min(Math.max(1, q + delta), maxQty));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((err) => ({ ...err, [name]: undefined }));
    };

    const validate = () => {
        const newErrors: {
            name?: string
            email?: string
            phone?: string
        } = {};
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = 'Enter a valid email';
        }
        if (!form.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[+\d][\d\s-]{6,}$/.test(form.phone)) {
            newErrors.phone = 'Enter a valid phone number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onBack = () => { navigate({ to: "/" }) }
    const onCheckout = (order: any) => mutate(order)

    const handleCheckout = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate() || !ticket) return;

        setSubmitting(true);

        const order = {
            "event_slug": slug,
            "buyer_name": form.name,
            "buyer_email": form.email,
            "buyer_phone": form.phone,
            "buyer_locale": "en",
            "payment_mode": "redirect",
            "items": [
                { "ticket_type_id": selectedType?.id, "quantity": quantity }
            ]
        };

        if (onCheckout) {
            await onCheckout(order);
        } else {
            console.log('Checkout order:', order);
        }
        setSubmitting(false);
    };

    if (isLoading) {
        return <div>Tickets Loading ...</div>;
    }

    if (error || checkoutError) {
        return <div>Something went wrong</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
            <div className="mx-auto max-w-3xl">
                <button
                    onClick={onBack}
                    className="pointer-cursor mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft size={16} />
                    Back to tickets
                </button>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {/* Header */}
                    <div className="border-b border-gray-100 p-6">
                        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                            {ticket?.category?.name}
                        </span>
                        <h1 className="mt-3 text-2xl font-bold text-gray-900">{ticket?.title}</h1>
                        <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span>{formatDate(ticket?.starts_at as string)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" />
                                <span>{ticket?.venue_name}</span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleCheckout} className="p-6">
                        {/* Ticket type selector */}
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">Select ticket type</h2>
                            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {ticket?.ticket_types?.map((type: TicketTypes) => {
                                    const soldOut = type.available === 0;
                                    const active = selectedTypeId === type.id;
                                    return (
                                        <button
                                            type="button"
                                            key={type.id}
                                            disabled={soldOut}
                                            onClick={() => handleTypeChange(type.id)}
                                            className={`rounded-xl border p-4 text-left transition ${soldOut
                                                ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
                                                : active
                                                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <p className="text-sm font-semibold text-gray-900">{type.label}</p>
                                            <p className="mt-1 text-lg font-bold text-gray-900">
                                                GHS {type.price_display.toLocaleString()}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {soldOut ? 'Sold out' : `${type.available} left`}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quantity selector */}
                        <div className="mt-6">
                            <h2 className="text-sm font-semibold text-gray-900">Quantity</h2>
                            <div className="mt-3 flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => adjustQty(-1)}
                                    disabled={quantity <= 1}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-8 text-center text-base font-semibold text-gray-900">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => adjustQty(1)}
                                    disabled={quantity >= maxQty}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Plus size={16} />
                                </button>
                                <span className="text-xs text-gray-400">Max {maxQty} per order</span>
                            </div>
                        </div>

                        {/* Buyer details */}
                        <div className="mt-8">
                            <h2 className="text-sm font-semibold text-gray-900">Your details</h2>
                            <div className="mt-3 space-y-4">
                                <div>
                                    <label htmlFor="name" className="mb-1 block text-xs font-medium text-gray-600">
                                        Full name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Ama Boateng"
                                        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-400' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-1 block text-xs font-medium text-gray-600">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="e.g. ama@example.com"
                                        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? 'border-red-400' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="mb-1 block text-xs font-medium text-gray-600">
                                        Phone number
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="e.g. +233 24 123 4567"
                                        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 ${errors.phone ? 'border-red-400' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Order summary + checkout */}
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>
                                    {quantity} x {selectedType?.label} ticket{quantity > 1 ? 's' : ''}
                                </span>
                                <span>GHS {total.toLocaleString()}</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between text-base font-bold text-gray-900">
                                <span>Total</span>
                                <span>GHS {total.toLocaleString()}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || !isValidForm}
                                className="mt-5 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {submitting ? 'Processing...' : `Checkout · GHS ${total.toLocaleString()}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailPage;
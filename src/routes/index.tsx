import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TicketsPage />
}

import React, { useEffect, useState } from 'react';
import { Calendar, File, MapPin, Tag, Ticket as TicketIcon } from 'lucide-react';
import { triggerAsyncId } from 'async_hooks';
import { useQuery } from '@tanstack/react-query';
import { Ticket } from '@/types/ticket';
const apiKey = import.meta.env.VITE_MOJOTICKETS_API_KEY;



const formatDate = (isoString: string) => {
  const d = new Date(isoString);
  const date = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${date} · ${time}`;
};

const categoryColors: { [k: string]: string } = {
  Concert: 'bg-pink-100 text-pink-700',
  Music: 'bg-pink-100 text-pink-700',
  Conference: 'bg-blue-100 text-blue-700',
  Comedy: 'bg-amber-100 text-amber-700',
  Sports: 'bg-emerald-100 text-emerald-700',
};

const fetchTickets = async () => {
  const response = await fetch('https://mojotickets.adfocusgh.com/api/v1/partner/events', {
    headers: {
      "authorization": `Bearer ${apiKey}`
    }
  })
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  return response.json()
}

const TicketCard = ({ ticket, onBuy }: { ticket: Ticket, onBuy: (ticket: Ticket) => void }) => {
  const soldOut = ticket.ticket_types[0].available === 0;
  const lowStock = ticket.ticket_types[0].available > 0 && ticket.ticket_types[0].available <= 10;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${categoryColors[ticket.category.name] || 'bg-gray-100 text-gray-700'
              }`}
          >
            {ticket.category.name}
          </span>
        </div>
        <div>
          <img src="favicon.ico" className='w-full my-4 object-cover' />
        </div>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-400" />
            <span>{formatDate(ticket.starts_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span>{ticket.venue_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <TicketIcon size={16} className="text-gray-400" />
            <span>
              {soldOut
                ? 'Sold out'
                : `${ticket.ticket_types[0].available} ticket${ticket.ticket_types[0].available === 1 ? '' : 's'} left`}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-400">Price</p>
          <p className="text-xl font-bold text-gray-900">
            GHS {ticket.ticket_types[0].price_display.toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => onBuy(ticket)}
          disabled={soldOut}
          className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${soldOut
            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
            }`}
        >
          {soldOut ? 'Unavailable' : 'Buy Ticket'}
        </button>
      </div>

      {lowStock && (
        <p className="mt-2 text-xs font-medium text-red-500">Almost sold out — grab yours now!</p>
      )}
    </div>
  );
};

const TicketsPage = () => {
  // const [ticketsMocked] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[] | null>(null)
  const navigate = Route.useNavigate()
  const { data, isLoading, error } = useQuery({ queryKey: ["tickets"], queryFn: fetchTickets })

  useEffect(() => {
    if (data) {
      console.log(data)
      setTickets(data.data)

      // .data.map((ticket: any) => ({
      //   id: ticket.slug,
      //   title: ticket.title,
      //   date: ticket.starts_at,
      //   location: ticket.venue_name,
      //   amount: ticket.ticket_types[0].price_display,
      //   category: ticket.category.name,
      //   types: []
      //   availableQuantity: ticket.ticket_types[0].available,
      // })))
    }
  }, [data])


  const handleBuy = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    navigate({ to: `/event-checkout/${ticket.slug}` })
  };

  // const handleT = (ticket: Ticket) => {
  //   setSelectedTicket(ticket);

  // };

  if (isLoading) {
    return <div>Tickets Loading ...</div>;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tickets for Sale</h1>
          <p className="mt-1 text-gray-500">Browse upcoming events and grab your tickets.</p>
        </div>
        {tickets?.length == 0 ? (
          <div className='text-md font-bold text-gray-500 flex justify-center item-center h-full'>
            <File />
            <div>No tickets found</div>
          </div>
        ) :
          (<>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tickets?.map((ticket) => (
                <TicketCard key={ticket.slug} ticket={ticket} onBuy={handleBuy} />
              ))}
            </div>

            {selectedTicket && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                onClick={() => setSelectedTicket(null)}
              >
                <div
                  className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-lg font-semibold text-gray-900">Confirm purchase</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    You're about to buy <strong>{selectedTicket.title}</strong>
                  </p>
                  <div className="mt-5 flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setSelectedTicket(null)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>)
        }
      </div>

    </div>
  );
};

export default TicketsPage;
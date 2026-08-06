import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as Calendar, n as Ticket, o as MapPin, s as File } from "../_libs/lucide-react.mjs";
import { t as Route } from "./routes-L09tIbzB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-rdPidb-l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RouteComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketsPage, {});
}
var apiKey = "mt_live_aWimHWsdvUlPyCjYvyJV5MyJwGjcPtV2lzv3AClRdJzluJ4D";
var formatDate = (isoString) => {
	const d = new Date(isoString);
	return `${d.toLocaleDateString("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric"
	})} · ${d.toLocaleTimeString("en-GB", {
		hour: "2-digit",
		minute: "2-digit"
	})}`;
};
var categoryColors = {
	Concert: "bg-pink-100 text-pink-700",
	Music: "bg-pink-100 text-pink-700",
	Conference: "bg-blue-100 text-blue-700",
	Comedy: "bg-amber-100 text-amber-700",
	Sports: "bg-emerald-100 text-emerald-700"
};
var fetchTickets = async () => {
	const response = await fetch("https://mojotickets.adfocusgh.com/api/v1/partner/events", { headers: { "authorization": `Bearer ${apiKey}` } });
	if (!response.ok) throw new Error("Network response was not ok");
	return response.json();
};
var TicketCard = ({ ticket, onBuy }) => {
	const soldOut = ticket.ticket_types[0].available === 0;
	const lowStock = ticket.ticket_types[0].available > 0 && ticket.ticket_types[0].available <= 10;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold text-gray-900",
						children: ticket.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `shrink-0 rounded-full px-3 py-1 text-xs font-medium ${categoryColors[ticket.category.name] || "bg-gray-100 text-gray-700"}`,
						children: ticket.category.name
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "favicon.ico",
					className: "w-full my-4 object-cover"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2 text-sm text-gray-600",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
								size: 16,
								className: "text-gray-400"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(ticket.starts_at) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								size: 16,
								className: "text-gray-400"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ticket.venue_name })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, {
								size: 16,
								className: "text-gray-400"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: soldOut ? "Sold out" : `${ticket.ticket_types[0].available} ticket${ticket.ticket_types[0].available === 1 ? "" : "s"} left` })]
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex items-center justify-between border-t border-gray-100 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-gray-400",
					children: "Price"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xl font-bold text-gray-900",
					children: ["GHS ", ticket.ticket_types[0].price_display.toLocaleString()]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onBuy(ticket),
					disabled: soldOut,
					className: `rounded-lg px-5 py-2.5 text-sm font-semibold transition ${soldOut ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"}`,
					children: soldOut ? "Unavailable" : "Buy Ticket"
				})]
			}),
			lowStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs font-medium text-red-500",
				children: "Almost sold out — grab yours now!"
			})
		]
	});
};
var TicketsPage = () => {
	const [selectedTicket, setSelectedTicket] = (0, import_react.useState)(null);
	const [tickets, setTickets] = (0, import_react.useState)(null);
	const navigate = Route.useNavigate();
	const { data, isLoading, error } = useQuery({
		queryKey: ["tickets"],
		queryFn: fetchTickets
	});
	(0, import_react.useEffect)(() => {
		if (data) {
			console.log(data);
			setTickets(data.data);
		}
	}, [data]);
	const handleBuy = (ticket) => {
		setSelectedTicket(ticket);
		navigate({ to: `/event-checkout/${ticket.slug}` });
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Tickets Loading ..." });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Something went wrong" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gray-50 px-4 py-10 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold text-gray-900",
					children: "Tickets for Sale"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-gray-500",
					children: "Browse upcoming events and grab your tickets."
				})]
			}), tickets?.length == 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-md font-bold text-gray-500 flex justify-center item-center h-full",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "No tickets found" })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: tickets?.map((ticket) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketCard, {
					ticket,
					onBuy: handleBuy
				}, ticket.slug))
			}), selectedTicket && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4",
				onClick: () => setSelectedTicket(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold text-gray-900",
							children: "Confirm purchase"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-gray-600",
							children: ["You're about to buy ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedTicket.title })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex justify-end gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedTicket(null),
								className: "rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedTicket(null),
								className: "rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700",
								children: "Confirm"
							})]
						})
					]
				})
			})] })]
		})
	});
};
//#endregion
export { RouteComponent as component, TicketsPage as default };

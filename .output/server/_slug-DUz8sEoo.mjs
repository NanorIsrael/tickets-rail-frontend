import { n as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { a as Minus, c as Calendar, l as ArrowLeft, o as MapPin, r as Plus } from "./_libs/lucide-react.mjs";
import { t as Route } from "./_slug-bsJg8XfD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-DUz8sEoo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RouteComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TicketDetailPage, {});
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
var fetchTicketDetail = async ({ queryKey }) => {
	const [, slug] = queryKey;
	const response = await fetch(`https://mojotickets.adfocusgh.com/api/v1/partner/events/${slug}`, { headers: { "authorization": `Bearer ${apiKey}` } });
	if (!response.ok) throw new Error("Network response was not ok");
	return response.json();
};
var createCheckout = async (order) => {
	const response = await fetch(`https://mojotickets.adfocusgh.com/api/v1/partner/checkout`, {
		method: "POST",
		body: JSON.stringify(order),
		headers: {
			"content-type": "application/json",
			"authorization": `Bearer ${apiKey}`
		}
	});
	if (!response.ok) throw new Error("Network response was not ok");
	return response.json();
};
var TicketDetailPage = () => {
	const [selectedTypeId, setSelectedTypeId] = (0, import_react.useState)(null);
	const [quantity, setQuantity] = (0, import_react.useState)(1);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const { slug } = Route.useParams();
	const navigate = Route.useNavigate();
	const { data: ticket, isLoading, error } = useQuery({
		queryKey: ["ticket-detail", slug],
		queryFn: fetchTicketDetail,
		select: (response) => response.data
	});
	const { mutate, data: created_checkout, isPending, isError, error: checkoutError } = useMutation({
		mutationFn: createCheckout,
		onSuccess: (created_checkout) => {
			window.open(created_checkout.authorization_url, "_blank", "noopener,noreferrer");
		}
	});
	const selectedType = (0, import_react.useMemo)(() => ticket?.ticket_types?.find((t) => t.id === selectedTypeId), [ticket?.ticket_types, selectedTypeId]);
	const maxQty = Math.min(selectedType?.available ?? 1, selectedType ? selectedType.available : 10);
	const total = (selectedType?.price ?? 0) * quantity;
	const isValidForm = form.email && form.phone && form.name;
	const handleTypeChange = (typeId) => {
		setSelectedTypeId(typeId);
		setQuantity(1);
	};
	const adjustQty = (delta) => {
		setQuantity((q) => Math.min(Math.max(1, q + delta), maxQty));
	};
	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((f) => ({
			...f,
			[name]: value
		}));
		setErrors((err) => ({
			...err,
			[name]: void 0
		}));
	};
	const validate = () => {
		const newErrors = {};
		if (!form.name.trim()) newErrors.name = "Name is required";
		if (!form.email.trim()) newErrors.email = "Email is required";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Enter a valid email";
		if (!form.phone.trim()) newErrors.phone = "Phone number is required";
		else if (!/^[+\d][\d\s-]{6,}$/.test(form.phone)) newErrors.phone = "Enter a valid phone number";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const onBack = () => {
		navigate({ to: "/" });
	};
	const onCheckout = (order) => mutate(order);
	const handleCheckout = async (e) => {
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
			"items": [{
				"ticket_type_id": selectedType?.id,
				"quantity": quantity
			}]
		};
		if (onCheckout) await onCheckout(order);
		else console.log("Checkout order:", order);
		setSubmitting(false);
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Tickets Loading ..." });
	if (error || checkoutError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Something went wrong" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gray-50 px-4 py-10 sm:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onBack,
				className: "pointer-cursor mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 16 }), "Back to tickets"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-gray-100 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700",
							children: ticket?.category?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-2xl font-bold text-gray-900",
							children: ticket?.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-1.5 text-sm text-gray-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
									size: 16,
									className: "text-gray-400"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDate(ticket?.starts_at) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
									size: 16,
									className: "text-gray-400"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ticket?.venue_name })]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleCheckout,
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold text-gray-900",
							children: "Select ticket type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3",
							children: ticket?.ticket_types?.map((type) => {
								const soldOut = type.available === 0;
								const active = selectedTypeId === type.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: soldOut,
									onClick: () => handleTypeChange(type.id),
									className: `rounded-xl border p-4 text-left transition ${soldOut ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300" : active ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" : "border-gray-200 hover:border-gray-300"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-gray-900",
											children: type.label
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-lg font-bold text-gray-900",
											children: ["GHS ", type.price_display.toLocaleString()]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-gray-500",
											children: soldOut ? "Sold out" : `${type.available} left`
										})
									]
								}, type.id);
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold text-gray-900",
								children: "Quantity"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => adjustQty(-1),
										disabled: quantity <= 1,
										className: "flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 16 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-8 text-center text-base font-semibold text-gray-900",
										children: quantity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => adjustQty(1),
										disabled: quantity >= maxQty,
										className: "flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 16 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-gray-400",
										children: [
											"Max ",
											maxQty,
											" per order"
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold text-gray-900",
								children: "Your details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "name",
											className: "mb-1 block text-xs font-medium text-gray-600",
											children: "Full name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "name",
											name: "name",
											type: "text",
											value: form.name,
											onChange: handleChange,
											placeholder: "e.g. Ama Boateng",
											className: `w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? "border-red-400" : "border-gray-300"}`
										}),
										errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-red-500",
											children: errors.name
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "email",
											className: "mb-1 block text-xs font-medium text-gray-600",
											children: "Email address"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "email",
											name: "email",
											type: "email",
											value: form.email,
											onChange: handleChange,
											placeholder: "e.g. ama@example.com",
											className: `w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? "border-red-400" : "border-gray-300"}`
										}),
										errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-red-500",
											children: errors.email
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											htmlFor: "phone",
											className: "mb-1 block text-xs font-medium text-gray-600",
											children: "Phone number"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "phone",
											name: "phone",
											type: "tel",
											value: form.phone,
											onChange: handleChange,
											placeholder: "e.g. +233 24 123 4567",
											className: `w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 ${errors.phone ? "border-red-400" : "border-gray-300"}`
										}),
										errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-red-500",
											children: errors.phone
										})
									] })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 border-t border-gray-100 pt-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-sm text-gray-600",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										quantity,
										" x ",
										selectedType?.label,
										" ticket",
										quantity > 1 ? "s" : ""
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["GHS ", total.toLocaleString()] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center justify-between text-base font-bold text-gray-900",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["GHS ", total.toLocaleString()] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: submitting || !isValidForm,
									className: "mt-5 w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
									children: submitting ? "Processing..." : `Checkout · GHS ${total.toLocaleString()}`
								})
							]
						})
					]
				})]
			})]
		})
	});
};
//#endregion
export { RouteComponent as component, TicketDetailPage as default };

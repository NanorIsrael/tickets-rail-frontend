import { useState, useRef, useEffect } from "react";
import { Bot, MessageSquare, Send, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Msg = { id: string; role: "user" | "bot"; text: string; time: string };

const seed: Msg[] = [
  {
    id: "1",
    role: "bot",
    text: "Hi, I'm SENTINEL Copilot. I monitor your fleet 24/7. How can I help?",
    time: "09:12",
  },
  {
    id: "2",
    role: "user",
    text: "Which asset is at highest risk right now?",
    time: "09:12",
  },
  {
    id: "3",
    role: "bot",
    text: "PMP-204 (Feedwater Pump #4) has a 78% 30-day failure probability. Vibration RMS is 2.3× baseline and bearing temperature has drifted +14°C over the last 72h.",
    time: "09:13",
  },
  {
    id: "4",
    role: "user",
    text: "What do you recommend?",
    time: "09:13",
  },
  {
    id: "5",
    role: "bot",
    text: "Schedule a bearing inspection within 5 days. Estimated downtime avoidance: ~$42k. I can draft a work order for approval — want me to?",
    time: "09:14",
  },
];

const cannedReplies = [
  "Acknowledged. I've logged that in the audit trail for review.",
  "Based on current telemetry, no additional critical anomalies are trending.",
  "I've queued a diagnostic sweep. Results will surface in the Anomalies panel shortly.",
  "Understood. Would you like me to notify the reliability engineer on-call?",
];

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    const now = new Date().toISOString().slice(11, 16);
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: t, time: now };
    const botMsg: Msg = {
      id: crypto.randomUUID(),
      role: "bot",
      text: cannedReplies[Math.floor(Math.random() * cannedReplies.length)],
      time: now,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, botMsg]), 700);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI Copilot"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-1 ring-primary/60 hover:opacity-90 transition"
      >
        {open ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        {!open && (
          <span
            className="status-dot pulse-crit absolute -right-0.5 -top-0.5"
            style={{ color: "var(--color-status-ok)", backgroundColor: "var(--color-status-ok)" }}
          />
        )}
      </button>

      {open && (
        <div className="panel fixed bottom-24 right-5 z-40 flex h-[32rem] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden shadow-2xl">
          <header className="flex items-center justify-between border-b border-border/60 bg-panel/80 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/15 ring-1 ring-primary/40">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">SENTINEL Copilot</div>
                <div className="hud-label flex items-center gap-1.5">
                  <span
                    className="status-dot"
                    style={{ color: "var(--color-status-ok)", backgroundColor: "var(--color-status-ok)" }}
                  />
                  Online · Rule-based
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}
              >
                {m.role === "bot" && (
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/15 ring-1 ring-primary/30">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-foreground border border-border/60"
                    )}
                  >
                    {m.text}
                  </div>
                  <div
                    className={cn(
                      "mt-1 font-mono text-[0.6rem] text-muted-foreground",
                      m.role === "user" ? "text-right" : "text-left"
                    )}
                  >
                    {m.time} UTC
                  </div>
                </div>
                {m.role === "user" && (
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted ring-1 ring-border">
                    <User className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-border/60 bg-panel/80 px-3 py-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about assets, anomalies, RUL…"
              className="flex-1 rounded border border-border/60 bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <Button type="submit" size="icon" aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}

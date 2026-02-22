import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_INSTRUCTION =
  "You are EquityGuide (2026). You help DC residents understand the 2026 federal budget policy changes, " +
  "especially impacts on SNAP and Medicaid in Wards 7 & 8. " +
  "Key facts: New policy introduces an 80-hour/month work requirement for SNAP benefits for adults 18-59. " +
  "Qualifying activities include employment, job training, education, community service, and Federal Work-Study. " +
  "Howard University students should know their work-study hours count toward this requirement. " +
  "Rules: Keep responses concise (under 150 words). Never invent URLs or links. Never make up acronym definitions. " +
  "If unsure about a detail, say so. Be empathetic but factual.";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemma-3-4b-it",
});

const FALLBACK_RESPONSES: Record<string, string> = {
  snap:
    "Under the 2026 federal budget changes, SNAP eligibility now requires 80 hours/month of work, education, or community service for adults 18–59. If you're a Howard student, your Federal Work-Study hours count toward that requirement. You can check your eligibility and apply at the DC SNAP portal or visit a local enrollment center in your ward.",
  medicaid:
    "Medicaid eligibility has tightened under the 2026 federal budget changes. Income thresholds have been adjusted, and documentation requirements are stricter. Many health centers in DC still offer sliding-scale fees and accept Medicaid — use the map to find walk-in clinics near you. If you've lost coverage, contact DC Health Link to explore your options.",
  work:
    "The 80-hour work rule under the 2026 federal budget changes requires adults aged 18–59 to complete 80 hours per month of qualifying activities to maintain SNAP benefits. Qualifying activities include: employment, job training, education, community service, and Federal Work-Study. Howard University students: your work-study hours count toward this requirement, so make sure to document them.",
  howard:
    "Howard students have several resources available. Your Federal Work-Study hours count toward the 80-hour work requirement for SNAP eligibility. The university also offers emergency meal programs, textbook assistance, and campus health services. Check with the Office of Financial Aid for details on maximizing your benefits.",
  benefit:
    "The 2026 federal budget has introduced significant changes to benefit programs. Key impacts for DC Wards 7 & 8 include: stricter SNAP work requirements (80 hrs/month), tightened Medicaid eligibility, and reduced funding for community health programs. EquityMap is here to help you navigate these changes and find available resources.",
  default:
    "I can help you understand the 2026 federal policy changes and find resources in DC. Try asking about:\n\n• The 80-hour work rule for SNAP\n• Medicaid eligibility changes\n• Howard University student benefits\n• Finding food or healthcare resources near you\n\nWhat would you like to know?",
};

const getFallbackResponse = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes("80") || lower.includes("work rule") || lower.includes("work requirement"))
    return FALLBACK_RESPONSES.work;
  if (lower.includes("snap") || lower.includes("food") || lower.includes("ebt"))
    return FALLBACK_RESPONSES.snap;
  if (lower.includes("medicaid") || lower.includes("health") || lower.includes("doctor") || lower.includes("clinic"))
    return FALLBACK_RESPONSES.medicaid;
  if (lower.includes("howard") || lower.includes("student") || lower.includes("work-study") || lower.includes("work study"))
    return FALLBACK_RESPONSES.howard;
  if (lower.includes("obbba") || lower.includes("benefit") || lower.includes("budget") || lower.includes("cut"))
    return FALLBACK_RESPONSES.benefit;
  return FALLBACK_RESPONSES.default;
};

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi! I'm EquityGuide, your AI-powered assistant for navigating SNAP, Medicaid, and community resources across D.C. How can I help?",
};

const AIChatBot = ({ fabOffset = false }: { fabOffset?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<ReturnType<typeof model.startChat> | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getOrCreateChat = () => {
    if (!chatRef.current) {
      const history = messages
        .filter((m) => m !== WELCOME)
        .map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          parts: [{ text: m.content }],
        }));

      const firstUserIdx = history.findIndex((m) => m.role === "user");
      const validHistory = firstUserIdx >= 0 ? history.slice(firstUserIdx) : [];

      chatRef.current = model.startChat({
        history: [
          { role: "user", parts: [{ text: `Context: ${SYSTEM_INSTRUCTION}\n\nAcknowledge and follow these instructions.` }] },
          { role: "model", parts: [{ text: "Understood. I am EquityGuide, ready to help with DC policy questions and federal budget guidance." }] },
          ...validHistory,
        ],
      });
    }
    return chatRef.current;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const chat = getOrCreateChat();
      const result = await chat.sendMessage(text);
      const response = result.response.text();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (err) {
      chatRef.current = null;
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${errorMsg}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className={`fixed right-4 z-40 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg glow-primary flex items-center justify-center hover:scale-105 transition-all duration-300 ${fabOffset ? "bottom-52" : "bottom-20 animate-float"}`}
          aria-label="Open AI chat"
        >
          <Bot className="w-7 h-7" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed inset-0 z-50 md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[600px] md:rounded-2xl flex flex-col glass-strong md:shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-display font-semibold text-foreground">
                  EquityGuide
                </p>
                <p className="text-[10px] text-muted-foreground">
                  AI-powered &bull; EquityMap
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  } rounded-2xl px-4 py-2.5 text-sm`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary rounded-2xl px-4 py-3 flex gap-1">
                  <span
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border/50">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about SNAP, Medicaid, benefits..."
                className="flex-1 bg-secondary rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-accent transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatBot;

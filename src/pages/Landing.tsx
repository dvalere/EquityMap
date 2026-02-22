import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Bot,
  ClipboardCheck,
  ShieldCheck,
  ArrowRight,
  Zap,
  Users,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { useThemeContext } from "@/hooks/theme-context";
import { useLang, LANGUAGES } from "@/hooks/lang-context";

const FEATURES = [
  {
    icon: MapPin,
    title: "Resource Map",
    description:
      "450+ verified SNAP retailers and healthcare facilities across Washington, D.C., sourced from USDA and DC government datasets.",
    accent: "#22c55e",
  },
  {
    icon: Bot,
    title: "EquityGuide AI",
    description:
      "An AI assistant that explains benefit eligibility, the 80-hour work requirement, and helps you find resources near you.",
    accent: "#0055a5",
  },
  {
    icon: ClipboardCheck,
    title: "Eligibility Screener",
    description:
      "A guided, step-by-step flow that assesses your SNAP eligibility in under 30 seconds — no account required.",
    accent: "#3b6ed5",
  },
];

const STATS = [
  { value: "450+", label: "Verified Locations", icon: MapPin },
  { value: "<30s", label: "Screener Time", icon: Zap },
  { value: "24/7", label: "AI Guidance", icon: Users },
];

const Landing = () => {
  const navigate = useNavigate();
  const { isDark, toggle: toggleTheme } = useThemeContext();
  const { lang, setLang, t } = useLang();
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Top controls */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="p-2.5 rounded-xl glass hover:shadow-md transition-all flex items-center gap-1.5"
            title="Change language"
          >
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-[10px] font-medium text-muted-foreground uppercase">{lang}</span>
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 glass-strong rounded-xl shadow-xl border border-border/50 py-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => { setLang(l.code); setLangOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-secondary transition-colors flex items-center justify-between ${
                    lang === l.code ? "text-primary font-semibold" : "text-foreground"
                  }`}
                >
                  <span>{l.native}</span>
                  {lang === l.code && <span className="text-primary">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl glass hover:shadow-md transition-all"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-yellow-400" />
          ) : (
            <Moon className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Hero */}
      <section className="relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-primary/[0.04] blur-3xl animate-drift" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-pin-food/[0.05] blur-3xl animate-drift-reverse" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/[0.03] blur-3xl animate-drift-slow" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Logo */}
          <h2 className="text-sm font-display font-bold text-muted-foreground tracking-widest uppercase mb-8">
            Equity<span className="text-primary">Map</span>
          </h2>

          <h1 className="text-5xl md:text-6xl font-display font-bold text-foreground tracking-tight leading-[1.1]">
            {t("hero.title.1")}
            <br />
            <span className="text-gradient">{t("hero.title.2")}</span>
          </h1>

          <p className="mt-8 text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/map")}
              className="group px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-accent transition-all duration-300 shadow-lg glow-primary flex items-center gap-2.5"
            >
              {t("hero.cta")}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <p className="mt-5 text-xs text-muted-foreground/70">
            {t("hero.note")}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-6 -mt-4 mb-16">
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="glass rounded-2xl p-5 text-center group hover:shadow-md transition-shadow"
            >
              <s.icon className="w-4 h-4 text-primary mx-auto mb-2 opacity-60" />
              <p className="text-2xl font-display font-bold text-foreground">
                {s.value}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-center text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-10">
          {t("features.heading")}
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="relative glass-strong rounded-2xl p-6 space-y-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden group"
            >
              {/* Accent top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                style={{ backgroundColor: f.accent }}
              />
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: f.accent + "15" }}
              >
                <f.icon
                  className="w-5 h-5"
                  style={{ color: f.accent }}
                />
              </div>
              <h3 className="text-sm font-display font-bold text-foreground">
                {f.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Transparency */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="relative glass-strong rounded-2xl p-8 space-y-6 overflow-hidden">
          {/* Subtle accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-pin-food" />

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-foreground">
                How We Use AI
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Transparency & ethics
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                q: "What AI powers EquityGuide?",
                a: "Google Gemini 2.5 Flash, a large language model. It receives your questions and general policy context — never personal data.",
              },
              {
                q: "What data does it have?",
                a: "General knowledge about SNAP and Medicaid rules. Map data comes from public USDA and DC government datasets — not from AI.",
              },
              {
                q: "What can't it do?",
                a: "It cannot determine your actual eligibility, access your benefits, or make decisions on your behalf. Always verify with official sources.",
              },
              {
                q: "Is my data stored?",
                a: "No. Conversations are not saved and no personal information is collected. Your session resets when you close the page.",
              },
            ].map((item) => (
              <div
                key={item.q}
                className="space-y-1.5 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/60 transition-colors"
              >
                <p className="text-xs font-semibold text-foreground">
                  {item.q}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          {t("cta.title")}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {t("cta.subtitle")}
        </p>
        <button
          onClick={() => navigate("/map")}
          className="group mt-8 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-accent transition-all duration-300 shadow-lg glow-primary inline-flex items-center gap-2.5"
        >
          Get Started
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center">
        <p className="text-[11px] text-muted-foreground/70">
          {t("footer")}
        </p>
      </footer>
    </div>
  );
};

export default Landing;

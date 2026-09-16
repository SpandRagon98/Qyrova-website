import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion, AnimatePresence, useScroll, useSpring, useInView,
  useMotionValue, MotionConfig,
} from "framer-motion";
import {
  LayoutGrid, Layers, Database, FileText, Mail, Users, Settings,
  ArrowRight, ArrowUpRight, Check, ChevronDown, Crown, Edit3, Eye,
  FileDown, FileSpreadsheet, Menu, Search, Send, Shield, Sparkles,
  Sun, Moon, X, Zap, CircleCheck, Workflow, MousePointerClick, Heart,
} from "lucide-react";
import {
  DashboardMock, PresetsMock, DatabaseMock, DocViewMock, EmailMock,
  SettingsMock, ThemedMiniDash, QyrovaLogo, Counter,
} from "./Mockups";
import "./site.css";
import "./premium.css";

const APP_URL = "https://qyrova.spandan305.workers.dev/";

/* ═══════════════════════  MOTION TOOLKIT  ═══════════════════════ */

function Reveal({ children, delay = 0, y = 36, className = "", once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.6, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* 3D tilt that follows the mouse */
function Tilt3D({ children, max = 7, className = "" }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 18 });
  const sry = useSpring(ry, { stiffness: 140, damping: 18 });
  return (
    <div style={{ perspective: 1400 }} className={className}>
      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
        }}
        onMouseLeave={() => { rx.set(0); ry.set(0); }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* button that leans toward the cursor */
function Magnetic({ children, strength = 14, className = "" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15 });
  const sy = useSpring(y, { stiffness: 220, damping: 15 });
  return (
    <motion.div
      className={`inline-block ${className}`}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
        y.set(((e.clientY - r.top) / r.height - 0.5) * strength * 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/* floating particles — pink sparks (✦) or soft dots */
function Particles({ count = 16, char = false, className = "" }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 3 + Math.random() * 7,
        delay: -(Math.random() * 12),
        dur: 8 + Math.random() * 10,
        o: 0.25 + Math.random() * 0.5,
      })),
    [count]
  );
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {items.map((p) =>
        char ? (
          <span
            key={p.id}
            className="q-spark"
            style={{
              left: `${p.left}%`, top: `${p.top}%`, fontSize: p.size + 5,
              animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, opacity: p.o,
            }}
          >
            ✦
          </span>
        ) : (
          <span
            key={p.id}
            className="q-dot"
            style={{
              left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size,
              animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, opacity: p.o,
            }}
          />
        )
      )}
    </div>
  );
}

/* cursor spotlight for dark sections */
function useSpotlight() {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 90, damping: 22 });
  const sy = useSpring(y, { stiffness: 90, damping: 22 });
  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };
  const onMouseLeave = () => { x.set(-9999); y.set(-9999); };
  const spotlight = (
    <motion.div aria-hidden className="q-spotlight" style={{ left: sx, top: sy }} />
  );
  return { onMouseMove, onMouseLeave, spotlight };
}

/* confetti burst layer */
const CONFETTI_COLORS = ["#e0476b", "#f48fb1", "#d24bff", "#ffd166", "#4caf7d", "#7cc4ff"];

function Burst({ x, y }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => {
        const a = (Math.PI * 2 * i) / 26 + Math.random() * 0.5;
        const d = 70 + Math.random() * 130;
        return {
          id: i,
          dx: Math.cos(a) * d,
          dy: Math.sin(a) * d * 0.85 + 110,
          rot: (Math.random() - 0.5) * 540,
          c: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          w: 5 + Math.random() * 6,
          h: 8 + Math.random() * 8,
          dur: 1.1 + Math.random() * 0.6,
          round: Math.random() > 0.6,
        };
      }),
    []
  );
  return (
    <>
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x, y, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: x + p.dx, y: y + p.dy, opacity: 0, rotate: p.rot, scale: 0.7 }}
          transition={{ duration: p.dur, ease: [0.15, 0.6, 0.4, 1] }}
          style={{
            position: "fixed", top: 0, left: 0, width: p.w, height: p.h,
            background: p.c, borderRadius: p.round ? 99 : 2, zIndex: 100,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

function useConfetti() {
  const [bursts, setBursts] = useState([]);
  const fire = (e) => {
    const id = Date.now() + Math.random();
    setBursts((b) => [...b, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => setBursts((b) => b.filter((q) => q.id !== id)), 1900);
  };
  const layer = bursts.map((b) => <Burst key={b.id} x={b.x} y={b.y} />);
  return { fire, layer };
}

/* letter-by-letter headline */
const letterVar = {
  hidden: { opacity: 0, y: 38, rotate: 6, scale: 0.85 },
  show: {
    opacity: 1, y: 0, rotate: 0, scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 22 },
  },
};

function SplitWords({ text, className = "" }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden="true">
          {word.split("").map((ch, ci) => (
            <motion.span key={ci} variants={letterVar} className="inline-block">
              {ch}
            </motion.span>
          ))}
          {wi < text.split(" ").length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

function SectionTag({ children }) {
  return (
    <span className="glass-chip inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--q-pink-deep)]">
      <Sparkles size={11} className="animate-[q-twirl_3s_ease-in-out_infinite]" />
      {children}
    </span>
  );
}

/* ═══════════════════════  NAV  ═══════════════════════ */

const NAV_LINKS = [
  ["Features", "#features"],
  ["Workflow", "#workflow"],
  ["Product", "#product"],
  ["Themes", "#themes"],
  ["Roles", "#roles"],
  ["FAQ", "#faq"],
];

function Nav({ onLogoClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <header className={`q-site-nav ${scrolled ? "q-is-scrolled" : ""} fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-2.5" : "py-5"}`}>
      <nav
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 transition-all duration-300 sm:px-6 ${
          scrolled ? "glass-nav mx-4 py-2.5 sm:mx-auto" : "bg-transparent py-2"
        }`}
      >
        <motion.a
          href="#top"
          className="text-[var(--q-ink)]"
          onClick={onLogoClick}
          whileHover={{ scale: 1.06, rotate: -2 }}
          whileTap={{ scale: 0.92 }}
          title="Click me 🎉"
        >
          <QyrovaLogo size={30} className="text-lg" />
        </motion.a>
        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-neutral-500 transition-all hover:-translate-y-0.5 hover:bg-rose-50/80 hover:text-[var(--q-pink-deep)]"
            >
              {label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Magnetic strength={8} className="hidden sm:inline-block">
            <a href={APP_URL} target="_blank" rel="noreferrer" className="btn-primary">
              Open App <ArrowUpRight size={15} />
            </a>
          </Magnetic>
          <button
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            aria-expanded={open}
            className="glass-chip grid h-10 w-10 place-items-center rounded-xl text-neutral-600 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-nav mx-4 mt-2 rounded-2xl p-3 lg:hidden"
          >
            {NAV_LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-sm font-semibold text-neutral-600 hover:bg-rose-50"
              >
                {label}
              </a>
            ))}
            <a href={APP_URL} target="_blank" rel="noreferrer" className="btn-primary mt-2 w-full justify-center">
              Open App <ArrowUpRight size={15} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ═══════════════════════  HERO  ═══════════════════════ */

const TOASTS = [
  { icon: CircleCheck, text: "Quotation approved by Aarav Mehta", c: "text-emerald-500" },
  { icon: FileSpreadsheet, text: "Row synced to Google Sheets", c: "text-green-600" },
  { icon: FileDown, text: "PDF exported — QTF-MQ96Z6UP", c: "text-rose-500" },
  { icon: Send, text: "Quote emailed to aarav@example.com", c: "text-sky-500" },
];

function HeroToasts() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % TOASTS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const { icon: Icon, text, c } = TOASTS[i];
  return (
    <div className="pointer-events-none absolute -top-5 right-3 z-10 sm:right-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: -16, scale: 0.9, rotate: -2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="glass-strong flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[12px] font-semibold text-neutral-600"
        >
          <Icon size={15} className={c} />
          {text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const FLOAT_CHIPS = [
  { icon: FileSpreadsheet, text: "Synced to Sheets", c: "text-green-600", pos: "-left-6 top-16", dur: 5 },
  { icon: FileDown, text: "PDF ready", c: "text-rose-500", pos: "-right-8 top-1/3", dur: 6.5 },
  { icon: CircleCheck, text: "+2 approved this week", c: "text-emerald-500", pos: "-left-10 bottom-16", dur: 5.8 },
];

function Hero() {
  return (
    <section id="top" className="q-hero relative overflow-hidden pb-16 pt-36 sm:pt-44">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="hero-grid absolute inset-0" />
      <Particles count={8} char />
      <Particles count={6} />

      <div className="relative mx-auto max-w-6xl px-4 text-center sm:px-6">
        <Reveal>
          <span className="glass-strong inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-bold text-neutral-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            THE QUOTATION WORKSPACE · BY EXORA TECHNOLOGIES
          </span>
        </Reveal>

        <motion.h1
          aria-label="Better quotes. Less busywork."
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: 0.032, delayChildren: 0.15 }}
          className="mx-auto mt-7 max-w-4xl font-brand text-5xl font-extrabold leading-[1.04] tracking-tight text-[var(--q-ink)] sm:text-6xl lg:text-7xl"
        >
          <SplitWords text="Better quotes." />
          <br />
          <SplitWords text="Less busywork." className="text-gradient-pink-animated" />
        </motion.h1>

        <Reveal delay={0.7}>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-500 sm:text-lg">
            Your fields. Your documents. Your next opportunity.
            Build reusable presets and turn the details into ready-to-share
            quotations, with Sheets, Docs, PDF and email in one workflow.
          </p>
        </Reveal>

        <Reveal delay={0.85}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <a href={APP_URL} target="_blank" rel="noreferrer" className="btn-primary btn-lg glow-pink">
                Open Qyrova <ArrowUpRight size={18} />
              </a>
            </Magnetic>
            <Magnetic strength={9}>
              <a href="#product" className="btn-ghost btn-lg">
                <Eye size={17} /> See it in action
              </a>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={1} y={64}>
          <motion.div
            className="relative mx-auto mt-16 max-w-4xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <HeroToasts />
            {FLOAT_CHIPS.map(({ icon: Icon, text, c, pos, dur }) => (
              <motion.div
                key={text}
                aria-hidden
                className={`glass-strong absolute ${pos} z-10 hidden items-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold text-neutral-600 lg:flex`}
                animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
                transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon size={13} className={c} /> {text}
              </motion.div>
            ))}
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-rose-300/50 via-pink-200/40 to-fuchsia-300/50 blur-3xl" />
            <Tilt3D max={5}>
              <div className="sheen-wrap rounded-2xl" aria-label="Illustrative Qyrova dashboard preview">
                <DashboardMock />
              </div>
            </Tilt3D>
          </motion.div>
        </Reveal>
        <p className="q-demo-label">PRODUCT PREVIEW · SAMPLE DATA, NOT LIVE CUSTOMER RECORDS</p>
      </div>
    </section>
  );
}

/* ═══════════════════════  MARQUEE  ═══════════════════════ */

const MARQUEE_A = [
  "Dynamic Forms", "Google Sheets Sync", "Doc Templates", "1-Click PDF",
  "Email Tracking", "Approve / Decline / Negotiate", "Role-Based Access",
];
const MARQUEE_B = [
  "Live Dashboard", "CSV Export", "Custom Themes", "Cloud Persistence",
  "{{Placeholders}}", "Branded Quotes", "Glass Mode", "Accent Colors",
];

function Marquee() {
  return (
    <div className="marquee-mask relative space-y-3 overflow-hidden border-y border-rose-100/70 bg-white/50 py-5 backdrop-blur-md">
      <div className="marquee flex w-max items-center gap-10">
        {[...MARQUEE_A, ...MARQUEE_A].map((t, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.18em] text-neutral-400">
            {t}
            <span className="text-[var(--q-pink)] animate-[q-twirl_4s_linear_infinite] inline-block">✦</span>
          </span>
        ))}
      </div>
      <div className="marquee-rev flex w-max items-center gap-10">
        {[...MARQUEE_B, ...MARQUEE_B].map((t, i) => (
          <span key={i} className="text-outline-pink flex items-center gap-10 whitespace-nowrap text-[13px] font-extrabold uppercase tracking-[0.18em]">
            {t}
            <span className="text-[var(--q-pink)]/60">✧</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════  FEATURES (kept — user favourite)  ═══════════════════════ */

const FEATURES = [
  {
    Icon: Layers, title: "Form & Preset Builder",
    desc: "Design custom quotation templates with dynamic, reusable fields. Build once, quote forever.",
    c: "bg-rose-100 text-rose-500",
  },
  {
    Icon: LayoutGrid, title: "Live Dashboard",
    desc: "Real-time metrics and status charts for every quotation — approvals, declines and negotiations at a glance.",
    c: "bg-violet-100 text-violet-500",
  },
  {
    Icon: Database, title: "Quotation Database",
    desc: "Browse, search and edit all records pulled live from the cloud. Filter any column, export to CSV.",
    c: "bg-sky-100 text-sky-500",
  },
  {
    Icon: FileText, title: "Doc & PDF Generation",
    desc: "Turn quotation data into polished documents and PDFs instantly — native or via Google Docs templates.",
    c: "bg-amber-100 text-amber-600",
  },
  {
    Icon: Mail, title: "Email Tracking",
    desc: "Send branded quotes and track Approve / Decline / Negotiate replies without leaving the app.",
    c: "bg-emerald-100 text-emerald-600",
  },
  {
    Icon: Shield, title: "Role-Based Access",
    desc: "Owner, Admin, Editor and Doc Viewer permission tiers keep your team exactly where they should be.",
    c: "bg-fuchsia-100 text-fuchsia-500",
  },
];

function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <div className="text-center">
        <Reveal><SectionTag>Six core modules</SectionTag></Reveal>
        <Reveal delay={0.08}>
          <h2 className="mx-auto mt-5 max-w-2xl font-brand text-4xl font-extrabold tracking-tight text-[var(--q-ink)] sm:text-5xl">
            Everything a quote needs, <span className="text-gradient-pink">in one place</span>
          </h2>
        </Reveal>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ Icon, title, desc, c }, i) => (
          <Reveal key={title} delay={0.06 * i}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group h-full rounded-3xl bg-white p-7 shadow-sm ring-1 ring-rose-100/80 transition-shadow hover:shadow-xl hover:shadow-rose-200/40"
            >
              <span className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl ${c} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon size={22} />
              </span>
              <h3 className="font-brand text-lg font-bold text-[var(--q-ink)]">{title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-500">{desc}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════  WORKFLOW (dark + beams + spotlight)  ═══════════════════════ */

const INTEGRATIONS = [
  {
    Icon: FileSpreadsheet, title: "Google Sheets",
    desc: "Every quotation row synced & stored automatically", c: "#34A853",
  },
  {
    Icon: FileText, title: "Google Docs",
    desc: "Generates formatted documents from your templates", c: "#4285F4",
  },
  {
    Icon: FileDown, title: "PDF Export",
    desc: "Exports quotations as ready-to-share PDF files", c: "#F25C5C",
  },
  {
    Icon: Mail, title: "Gmail",
    desc: "Sends quotes & tracks Approve / Decline / Negotiate", c: "#EA8600",
  },
];

function Beams() {
  const paths = [
    "M500,200 C430,200 420,90 340,80",
    "M500,200 C430,200 420,310 340,320",
    "M500,200 C570,200 580,90 660,80",
    "M500,200 C570,200 580,310 660,320",
  ];
  return (
    <svg
      aria-hidden
      viewBox="0 0 1000 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
    >
      <defs>
        <linearGradient id="beamGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e0476b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e0476b" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="rgba(224,71,107,0.18)" strokeWidth="5" />
          <path d={d} fill="none" stroke="url(#beamGrad)" strokeWidth="1.6"
            strokeDasharray="7 9" className="q-beam-dash" />
          <circle r="5" fill="rgba(255,158,184,0.35)">
            <animateMotion dur={`${2.6 + i * 0.5}s`} repeatCount="indefinite" path={d}
              keyPoints="0;1" keyTimes="0;1" calcMode="linear" begin={`${i * 0.6}s`} />
          </circle>
          <circle r="2.5" fill="#fff">
            <animateMotion dur={`${2.6 + i * 0.5}s`} repeatCount="indefinite" path={d}
              keyPoints="0;1" keyTimes="0;1" calcMode="linear" begin={`${i * 0.6 + 0.2}s`} />
          </circle>
        </g>
      ))}
    </svg>
  );
}

function Workflow_() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const { onMouseMove, onMouseLeave, spotlight } = useSpotlight();
  return (
    <section
      id="workflow"
      className="relative overflow-hidden bg-[#16070d] py-24 sm:py-32"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="orb-dark orb-d1" />
      <div className="orb-dark orb-d2" />
      <Particles count={12} className="opacity-70" />
      {spotlight}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6" ref={ref}>
        <div className="text-center">
          <Reveal>
            <span className="glass-dark-chip inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-rose-200">
              <Workflow size={11} /> Connected to your workspace
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mx-auto mt-5 max-w-3xl font-brand text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              One quotation flows into{" "}
              <span className="text-gradient-pink-light">everything</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-rose-100/50">
              Qyrova collects data through dynamic forms, then routes it to every
              connected service — no copy-paste, no exports, no waiting.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-16">
          <Beams />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
            <Reveal className="order-1 lg:order-2" delay={0.1}>
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 mx-auto grid h-44 w-44 place-items-center rounded-full"
              >
                <span className="absolute inset-0 rounded-full bg-[var(--q-pink)]/25 blur-2xl" />
                <span className="q-conic-ring" />
                <span className="pulse-ring" />
                <span className="pulse-ring" style={{ animationDelay: "1.1s" }} />
                <div className="relative grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-[var(--q-pink)] to-[#a82850] shadow-2xl shadow-rose-900/60 ring-4 ring-white/10">
                  <div className="text-center text-white">
                    <Search size={26} strokeWidth={3} className="mx-auto" />
                    <p className="q-heading mt-1 font-brand text-sm font-extrabold">Qyrova</p>
                    <p className="text-[8px] font-semibold uppercase tracking-widest text-rose-100/80">
                      Quotation engine
                    </p>
                  </div>
                </div>
              </motion.div>
            </Reveal>

            <div className="order-2 space-y-4 lg:order-1">
              {INTEGRATIONS.slice(0, 2).map((it, i) => (
                <IntegrationCard key={it.title} {...it} i={i} inView={inView} side="left" />
              ))}
            </div>
            <div className="order-3 space-y-4">
              {INTEGRATIONS.slice(2).map((it, i) => (
                <IntegrationCard key={it.title} {...it} i={i + 2} inView={inView} side="right" />
              ))}
            </div>
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="glass-dark mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl p-5">
            <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-rose-100/70 sm:text-[13px]">
              {["Form filled", "Saved to cloud", "Synced to Sheets", "Doc generated", "Quote emailed"].map((s, i, arr) => (
                <React.Fragment key={s}>
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : {}}
                      transition={{ delay: 0.5 + i * 0.35, type: "spring", stiffness: 260, damping: 16 }}
                      className="grid h-5 w-5 place-items-center rounded-full bg-emerald-400/90 text-[#16070d]"
                    >
                      <Check size={11} strokeWidth={3.5} />
                    </motion.span>
                    <span className="hidden sm:inline">{s}</span>
                  </span>
                  {i < arr.length - 1 && (
                    <span className="flow-line relative h-[2px] flex-1 overflow-hidden rounded bg-white/10" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function IntegrationCard({ Icon, title, desc, c, i, inView, side }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -36 : 36 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.25 + i * 0.12, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.04, rotate: side === "left" ? -0.5 : 0.5 }}
      className="glass-dark sheen-wrap relative z-10 flex items-center gap-4 rounded-2xl p-5 transition-colors hover:bg-white/10"
    >
      <motion.span
        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
        style={{ background: `${c}22`, color: c }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.6 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon size={22} />
      </motion.span>
      <div>
        <p className="q-heading font-brand text-[15px] font-bold text-white">{title}</p>
        <p className="text-[12.5px] leading-snug text-rose-100/50">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════  PRODUCT TOUR  ═══════════════════════ */

const TOUR = [
  { key: "dashboard", label: "Dashboard", Icon: LayoutGrid, Mock: DashboardMock,
    blurb: "Real-time metrics, a live status donut and your latest quotation — the moment you log in." },
  { key: "presets", label: "Presets", Icon: Layers, Mock: PresetsMock,
    blurb: "Reusable quotation templates with linked Sheets & Docs. One click on “Use” starts a new quote." },
  { key: "database", label: "Database", Icon: Database, Mock: DatabaseMock,
    blurb: "Every record pulled live from Google Sheets. Search, filter any column, load, view, delete, export CSV." },
  { key: "docview", label: "Doc View", Icon: FileText, Mock: DocViewMock,
    blurb: "Native document editor with {{placeholders}}, logo & banner upload — or compare the Google Doc version." },
  { key: "email", label: "Email", Icon: Mail, Mock: EmailMock,
    blurb: "Send a branded quotation email for any saved record, then track Approve / Decline / Negotiate replies." },
  { key: "settings", label: "Settings", Icon: Settings, Mock: SettingsMock,
    blurb: "Light, Dark and Glass themes, custom accent colors and profile management." },
];

function ProductTour() {
  const [active, setActive] = useState("dashboard");
  const cur = TOUR.find((t) => t.key === active);
  return (
    <section id="product" className="relative mx-auto max-w-6xl overflow-visible px-4 py-24 sm:px-6 sm:py-32">
      <Particles count={6} char className="opacity-60" />
      <div className="text-center">
        <Reveal><SectionTag>Product tour</SectionTag></Reveal>
        <Reveal delay={0.08}>
          <h2 className="mx-auto mt-5 max-w-2xl font-brand text-4xl font-extrabold tracking-tight text-[var(--q-ink)] sm:text-5xl">
            A closer look. <span className="text-gradient-pink">Every step.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-4 max-w-xl text-[15px] text-neutral-500">
            Explore illustrative previews of Qyrova's core tools. Sample records are for demonstration only.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {TOUR.map(({ key, label, Icon }) => (
            <motion.button
              key={key}
              onClick={() => setActive(key)}
              aria-pressed={active === key}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.94 }}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-bold transition-colors ${
                active === key ? "text-white" : "glass-chip text-neutral-500 hover:text-[var(--q-pink-deep)]"
              }`}
            >
              {active === key && (
                <motion.span
                  layoutId="tour-pill"
                  className="absolute inset-0 rounded-full bg-[var(--q-pink)] shadow-lg shadow-rose-300/50"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                <Icon size={14} /> {label}
              </span>
            </motion.button>
          ))}
        </div>
      </Reveal>

      <div className="relative mx-auto mt-10 max-w-4xl">
        <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-rose-200/60 via-transparent to-fuchsia-200/60 blur-2xl" />
        <Tilt3D max={3.5}>
          <div className="overflow-hidden rounded-3xl shadow-2xl shadow-rose-200/60 ring-1 ring-white/60">
            <div className="glass-strong flex items-center gap-2 border-b border-rose-100/50 px-5 py-3">
              <motion.span whileHover={{ scale: 1.3 }} className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <motion.span whileHover={{ scale: 1.3 }} className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <motion.span whileHover={{ scale: 1.3 }} className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="mx-auto flex items-center gap-1.5 rounded-lg bg-white/70 px-4 py-1 text-[11px] font-semibold text-neutral-400 ring-1 ring-rose-100/60 backdrop-blur">
                <Shield size={10} className="text-emerald-500" />
                qyrova.spandan305.workers.dev
              </span>
              <span className="w-14" />
            </div>
            <div className="relative bg-[#FFF2F5]/90 p-3 backdrop-blur-sm sm:p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 22, scale: 0.975, rotateX: -6 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, y: -22, scale: 0.975, rotateX: 6 }}
                  transition={{ duration: 0.4, ease: [0.21, 0.6, 0.35, 1] }}
                  style={{ transformPerspective: 1000 }}
                >
                  <cur.Mock className="!shadow-none !rounded-xl" />
                </motion.div>
              </AnimatePresence>
              <AnimatePresence>
                <motion.div
                  key={active + "-sheen"}
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  initial={{ x: "-110%" }}
                  animate={{ x: "110%" }}
                  transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                  style={{
                    background:
                      "linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)",
                  }}
                />
              </AnimatePresence>
            </div>
          </div>
        </Tilt3D>
        <AnimatePresence mode="wait">
          <motion.p
            key={active + "-blurb"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-6 flex max-w-xl items-start justify-center gap-2 text-center text-[14px] leading-relaxed text-neutral-500"
          >
            <MousePointerClick size={16} className="mt-0.5 shrink-0 text-[var(--q-pink)]" />
            {cur.blurb}
          </motion.p>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ═══════════════════════  THEMES (+ live accent picker)  ═══════════════════════ */

const ACCENTS = [
  "#681b24", "#8B7CF6", "#A78BFA", "#7CA6F6", "#5FA8C7", "#7C8CF6", "#5BC8CE",
  "#5FBF8F", "#e0476b", "#D9A03F", "#E07A47", "#C75FAE", "#8E8E93",
  "#5E81AC", "#B48EAD",
];

function Themes() {
  const [theme, setTheme] = useState("light");
  const [accent, setAccent] = useState("#681b24");
  const opts = [
    ["light", "Light", Sun],
    ["dark", "Dark", Moon],
    ["glass", "Glass", Sparkles],
  ];
  return (
    <section id="themes" className="relative overflow-hidden bg-white/60 py-24 backdrop-blur-sm sm:py-28">
      <div className="orb orb-2" style={{ top: "10%", left: "auto", right: "-180px" }} />
      <Particles count={5} char className="opacity-50" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <Reveal><SectionTag>Make it yours</SectionTag></Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-5 font-brand text-4xl font-extrabold tracking-tight text-[var(--q-ink)] sm:text-5xl">
              Three themes.
              <br />
              <span className="text-gradient-pink">Your own look.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-neutral-500">
              Qyrova ships with Light, Dark and Glass modes plus a full accent
              palette — so your quotation workspace matches your brand, not the
              other way round. <strong className="text-[var(--q-ink)]">Try both — they're live:</strong>
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="glass-chip mt-7 flex w-fit gap-1.5 rounded-2xl p-1.5">
              {opts.map(([key, label, Icon]) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  aria-pressed={theme === key}
                  className={`relative flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13.5px] font-bold transition-colors ${
                    theme === key ? "text-[var(--q-ink)]" : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  {theme === key && (
                    <motion.span
                      layoutId="theme-pill"
                      className="absolute inset-0 rounded-xl bg-white shadow-md ring-1 ring-rose-100"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon size={15} /> {label}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-5 flex max-w-md flex-wrap gap-2">
              {ACCENTS.map((c, i) => (
                <motion.button
                  key={c}
                  onClick={() => setAccent(c)}
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  whileTap={{ scale: 0.85 }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.03 * i, type: "spring", stiffness: 320, damping: 16 }}
                  aria-label={`Accent ${c}`}
                  aria-pressed={accent === c}
                  className={`grid h-7 w-7 place-items-center rounded-full shadow-sm transition-shadow ${
                    accent === c ? "ring-2 ring-offset-2" : "hover:shadow-md"
                  }`}
                  style={{ background: c, "--tw-ring-color": c }}
                >
                  {accent === c && <Check size={12} strokeWidth={3.5} className="text-white" />}
                </motion.button>
              ))}
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.15} y={48}>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ "--q-pink": accent }}
          >
            <Tilt3D max={6}>
              <ThemedMiniDash theme={theme} />
            </Tilt3D>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════  ROLES  ═══════════════════════ */

const ROLES = [
  { Icon: Crown, title: "Owner", c: "from-rose-700 to-pink-800",
    perks: ["Full workspace control", "Manage users & roles", "All presets & data", "Personalise settings"] },
  { Icon: Shield, title: "Admin", c: "from-pink-700 to-rose-900",
    perks: ["Manage presets", "Edit quotations", "Send & track emails", "Manage teammates"] },
  { Icon: Edit3, title: "Editor", c: "from-fuchsia-700 to-pink-900",
    perks: ["Create quotations", "Fill dynamic forms", "Edit quotations", "No record deletion"] },
  { Icon: Eye, title: "Doc Viewer", c: "from-rose-800 to-pink-950",
    perks: ["Document view access", "Personalise settings", "No quotation editing", "No team management"] },
];

function Roles() {
  return (
    <section id="roles" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
      <Particles count={5} className="opacity-60" />
      <div className="text-center">
        <Reveal><SectionTag>Built for teams</SectionTag></Reveal>
        <Reveal delay={0.08}>
          <h2 className="mx-auto mt-5 max-w-2xl font-brand text-4xl font-extrabold tracking-tight text-[var(--q-ink)] sm:text-5xl">
            Four tiers. <span className="text-gradient-pink">Zero chaos.</span>
          </h2>
        </Reveal>
      </div>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map(({ Icon, title, c, perks }, i) => (
          <Reveal key={title} delay={0.07 * i}>
            <motion.div
              whileHover={{ y: -8, rotate: i % 2 ? 0.6 : -0.6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="sheen-wrap h-full overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-rose-100/80 hover:shadow-xl hover:shadow-rose-200/50"
            >
              <div className={`relative overflow-hidden bg-gradient-to-br ${c} p-5 text-white`}>
                <motion.span
                  aria-hidden
                  className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/15"
                  animate={{ scale: [1, 1.35, 1] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  animate={{ rotate: [0, -8, 8, 0] }}
                  transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block"
                >
                  <Icon size={22} />
                </motion.span>
                <p className="q-heading mt-3 font-brand text-lg font-extrabold">{title}</p>
              </div>
              <ul className="space-y-2.5 p-5">
                {perks.map((p, pi) => (
                  <motion.li
                    key={p}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + pi * 0.08 }}
                    className="flex items-start gap-2 text-[13px] font-medium text-neutral-500"
                  >
                    <Check size={14} className="mt-0.5 shrink-0 text-emerald-500" strokeWidth={3} />
                    {p}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="glass-strong mt-20 grid grid-cols-2 gap-6 rounded-3xl p-10 sm:grid-cols-4">
          {[
            [6, "Core modules"],
            [4, "Google integrations"],
            [4, "Permission tiers"],
            [3, "Theme modes"],
          ].map(([n, l]) => (
            <motion.div key={l} whileHover={{ scale: 1.08 }} className="text-center">
              <p className="q-heading font-brand text-5xl font-extrabold text-gradient-pink">
                <Counter to={n} duration={1.6} />
              </p>
              <p className="mt-1 text-[12.5px] font-bold uppercase tracking-wider text-neutral-400">{l}</p>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ═══════════════════════  FAQ  ═══════════════════════ */

const FAQS = [
  ["What exactly is Qyrova?",
   "Qyrova is a dynamic quotation builder by Exora Technologies. You design quotation presets with custom fields, fill them through smart forms, and Qyrova handles storage, document generation, PDFs and email delivery automatically."],
  ["How does the Google Sheets sync work?",
   "Each preset can be linked to a Google Sheet tab. Every quotation you save is written to that sheet as a row in real time — the Database view in Qyrova reads live from the same sheet, so your data is always in one place."],
  ["Can I generate PDFs without Google Docs?",
   "Yes. Qyrova has a native document engine with {{placeholder}} fields, logo and banner support that exports straight to PDF. If you prefer, link a Google Doc template instead and Qyrova fills it for you."],
  ["How does email tracking work?",
   "Send a branded quotation email for any saved record. The customer gets Approve / Decline / Negotiate actions, and their response updates the quotation status on your dashboard automatically."],
  ["Can I control what my team can do?",
   "Yes — Qyrova has four permission tiers: Owner, Admin, Editor and Doc Viewer. Each tier scopes exactly what a user can create, edit or view."],
  ["Does Qyrova support custom themes?",
   "Light, Dark and Glass modes ship out of the box, plus a palette of accent colors. Your workspace, your look."],
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="relative mx-auto max-w-3xl px-4 py-24 sm:px-6 sm:py-28">
      <div className="text-center">
        <Reveal><SectionTag>Questions</SectionTag></Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-5 font-brand text-4xl font-extrabold tracking-tight text-[var(--q-ink)] sm:text-5xl">
            Asked & <span className="text-gradient-pink">answered</span>
          </h2>
        </Reveal>
      </div>
      <div className="mt-12 space-y-3">
        {FAQS.map(([q, a], i) => (
          <Reveal key={q} delay={0.05 * i}>
            <motion.div
              whileHover={{ scale: open === i ? 1 : 1.012 }}
              className={`glass-strong overflow-hidden rounded-2xl transition-shadow ${
                open === i ? "shadow-lg shadow-rose-200/40 ring-1 ring-rose-200" : ""
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                aria-expanded={open === i}
                aria-controls={open === i ? `faq-answer-${i}` : undefined}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-brand text-[15.5px] font-bold text-[var(--q-ink)]">{q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0, scale: open === i ? 1.1 : 1 }}
                  transition={{ duration: 0.25 }}
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                    open === i ? "bg-[var(--q-pink)] text-white" : "bg-rose-50 text-[var(--q-pink)]"
                  }`}
                >
                  <ChevronDown size={15} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <p id={`faq-answer-${i}`} className="px-6 pb-5 text-[14px] leading-relaxed text-neutral-500">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════  CTA + FOOTER  ═══════════════════════ */

function Cta({ onCelebrate }) {
  const { onMouseMove, onMouseLeave, spotlight } = useSpotlight();
  return (
    <section
      className="relative overflow-hidden bg-[#16070d] py-24 sm:py-32"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="orb-dark orb-d1" />
      <div className="orb-dark orb-d3" />
      <Particles count={14} className="opacity-80" />
      <Particles count={6} char className="opacity-40" />
      {spotlight}
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <motion.button
            onClick={onCelebrate}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: [0, 6, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto mb-8 grid h-20 w-20 cursor-pointer place-items-center rounded-3xl bg-gradient-to-br from-[var(--q-pink)] to-[#a82850] text-white shadow-2xl shadow-rose-900/50"
            title="Click for confetti 🎉"
          >
            <span className="q-conic-ring !rounded-3xl" />
            <Search size={34} strokeWidth={3} />
          </motion.button>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="font-brand text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Your next quote.
            <br />
            <span className="text-gradient-pink-light">A better start.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-lg text-[15.5px] leading-relaxed text-rose-100/50">
            Open Qyrova, pick a preset, fill the form — and let Sheets, Docs,
            PDF and Gmail do the rest.
          </p>
        </Reveal>
        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <a href={APP_URL} target="_blank" rel="noreferrer" className="btn-primary btn-lg glow-pink">
                <Zap size={17} /> Launch Qyrova — it's live
              </a>
            </Magnetic>
            <Magnetic strength={9}>
              <a href="#features" className="btn-dark-ghost btn-lg">
                Re-read the features <ArrowRight size={16} />
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="glass-strong border-t border-rose-100/60 py-12 !rounded-none">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:flex-row">
        <div className="flex flex-col items-center gap-1 lg:items-start">
          <QyrovaLogo size={26} className="text-base text-[var(--q-ink)]" />
          <p className="text-[12px] text-neutral-400">
            Dynamic Quotation Builder · An Exora Technologies product
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {NAV_LINKS.map(([label, href]) => (
            <a key={href} href={href}
              className="rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-neutral-400 transition-all hover:-translate-y-0.5 hover:text-[var(--q-pink-deep)]">
              {label}
            </a>
          ))}
        </div>
        <a href={APP_URL} target="_blank" rel="noreferrer"
          className="flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--q-pink-deep)] hover:underline">
          Open the app <ArrowUpRight size={13} />
        </a>
      </div>
      <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-[11px] text-neutral-300">
        © 2026 Exora Technologies. Crafted with motion, pixels &
        <motion.span
          animate={{ scale: [1, 1.35, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block text-[var(--q-pink)]"
        >
          <Heart size={11} fill="currentColor" />
        </motion.span>
        attention to detail.
      </p>
    </footer>
  );
}

/* ═══════════════════════  ROOT  ═══════════════════════ */

export default function QyrovaSite() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  const { fire, layer } = useConfetti();
  return (
    <MotionConfig reducedMotion="user"><div className="qyrova-site min-h-screen overflow-x-hidden">
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-[var(--q-pink)] via-pink-400 to-fuchsia-400"
        style={{ scaleX }}
      />
      {layer}
      <Nav onLogoClick={fire} />
      <Hero />
      <Marquee />
      <Features />
      <Workflow_ />
      <ProductTour />
      <Themes />
      <Roles />
      <Faq />
      <Cta onCelebrate={fire} />
      <Footer />
    </div></MotionConfig>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import {
  LayoutGrid, Layers, Database, FileText, Mail, Users, Settings,
  Bell, Search, Plus, RefreshCw, Download, Eye, Trash2, Pencil,
  ExternalLink, Copy, EyeOff, Sun, Moon, Sparkles, Upload,
  FileSpreadsheet, ArrowRight, Clock, CircleCheck, CircleX,
  MessageSquare, Files, Edit3, Save, Image as ImageIcon, FileSignature,
} from "lucide-react";

/* ─────────────────────────  shared bits  ───────────────────────── */

export function Counter({ to, duration = 1.2, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref} className={className}>
      {val}
    </span>
  );
}

export function QyrovaLogo({ size = 22, className = "" }) {
  return (
    <span className={`q-logo inline-flex items-center gap-1.5 ${className}`}>
      <span
        className="grid place-items-center rounded-full bg-[var(--q-pink)] text-white"
        style={{ width: size, height: size }}
      >
        <Search size={size * 0.55} strokeWidth={3} />
      </span>
      <span className="font-brand font-bold tracking-tight text-[1.05em]">
        Qyrova
      </span>
    </span>
  );
}

const NAV_ITEMS = [
  ["Dashboard", LayoutGrid],
  ["Presets", Layers],
  ["Database", Database],
  ["Doc View", FileText],
  ["Email", Mail],
  ["Users", Users],
  ["Settings", Settings],
];

function MiniSidebar({ active }) {
  return (
    <div className="hidden md:flex w-[148px] shrink-0 flex-col border-r border-rose-100 bg-white/70 p-2.5">
      <div className="px-1.5 pb-3 pt-1">
        <QyrovaLogo size={18} className="text-[12px] text-[var(--q-ink)]" />
      </div>
      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map(([label, Icon]) => (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-[7px] text-[10.5px] font-semibold transition-colors ${
              active === label
                ? "bg-[var(--q-pink)] text-white shadow-sm shadow-rose-200"
                : "text-neutral-500"
            }`}
          >
            <Icon size={12} />
            {label}
          </div>
        ))}
      </div>
      <div className="mt-auto flex items-center gap-2 rounded-xl bg-rose-50 px-2 py-1.5">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--q-pink)] text-[8px] font-bold text-white">
          S
        </span>
        <span className="leading-tight">
          <span className="block text-[8.5px] font-bold text-neutral-700">
            Sample workspace
          </span>
          <span className="block text-[7.5px] text-neutral-400">Owner</span>
        </span>
      </div>
    </div>
  );
}

function Frame({ active, children, className = "" }) {
  return (
    <div
      className={`q-mock-frame flex overflow-hidden rounded-2xl border border-rose-100 bg-[#FFF7F9] text-left shadow-xl shadow-rose-100/60 ${className}`}
    >
      <MiniSidebar active={active} />
      <div className="min-w-0 flex-1 p-4">{children}</div>
    </div>
  );
}

function ScreenHeader({ title, sub, children }) {
  return (
    <div className="mb-3 flex items-start justify-between gap-2">
      <div>
        <h4 className="font-brand text-[15px] font-bold text-[var(--q-ink)]">
          {title}
        </h4>
        <p className="text-[9.5px] text-neutral-400">{sub}</p>
      </div>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

const pillBtn =
  "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-semibold";

/* ─────────────────────────  DASHBOARD  ───────────────────────── */

const R = 30;
const CIRC = 2 * Math.PI * R;

function Donut() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  return (
    <div ref={ref} className="relative h-[88px] w-[88px] shrink-0">
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="#F3E2E7" strokeWidth="11" />
        <motion.circle
          cx="40" cy="40" r={R} fill="none" stroke="#4CAF7D" strokeWidth="11"
          strokeLinecap="butt" strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={inView ? { strokeDashoffset: CIRC / 2 } : {}}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
        />
        <motion.circle
          cx="40" cy="40" r={R} fill="none" stroke="#E05A5A" strokeWidth="11"
          strokeLinecap="butt" strokeDasharray={`${CIRC / 2} ${CIRC}`}
          initial={{ strokeDashoffset: -CIRC, opacity: 0 }}
          animate={inView ? { strokeDashoffset: -CIRC / 2, opacity: 1 } : {}}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.35 }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center leading-none">
          <span className="block text-[17px] font-extrabold text-[var(--q-ink)]">
            <Counter to={4} />
          </span>
          <span className="text-[7.5px] text-neutral-400">Total</span>
        </div>
      </div>
    </div>
  );
}

const DASH_STATS = [
  { n: 4, label: "Total quotations", Icon: Files, c: "text-rose-500 bg-rose-50" },
  { n: 2, label: "Approved", Icon: CircleCheck, c: "text-emerald-500 bg-emerald-50" },
  { n: 2, label: "Declined", Icon: CircleX, c: "text-red-500 bg-red-50" },
  { n: 0, label: "Negotiation", Icon: MessageSquare, c: "text-amber-500 bg-amber-50" },
  { n: 0, label: "Pending", Icon: Clock, c: "text-neutral-400 bg-neutral-100" },
];

export function DashboardMock({ className = "" }) {
  return (
    <Frame active="Dashboard" className={className}>
      <ScreenHeader
        title="Welcome to Qyrova"
        sub="Design custom quotation presets, collect data through dynamic forms, and sync to Google Sheets & Docs."
      >
        <button className={`${pillBtn} bg-white text-neutral-500 ring-1 ring-rose-100`}>
          <RefreshCw size={9} /> Refresh
        </button>
        <button className={`${pillBtn} bg-[var(--q-pink)] text-white shadow-sm shadow-rose-200`}>
          <Plus size={9} /> New Preset
        </button>
      </ScreenHeader>

      <div className="mb-3 grid grid-cols-3 gap-2 lg:grid-cols-5">
        {DASH_STATS.map(({ n, label, Icon, c }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 * i, duration: 0.45 }}
            className="flex items-center gap-2 rounded-xl bg-white p-2.5 ring-1 ring-rose-50"
          >
            <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg ${c}`}>
              <Icon size={12} />
            </span>
            <span className="leading-tight">
              <span className="block text-[13px] font-extrabold text-[var(--q-ink)]">
                <Counter to={n} />
              </span>
              <span className="block text-[7.5px] text-neutral-400">{label}</span>
            </span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-3 ring-1 ring-rose-50">
          <p className="mb-2 text-[10px] font-bold text-neutral-700">
            Status distribution
          </p>
          <div className="flex items-center gap-3">
            <Donut />
            <div className="flex-1 space-y-1.5">
              {[
                ["Approved", "#4CAF7D", 2],
                ["Declined", "#E05A5A", 2],
                ["Negotiated", "#D9A03F", 0],
                ["Pending", "#9AA0A6", 0],
              ].map(([l, c, v]) => (
                <div key={l} className="flex items-center gap-1.5 text-[8.5px]">
                  <span className="h-1.5 w-1.5 rounded-[2px]" style={{ background: c }} />
                  <span className="text-neutral-500">{l}</span>
                  <span className="ml-auto font-bold text-neutral-700">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-3 ring-1 ring-rose-50">
          <p className="mb-2 text-[10px] font-bold text-neutral-700">Latest quotation</p>
          <p className="font-brand text-[13px] font-extrabold tracking-wide text-[var(--q-pink)]">
            QTF-MQ96Z6UP-IXGGBM
          </p>
          <div className="mt-2 space-y-1 text-[8.5px] text-neutral-500">
            <p className="flex items-center gap-1.5">
              <Layers size={9} /> Project Quotation
            </p>
            <p className="flex items-center gap-1.5">
              <Clock size={9} /> 6/11/2026, 1:14:25 PM
            </p>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-bold text-neutral-700">Your presets</p>
          <span className="flex items-center gap-1 text-[8.5px] font-semibold text-neutral-400">
            Manage <ArrowRight size={8} />
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            ["Project Quotation", "A general-purpose project quotation", "10 fields"],
            ["Service Quotation", "For service-based engagements.", "7 fields"],
          ].map(([t, d, f]) => (
            <div key={t} className="rounded-xl bg-white p-2.5 ring-1 ring-rose-50">
              <span className="rounded-full bg-rose-50 px-1.5 py-0.5 text-[7px] font-bold text-[var(--q-pink)]">
                {f}
              </span>
              <p className="mt-1 text-[10px] font-bold text-[var(--q-ink)]">{t}</p>
              <p className="text-[8px] text-neutral-400">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ─────────────────────────  PRESETS  ───────────────────────── */

export function PresetsMock({ className = "" }) {
  const rows = [
    {
      t: "Project Quotation", d: "A general-purpose project quotation",
      fields: "10 fields", tab: "Tab: Project Quotation", sheet: true, doc: true,
    },
    {
      t: "Service Quotation", d: "For service-based engagements.",
      fields: "7 fields", tab: "Tab: Service Quotation", sheet: false, doc: false,
    },
  ];
  return (
    <Frame active="Presets" className={className}>
      <ScreenHeader title="Presets" sub="Create and manage your quotation templates.">
        <button className={`${pillBtn} bg-[var(--q-pink)] text-white shadow-sm shadow-rose-200`}>
          <Plus size={9} /> New Preset
        </button>
      </ScreenHeader>
      <div className="space-y-2.5">
        {rows.map((r, i) => (
          <motion.div
            key={r.t}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.45 }}
            className="rounded-xl bg-white p-3 ring-1 ring-rose-50"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold text-[var(--q-ink)]">{r.t}</p>
                <p className="text-[8.5px] text-neutral-400">{r.d}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className={`${pillBtn} text-neutral-400`}>
                  <ExternalLink size={8} /> Sheet
                </span>
                <span className={`${pillBtn} text-neutral-400`}>
                  <ExternalLink size={8} /> Doc
                </span>
                <button className={`${pillBtn} bg-rose-50 text-[var(--q-pink)]`}>Use</button>
                <button className="grid h-5 w-5 place-items-center rounded-md text-neutral-400 ring-1 ring-rose-100">
                  <Pencil size={8} />
                </button>
                <button className="grid h-5 w-5 place-items-center rounded-md text-neutral-400 ring-1 ring-rose-100">
                  <Trash2 size={8} />
                </button>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[8px]">
              <span className="flex items-center gap-1 text-neutral-400">
                <FileText size={8} /> {r.fields}
              </span>
              <span className="flex items-center gap-1 text-neutral-400">
                <Files size={8} /> {r.tab}
              </span>
              <span className={`flex items-center gap-1 font-semibold ${r.sheet ? "text-emerald-500" : "text-neutral-300"}`}>
                <FileSpreadsheet size={8} /> {r.sheet ? "Sheet linked" : "No sheet"}
              </span>
              <span className={`flex items-center gap-1 font-semibold ${r.doc ? "text-emerald-500" : "text-neutral-300"}`}>
                <FileText size={8} /> {r.doc ? "Doc linked" : "No doc"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Frame>
  );
}

/* ─────────────────────────  DATABASE  ───────────────────────── */

export const DB_ROWS = [
  ["QTF-MQ71VGAG-UU5WAF", "Google Doc", "Priya Sharma", "Aluminium Sheets", "2026-06-09"],
  ["QTF-MQ79JN5P-62PBXU", "Native PDF", "Rohan Verma", "Wooden sheets", "2026-06-09"],
  ["QTF-MQ7LSPOQ-AZ2KE1", "Native PDF", "Ananya Iyer", "Aluminium Sheets", "2026-06-10"],
  ["QTF-MQ96Z6UP-IXGGBM", "Google Doc", "Aarav Mehta", "Wooden closet", "2026-06-11"],
];

export function DatabaseMock({ className = "" }) {
  return (
    <Frame active="Database" className={className}>
      <ScreenHeader title="Database" sub="Browse data saved to each preset's linked Google Sheet.">
        <span className="rounded-lg bg-white px-2 py-1 text-[8.5px] font-semibold text-neutral-500 ring-1 ring-rose-100">
          Project Quotation ▾
        </span>
        <button className={`${pillBtn} bg-white text-[var(--q-pink)] ring-1 ring-rose-100`}>
          <RefreshCw size={9} /> Refresh
        </button>
      </ScreenHeader>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[8.5px] text-neutral-400 ring-1 ring-rose-100">
          <Search size={9} /> Search across all columns…
        </div>
        <button className={`${pillBtn} bg-white text-[var(--q-pink)] ring-1 ring-rose-100`}>
          <Download size={9} /> Export CSV
        </button>
      </div>
      <p className="mb-1.5 text-[8px] text-neutral-400">4 of 4 records</p>
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-rose-50">
        <div className="grid grid-cols-[1.4fr_0.9fr_1.5fr_1fr_1fr] gap-2 border-b border-rose-50 px-2.5 py-1.5 text-[8px] font-bold text-neutral-500">
          <span>Actions</span><span>Document</span><span>Quotation ID</span>
          <span>Customer</span><span>Created</span>
        </div>
        {DB_ROWS.map(([id, doc, name, , date], i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 * i, duration: 0.35 }}
            className="grid grid-cols-[1.4fr_0.9fr_1.5fr_1fr_1fr] items-center gap-2 border-b border-rose-50/70 px-2.5 py-1.5 text-[8px] last:border-0"
          >
            <span className="flex gap-1">
              <span className={`${pillBtn} !px-1.5 !py-0.5 bg-rose-50 text-[var(--q-pink)]`}>
                <Edit3 size={7} /> Load
              </span>
              <span className={`${pillBtn} !px-1.5 !py-0.5 bg-rose-50 text-[var(--q-pink)]`}>
                <Eye size={7} /> View
              </span>
              <span className={`${pillBtn} !px-1.5 !py-0.5 bg-red-50 text-red-400`}>
                <Trash2 size={7} /> Delete
              </span>
            </span>
            <span>
              <span className={`rounded-full px-1.5 py-0.5 text-[7px] font-bold ring-1 ${
                doc === "Google Doc"
                  ? "bg-blue-50 text-blue-500 ring-blue-100"
                  : "bg-rose-50 text-[var(--q-pink)] ring-rose-100"
              }`}>
                {doc}
              </span>
            </span>
            <span className="truncate font-semibold text-neutral-600">{id}</span>
            <span className="truncate text-neutral-500">{name}</span>
            <span className="text-neutral-400">{date}</span>
          </motion.div>
        ))}
      </div>
    </Frame>
  );
}

/* ─────────────────────────  DOC VIEW  ───────────────────────── */

export function DocViewMock({ className = "" }) {
  const fields = [
    ["Customer Name", "{{Customer Name}}"],
    ["Customer Email", "{{Customer Email}}"],
    ["Product Name", "{{Product Name}}"],
    ["Quantity", "{{Quantity}}"],
    ["Unit Price", "{{Unit Price}}"],
  ];
  return (
    <Frame active="Doc View" className={className}>
      <ScreenHeader title="Doc View" sub="Compare the native Qyrova document with the linked Google Doc version.">
        <span className="rounded-lg bg-white px-2 py-1 text-[8.5px] font-semibold text-neutral-500 ring-1 ring-rose-100">
          Project Quotation ▾
        </span>
      </ScreenHeader>
      <div className="mb-2 flex gap-1 rounded-xl bg-white p-1 ring-1 ring-rose-100 w-fit">
        <span className="rounded-lg bg-[var(--q-ink)] px-2.5 py-1 text-[8.5px] font-bold text-white">
          Native Version
        </span>
        <span className="px-2.5 py-1 text-[8.5px] font-semibold text-neutral-400">
          Google Doc Version
        </span>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 p-3 ring-1 ring-rose-100">
        <div className="mb-2 flex items-center justify-between">
          <QyrovaLogo size={16} className="text-[11px] text-[var(--q-ink)]" />
          <span className={`${pillBtn} bg-white/70 text-[var(--q-pink)]`}>
            <Upload size={8} /> Upload Logo
          </span>
        </div>
        <span className={`${pillBtn} mb-2 bg-white/70 text-[var(--q-pink)]`}>
          <ImageIcon size={8} /> Add banner
        </span>
        <div className="mb-2 flex items-center justify-between rounded-lg bg-white/60 px-2 py-1.5">
          <p className="text-[9px] text-neutral-500">
            Quotation No.{" "}
            <span className="font-mono font-bold text-[var(--q-ink)]">
              {"{{Quotation ID}}"}
            </span>
          </p>
          <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[7px] font-bold text-[var(--q-pink)]">
            Project Quotation
          </span>
        </div>
        <div className="overflow-hidden rounded-lg bg-white/80">
          <div className="grid grid-cols-[1fr_1.3fr_auto] gap-2 border-b border-rose-100 px-2.5 py-1.5 text-[7.5px] font-bold uppercase tracking-wide text-neutral-400">
            <span>Field name</span><span>Placeholder</span><span />
          </div>
          {fields.map(([f, p], i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 * i }}
              className="grid grid-cols-[1fr_1.3fr_auto] items-center gap-2 border-b border-rose-50 px-2.5 py-1.5 text-[8.5px] last:border-0"
            >
              <span className="font-semibold text-neutral-600">{f}</span>
              <span className="flex items-center gap-1">
                <code className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-[7.5px] text-[var(--q-pink)]">
                  {p}
                </code>
                <Copy size={8} className="text-neutral-300" />
              </span>
              <EyeOff size={9} className="text-neutral-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ─────────────────────────  EMAIL  ───────────────────────── */

export function EmailMock({ className = "" }) {
  return (
    <Frame active="Email" className={className}>
      <ScreenHeader title="Email" sub="Send a branded quotation email for any saved record.">
        <span className="rounded-lg bg-white px-2 py-1 text-[8.5px] font-semibold text-neutral-500 ring-1 ring-rose-100">
          Project Quotation ▾
        </span>
        <button className={`${pillBtn} bg-white text-[var(--q-pink)] ring-1 ring-rose-100`}>
          <RefreshCw size={9} /> Refresh
        </button>
      </ScreenHeader>
      <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[8.5px] text-neutral-400 ring-1 ring-rose-100">
        <Search size={9} /> Search across all columns…
      </div>
      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-rose-50">
        <div className="grid grid-cols-[0.8fr_1.6fr_1.2fr_1.4fr] gap-2 border-b border-rose-50 px-2.5 py-1.5 text-[8px] font-bold text-neutral-500">
          <span>Actions</span><span>Quotation ID</span><span>Customer</span><span>Email</span>
        </div>
        {[
          ["QTF-MQ71VGAG-UU5WAF", "Priya Sharma", "priya.sharma@example.com"],
          ["QTF-MQ79JN5P-62PBXU", "Rohan Verma", "rohan.verma@example.com"],
          ["QTF-MQ7LSPOQ-AZ2KE1", "Ananya Iyer", "ananya.iyer@example.com"],
          ["QTF-MQ96Z6UP-IXGGBM", "Aarav Mehta", "aarav.mehta@example.com"],
        ].map(([id, name, email], i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.07 * i, duration: 0.35 }}
            className="grid grid-cols-[0.8fr_1.6fr_1.2fr_1.4fr] items-center gap-2 border-b border-rose-50/70 px-2.5 py-1.5 text-[8px] last:border-0"
          >
            <span>
              <span className={`${pillBtn} !px-1.5 !py-0.5 bg-rose-50 text-[var(--q-pink)]`}>
                <Mail size={7} /> Email
              </span>
            </span>
            <span className="truncate font-semibold text-neutral-600">{id}</span>
            <span className="truncate text-neutral-500">{name}</span>
            <span className="truncate text-neutral-400">{email}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-3 rounded-xl bg-white p-2 ring-1 ring-rose-50">
        {[
          ["Approve", "bg-emerald-50 text-emerald-600"],
          ["Decline", "bg-red-50 text-red-500"],
          ["Negotiate", "bg-amber-50 text-amber-600"],
        ].map(([l, c]) => (
          <span key={l} className={`rounded-full px-2.5 py-1 text-[8px] font-bold ${c}`}>
            {l}
          </span>
        ))}
        <span className="text-[8px] text-neutral-400">← replies tracked automatically</span>
      </div>
    </Frame>
  );
}

/* ─────────────────────────  SETTINGS  ───────────────────────── */

export function SettingsMock({ className = "" }) {
  const swatches = [
    "#8B7CF6", "#A78BFA", "#7CA6F6", "#6FA3B8", "#7C8CF6", "#7CD4D9",
    "#6FBF8F", "#E05D7A", "#D9B36A", "#9AA0A6", "#8B939B",
  ];
  return (
    <Frame active="Settings" className={className}>
      <ScreenHeader title="Settings" sub="Personalise the look of Qyrova and manage your profile." />
      <div className="space-y-2.5">
        <div className="rounded-xl bg-white p-3 ring-1 ring-rose-50">
          <p className="mb-2 text-[10px] font-bold text-neutral-700">Appearance</p>
          <p className="mb-1.5 text-[8px] text-neutral-400">Theme mode</p>
          <div className="mb-3 flex gap-1.5">
            {[
              ["Light", Sun, true],
              ["Dark", Moon, false],
              ["Glass", Sparkles, false],
            ].map(([l, Icon, on]) => (
              <span
                key={l}
                className={`${pillBtn} ${
                  on
                    ? "bg-white text-[var(--q-ink)] shadow-sm ring-1 ring-rose-200"
                    : "bg-rose-50/60 text-neutral-400"
                }`}
              >
                <Icon size={9} /> {l}
              </span>
            ))}
          </div>
          <p className="mb-1.5 text-[8px] text-neutral-400">Accent color</p>
          <div className="flex gap-1.5">
            {swatches.map((c, i) => (
              <motion.span
                key={c + i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.04 * i, type: "spring", stiffness: 300, damping: 18 }}
                className={`grid h-4 w-4 place-items-center rounded-full ${
                  c === "#E05D7A" ? "ring-2 ring-[var(--q-pink)] ring-offset-1" : ""
                }`}
                style={{ background: c }}
              >
                {c === "#E05D7A" && <span className="text-[6px] text-white">✓</span>}
              </motion.span>
            ))}
          </div>
        </div>
        <div className="rounded-xl bg-white p-3 ring-1 ring-rose-50">
          <p className="mb-2 text-[10px] font-bold text-neutral-700">Profile</p>
          <div className="mb-2 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-rose-50 text-neutral-300">
              <Users size={13} />
            </span>
            <span className={`${pillBtn} bg-rose-50 text-[var(--q-pink)]`}>
              <Upload size={8} /> Upload image
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Display name", "Spandan Talukdar"],
              ["Email", "owner@example.com"],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="mb-0.5 text-[7.5px] text-neutral-400">{l}</p>
                <div className="rounded-lg bg-rose-50/50 px-2 py-1.5 text-[8.5px] font-semibold text-neutral-600 ring-1 ring-rose-100">
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-end">
            <span className={`${pillBtn} bg-[var(--q-pink)] text-white`}>
              <Save size={8} /> Save profile
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ─────────────  themed mini-dashboard (for theme demo)  ───────────── */

export function ThemedMiniDash({ theme }) {
  const T = {
    light: {
      shell: "bg-[#FFF7F9] ring-rose-100",
      card: "bg-white ring-rose-50",
      ink: "text-[#231a1e]",
      mut: "text-neutral-400",
      side: "bg-white/70 border-rose-100",
    },
    dark: {
      shell: "bg-[#190f15] ring-white/10",
      card: "bg-[#241722] ring-white/5",
      ink: "text-rose-50",
      mut: "text-rose-200/40",
      side: "bg-white/[0.03] border-white/10",
    },
    glass: {
      shell: "bg-gradient-to-br from-[#431236] via-[#2b1040] to-[#120b2e] ring-white/15",
      card: "bg-white/10 ring-white/15 backdrop-blur-md",
      ink: "text-white",
      mut: "text-white/50",
      side: "bg-white/5 border-white/10",
    },
  }[theme];

  return (
    <motion.div
      key={theme}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`q-themed-preview flex overflow-hidden rounded-2xl ring-1 shadow-2xl shadow-rose-200/30 ${T.shell}`}
    >
      <div className={`hidden sm:flex w-[120px] shrink-0 flex-col gap-1 border-r p-2.5 ${T.side}`}>
        <QyrovaLogo size={15} className={`mb-2 text-[10px] ${T.ink}`} />
        {NAV_ITEMS.slice(0, 5).map(([label, Icon], i) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[9px] font-semibold ${
              i === 0 ? "bg-[var(--q-pink)] text-white" : T.mut
            }`}
          >
            <Icon size={10} /> {label}
          </div>
        ))}
      </div>
      <div className="flex-1 p-3.5">
        <p className={`font-brand text-[13px] font-bold ${T.ink}`}>Welcome to Qyrova</p>
        <p className={`mb-2.5 text-[8px] ${T.mut}`}>
          Live metrics & status charts for every quotation.
        </p>
        <div className="mb-2.5 grid grid-cols-3 gap-1.5">
          {[["4", "Total"], ["2", "Approved"], ["2", "Declined"]].map(([n, l]) => (
            <div key={l} className={`rounded-lg p-2 ring-1 ${T.card}`}>
              <p className={`text-[12px] font-extrabold ${T.ink}`}>{n}</p>
              <p className={`text-[7px] ${T.mut}`}>{l}</p>
            </div>
          ))}
        </div>
        <div className={`flex items-center gap-2.5 rounded-lg p-2.5 ring-1 ${T.card}`}>
          <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-90">
            <circle cx="20" cy="20" r="14" fill="none" stroke={theme === "light" ? "#F3E2E7" : "rgba(255,255,255,.1)"} strokeWidth="6" />
            <circle cx="20" cy="20" r="14" fill="none" stroke="#4CAF7D" strokeWidth="6" strokeDasharray="44 88" />
            <circle cx="20" cy="20" r="14" fill="none" stroke="#E05A5A" strokeWidth="6" strokeDasharray="44 88" strokeDashoffset="-44" />
          </svg>
          <div className="space-y-1">
            {[["Approved", "#4CAF7D"], ["Declined", "#E05A5A"]].map(([l, c]) => (
              <p key={l} className={`flex items-center gap-1.5 text-[8px] ${T.mut}`}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} /> {l}
              </p>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

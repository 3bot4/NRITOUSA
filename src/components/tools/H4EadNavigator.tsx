"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DataStamp from "@/components/tools/DataStamp";
import ResultActions from "@/components/ResultActions";
import { accent, type CategoryKey } from "@/lib/accents";
import pathwaysData from "../../../data/h4-pathways.json";
import mythsData from "../../../data/h4-myths.json";
import rulesData from "../../../data/h4-ead-rules.json";
import statesData from "../../../data/h4-state-childcare.json";
import checklistsData from "../../../data/h4-checklists.json";

/* ------------------------------ data shapes ----------------------------- */

interface PathCard {
  id: string;
  title: string;
  idealFor: string;
  options: string[];
  difficulty: string;
  setupTime: string;
  income: string;
  workStyle: string;
  goal: string[];
  hours: string[];
  setupTax: string;
  caveat: string;
}
interface Pillar {
  id: string;
  label: string;
  accent: CategoryKey;
  blurb: string;
  cards: PathCard[];
}

type Goal = "income" | "business" | "upskill";
type Hours = "10-20" | "20-40" | "40+";
type Style = "home" | "in-person" | "either";

interface CalcResult {
  today: Date;
  ee: Date;
  fd: Date | null;
  daysToExpiry: number;
  windowOpens: Date;
  filedTooEarly: boolean;
  filedLate: boolean;
  autoExt: boolean;
  protectedUntil: Date;
  i94EndsFirst: boolean;
  gap: {
    optDays: number;
    pessDays: number;
    risk: "none" | "low" | "high";
    appOpt: Date;
    appPess: Date;
  } | null;
  minM: number;
  maxM: number;
}

const pillars = pathwaysData.pillars as Pillar[];

/* -------------------------------- helpers ------------------------------- */

const parseDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
};
const addDays = (dt: Date, n: number) =>
  new Date(dt.getTime() + n * 86_400_000);
const diffDays = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / 86_400_000);
const fmt = (dt: Date) =>
  dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const isoRe = /^\d{4}-\d{2}-\d{2}$/;

const TAG = "rounded-md bg-ink-900/5 px-2 py-0.5 text-[11px] font-semibold text-ink-600";

/* ------------------------------ progress ring --------------------------- */

function ProgressRing({ percent }: { percent: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  const tone = percent >= 80 ? "#10b981" : percent >= 40 ? "#1e40f5" : "#f59e0b";
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 -rotate-90" aria-hidden>
      <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(11,17,32,0.08)" strokeWidth="8" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke={tone}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 500ms ease" }}
      />
    </svg>
  );
}

/* -------------------------- shared section header ----------------------- */

function SectionTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-bold uppercase tracking-wider text-fuchsia-600">{kicker}</p>
      <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-ink-900">{title}</h2>
      {sub && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-500">{sub}</p>}
    </div>
  );
}

function VerifyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 rounded-xl border-l-4 border-amber-400 bg-amber-50/70 px-4 py-2 text-xs leading-relaxed text-ink-700">
      {children}
    </p>
  );
}

/* ------------------------------ main component -------------------------- */

const GOAL_OPTS: { v: Goal; label: string; emoji: string }[] = [
  { v: "income", label: "Earn income now", emoji: "💸" },
  { v: "business", label: "Start a business", emoji: "🚀" },
  { v: "upskill", label: "Upskill or study", emoji: "🎓" },
];
const HOUR_OPTS: { v: Hours; label: string }[] = [
  { v: "10-20", label: "10–20 hrs/week" },
  { v: "20-40", label: "20–40 hrs/week" },
  { v: "40+", label: "40+ hrs/week" },
];
const STYLE_OPTS: { v: Style; label: string; emoji: string }[] = [
  { v: "home", label: "From home", emoji: "🏠" },
  { v: "in-person", label: "In person", emoji: "🤝" },
  { v: "either", label: "Either works", emoji: "✨" },
];

export default function H4EadNavigator() {
  // pathfinder
  const [step, setStep] = useState(0); // 0..3 (3 = done)
  const [goal, setGoal] = useState<Goal | null>(null);
  const [hours, setHours] = useState<Hours | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [onlyMatches, setOnlyMatches] = useState(false);
  // myths
  const [openMyth, setOpenMyth] = useState<string | null>(null);
  // calculator
  const [eadExpiry, setEadExpiry] = useState("");
  const [filingDate, setFilingDate] = useState("");
  const [i94End, setI94End] = useState("");
  // checklists
  const [checked, setChecked] = useState<Set<string>>(new Set());
  // state childcare picker
  const [stateCode, setStateCode] = useState("");

  const hydrated = useRef(false);

  // hydrate from URL once
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const g = sp.get("g");
    if (g && ["income", "business", "upskill"].includes(g)) setGoal(g as Goal);
    const h = sp.get("h");
    if (h && ["10-20", "20-40", "40+"].includes(h)) setHours(h as Hours);
    const s = sp.get("s");
    if (s && ["home", "in-person", "either"].includes(s)) setStyle(s as Style);
    if (g && h && s) setStep(3);
    const p = sp.get("p");
    if (p) setChecked(new Set(p.split(",").filter(Boolean)));
    const ee = sp.get("ee");
    if (ee && isoRe.test(ee)) setEadExpiry(ee);
    const fd = sp.get("fd");
    if (fd && isoRe.test(fd)) setFilingDate(fd);
    hydrated.current = true;
  }, []);

  // mirror to URL (debounced)
  useEffect(() => {
    if (!hydrated.current) return;
    const t = setTimeout(() => {
      const sp = new URLSearchParams();
      if (goal) sp.set("g", goal);
      if (hours) sp.set("h", hours);
      if (style) sp.set("s", style);
      const ids = Array.from(checked);
      if (ids.length) sp.set("p", ids.join(","));
      if (eadExpiry) sp.set("ee", eadExpiry);
      if (filingDate) sp.set("fd", filingDate);
      const qs = sp.toString();
      window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    }, 350);
    return () => clearTimeout(t);
  }, [goal, hours, style, checked, eadExpiry, filingDate]);

  const done = step >= 3 && goal && hours && style;

  // score a card against pathfinder answers
  const scoreCard = (c: PathCard): number => {
    if (!done) return 0;
    let s = 0;
    if (c.goal.includes(goal!)) s++;
    if (c.hours.includes(hours!)) s++;
    if (c.workStyle === style || c.workStyle === "either" || style === "either") s++;
    return s;
  };

  const toggleCheck = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const resetQuiz = () => {
    setGoal(null);
    setHours(null);
    setStyle(null);
    setStep(0);
    setOnlyMatches(false);
  };

  const matchCount = useMemo(
    () =>
      done
        ? pillars.reduce(
            (acc, p) => acc + p.cards.filter((c) => scoreCard(c) === 3).length,
            0
          )
        : 0,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [done, goal, hours, style]
  );

  /* ----------------------------- calculator ----------------------------- */

  const calc = useMemo((): CalcResult | null => {
    if (!isoRe.test(eadExpiry)) return null;
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const ee = parseDate(eadExpiry);
    const fd = isoRe.test(filingDate) ? parseDate(filingDate) : null;
    const cutoff = parseDate(rulesData.autoExtension.eliminatedDate);
    const [minM, maxM] = rulesData.processing.renewalMonths;

    const daysToExpiry = diffDays(today, ee);
    const windowOpens = addDays(ee, -rulesData.filingWindowDays);
    const i94 = isoRe.test(i94End) ? parseDate(i94End) : null;

    // auto-extension only for timely renewals received BEFORE the cutoff
    const autoExt = !!fd && fd < cutoff && fd <= ee;
    let protectedUntil = autoExt
      ? addDays(ee, rulesData.autoExtension.preRule.maxDays)
      : ee;
    // H-4 employment authorization can never outlast H-4 status: the I-94 end
    // date caps the protected period whether or not an auto-extension applies.
    const i94EndsFirst = !!i94 && i94 < protectedUntil;
    if (i94 && i94EndsFirst) protectedUntil = i94;

    let gap: null | {
      optDays: number;
      pessDays: number;
      risk: "none" | "low" | "high";
      appOpt: Date;
      appPess: Date;
    } = null;
    if (fd) {
      const appOpt = addDays(fd, minM * 30.44);
      const appPess = addDays(fd, maxM * 30.44);
      const optDays = Math.max(0, diffDays(protectedUntil, appOpt));
      const pessDays = Math.max(0, diffDays(protectedUntil, appPess));
      const risk = pessDays === 0 ? "none" : optDays === 0 ? "low" : "high";
      gap = { optDays, pessDays, risk, appOpt, appPess };
    }

    return {
      today,
      ee,
      fd,
      daysToExpiry,
      windowOpens,
      filedTooEarly: !!fd && fd < windowOpens,
      filedLate: !!fd && fd > ee,
      autoExt,
      protectedUntil,
      i94EndsFirst,
      gap,
      minM,
      maxM,
    };
  }, [eadExpiry, filingDate, i94End]);

  return (
    <div className="space-y-10">
      {/* ============================ PATHFINDER ============================ */}
      <section className="rounded-3xl border border-fuchsia-200 bg-gradient-to-br from-fuchsia-50/70 to-white p-6 shadow-card sm:p-8">
        <SectionTitle
          kicker="60-second pathfinder"
          title="What can your H-4 EAD do for you?"
          sub="Answer 3 quick questions and we'll highlight the work & business ideas that fit you best."
        />

        {/* progress dots */}
        <div className="mb-5 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                (done ? 3 : step) > i ? "bg-fuchsia-500" : "bg-fuchsia-200/60"
              }`}
            />
          ))}
        </div>

        {!done ? (
          <div>
            {step === 0 && (
              <QuizStep
                label="What's your main goal right now?"
                options={GOAL_OPTS.map((o) => ({ v: o.v, label: `${o.emoji} ${o.label}` }))}
                onPick={(v) => {
                  setGoal(v as Goal);
                  setStep(1);
                }}
                current={goal}
              />
            )}
            {step === 1 && (
              <QuizStep
                label="How many hours a week can you give it?"
                options={HOUR_OPTS}
                onPick={(v) => {
                  setHours(v as Hours);
                  setStep(2);
                }}
                current={hours}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <QuizStep
                label="How do you want to work?"
                options={STYLE_OPTS.map((o) => ({ v: o.v, label: `${o.emoji} ${o.label}` }))}
                onPick={(v) => {
                  setStyle(v as Style);
                  setStep(3);
                }}
                current={style}
                onBack={() => setStep(1)}
              />
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-lg font-bold text-ink-900">
              ✨ We found <span className="text-fuchsia-600">{matchCount}</span> ideas that fit you.
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Based on: {GOAL_OPTS.find((o) => o.v === goal)?.label} ·{" "}
              {HOUR_OPTS.find((o) => o.v === hours)?.label} ·{" "}
              {STYLE_OPTS.find((o) => o.v === style)?.label}. Your matches are
              highlighted below.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOnlyMatches((v) => !v)}
                className="rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700"
              >
                {onlyMatches ? "Show all ideas" : "Show only my matches"}
              </button>
              <button
                type="button"
                onClick={resetQuiz}
                className="rounded-xl border border-ink-900/10 bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:border-ink-900/25"
              >
                Retake quiz
              </button>
            </div>
            <div className="mt-4">
              <ResultActions
                title="My H-4 EAD pathways"
                shareText={`My H-4 EAD pathfinder result — ${matchCount} work/business ideas that fit:`}
                fileName="h4-ead-pathways"
                footnote="Educational only — not legal/tax advice. nritousa.com"
                rows={[
                  { label: "Goal", value: GOAL_OPTS.find((o) => o.v === goal)?.label ?? "" },
                  { label: "Hours/week", value: hours ?? "" },
                  { label: "Work style", value: STYLE_OPTS.find((o) => o.v === style)?.label ?? "" },
                  { label: "Matched ideas", value: String(matchCount) },
                ]}
              />
            </div>
          </div>
        )}
      </section>

      {/* ============================ MATRIX ============================ */}
      <section>
        <SectionTitle
          kicker="Pathways"
          title="Ideas, grouped by how you'd work"
          sub="Frame these as starting points, not guarantees. A valid H-4 EAD lets you do any of them while it's valid."
        />
        <div className="space-y-8">
          {pillars.map((pillar) => {
            const a = accent(pillar.accent);
            const cards = pillar.cards.filter((c) => !onlyMatches || scoreCard(c) === 3);
            if (!cards.length) return null;
            return (
              <div key={pillar.id}>
                <div className="mb-3 flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${a.dot}`} />
                  <h3 className="text-lg font-bold text-ink-900">{pillar.label}</h3>
                  <span className="text-sm text-ink-400">— {pillar.blurb}</span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {cards.map((c) => {
                    const isMatch = done && scoreCard(c) === 3;
                    return (
                      <div
                        key={c.id}
                        className={`flex flex-col rounded-2xl border bg-white p-5 shadow-card transition-all ${
                          isMatch ? "border-fuchsia-300 ring-2 ring-fuchsia-200" : "border-ink-900/5"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-ink-900">{c.title}</h4>
                          {isMatch && (
                            <span className="flex-none rounded-full bg-fuchsia-100 px-2 py-0.5 text-[10px] font-bold text-fuchsia-700">
                              ✓ Fits you
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-ink-500">{c.idealFor}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          <span className={TAG}>📊 {c.difficulty}</span>
                          <span className={TAG}>⏱ {c.setupTime}</span>
                          <span className={TAG}>💰 {c.income}</span>
                          <span className={TAG}>
                            {c.workStyle === "home" ? "🏠 Home" : c.workStyle === "in-person" ? "🤝 In-person" : "✨ Flexible"}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {c.options.map((o) => (
                            <span key={o} className={`rounded-full ${a.badge} px-2 py-0.5 text-[11px] font-medium`}>
                              {o}
                            </span>
                          ))}
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-ink-600">
                          <span className="font-semibold text-ink-800">Setup & tax basics: </span>
                          {c.setupTax}
                        </p>
                        <p className="mt-2 rounded-lg bg-amber-50/70 px-3 py-1.5 text-[11px] leading-relaxed text-ink-700">
                          ⚠️ {c.caveat}
                        </p>
                        {c.id === "in-home-daycare" && <StateChildcarePicker code={stateCode} setCode={setStateCode} />}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <DataStamp
          className="mt-4"
          lastUpdated={pathwaysData.lastUpdated}
          source={pathwaysData.source}
          sourceLabel={pathwaysData.sourceLabel}
        />
      </section>

      {/* ============================ MYTHS ============================ */}
      <section className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
        <SectionTitle
          kicker="Myth vs reality"
          title="Busting the WhatsApp-group myths"
          sub="Tap each to expand. Reality is caveated — confirm anything that affects you with an attorney."
        />
        <div className="space-y-2">
          {mythsData.myths.map((m) => {
            const isOpen = openMyth === m.id;
            return (
              <div key={m.id} className="overflow-hidden rounded-2xl border border-ink-900/5">
                <button
                  type="button"
                  onClick={() => setOpenMyth(isOpen ? null : m.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="flex-none rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-700">
                    Myth
                  </span>
                  <span className="flex-1 text-sm font-semibold text-ink-900">{m.myth}</span>
                  <span aria-hidden className={`flex-none text-ink-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-ink-900/5 bg-[#fafafa] px-4 py-4">
                    <p className="text-sm leading-relaxed text-ink-700">
                      <span className="mr-1.5 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
                        Reality
                      </span>
                      {m.reality}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-ink-500">
                      <span className="font-semibold text-ink-700">Caveat: </span>
                      {m.caveat}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <DataStamp
          className="mt-4"
          lastUpdated={mythsData.lastUpdated}
          source={mythsData.source}
          sourceLabel={mythsData.sourceLabel}
        />
      </section>

      {/* ============================ CALCULATOR ============================ */}
      <section className="rounded-3xl border border-ink-900/5 bg-white p-6 shadow-card sm:p-8">
        <SectionTitle
          kicker="EAD renewal gap calculator"
          title="Will you have a work gap at renewal?"
          sub="Renewals filed on/after Oct 30, 2025 no longer get an automatic extension — so timing matters more than ever."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-xs font-semibold text-ink-800">Current EAD expiration</span>
            <input
              type="date"
              value={eadExpiry}
              onChange={(e) => setEadExpiry(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-ink-800">Planned renewal filing date</span>
            <input
              type="date"
              value={filingDate}
              onChange={(e) => setFilingDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-ink-800">H-4 I-94 end date (optional)</span>
            <input
              type="date"
              value={i94End}
              onChange={(e) => setI94End(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink-900/10 bg-white px-3 py-2.5 text-sm text-ink-900 outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-500/20"
            />
          </label>
        </div>

        {calc && (
          <div className="mt-5 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-ink-900/5 bg-[#fafafa] p-4">
                <p className="text-xs text-ink-400">Days until your EAD expires</p>
                <p className={`text-3xl font-extrabold ${calc.daysToExpiry < 0 ? "text-rose-600" : "text-ink-900"}`}>
                  {calc.daysToExpiry < 0
                    ? `Expired ${Math.abs(calc.daysToExpiry)}d ago`
                    : `${calc.daysToExpiry} days`}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  Renewal window opens {fmt(calc.windowOpens)} (180 days before expiry).
                </p>
              </div>
              <RiskCard calc={calc} />
            </div>

            <GapTimeline calc={calc} />

            {calc.filedTooEarly && (
              <VerifyNote>
                USCIS asks you not to file a renewal more than {rulesData.filingWindowDays} days
                before your current EAD expires, and your planned date is before that window opens
                ({fmt(calc.windowOpens)}). USCIS generally does not backdate a renewal EAD to the
                end of your current card, so filing earlier does not buy you extra validity.
              </VerifyNote>
            )}

            {calc.fd && !calc.autoExt && (
              <VerifyNote>
                <strong>No automatic extension applies to this filing.</strong> Because your
                renewal is filed on or after {fmt(parseDate(rulesData.autoExtension.eliminatedDate))},
                the DHS interim final rule means a timely filing no longer extends your EAD.
                You must <strong>stop working</strong> when the card on file expires
                ({fmt(calc.ee)}) and may only resume once the new EAD is approved and received.
              </VerifyNote>
            )}

            {calc.i94EndsFirst && (
              <VerifyNote>
                <strong>Your H-4 I-94 expires before your work authorization would otherwise
                end.</strong> H-4 employment authorization cannot outlast H-4 status, so the
                controlling date here is your I-94 end date ({fmt(calc.protectedUntil)}), not the
                date printed on the EAD. You would need an approved H-4 extension to keep working
                beyond it.
              </VerifyNote>
            )}
          </div>
        )}

        <div className="mt-5 rounded-2xl bg-fuchsia-50/50 p-4">
          <p className="text-sm font-bold text-ink-900">What &ldquo;employment gap&rdquo; means</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-600">
            If your EAD expires before the renewal is approved and no auto-extension
            applies, you are <strong>not authorized to work</strong> in the interim — you
            must pause your job/business until the new card is approved and received.
            Ways to reduce the risk:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-ink-600">
            <li>• File as early as possible in the 180-day window.</li>
            <li>
              • <strong>Premium processing is not an option here.</strong> Form I-907 is not
              available for H-4 EAD category (c)(26) — for Form I-765 USCIS only accepts it from
              F-1 students in categories (c)(3)(A), (c)(3)(B) and (c)(3)(C). You cannot pay to
              speed up an H-4 EAD.
            </li>
            <li>• File the H-4/EAD with the H-1B extension, but don&apos;t assume they&apos;re approved together.</li>
          </ul>
        </div>

        <VerifyNote>
          ⚠️ {rulesData.verifyNote} Rules change — always confirm on{" "}
          <a href="https://www.uscis.gov/i-765" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            uscis.gov
          </a>{" "}
          and with an immigration attorney.
        </VerifyNote>

        {calc && (
          <div className="mt-4">
            <ResultActions
              title="My H-4 EAD renewal timeline"
              shareText="My H-4 EAD renewal gap-risk check:"
              fileName="h4-ead-renewal"
              footnote="Educational estimate — not legal advice. Verify on uscis.gov. nritousa.com"
              rows={[
                { label: "EAD expires", value: fmt(calc.ee) },
                ...(calc.fd ? [{ label: "Planned filing", value: fmt(calc.fd) }] : []),
                {
                  label: "Auto-extension",
                  value: calc.autoExt ? "May apply (pre-Oct 2025 filing)" : "None (new rule)",
                },
                ...(calc.gap
                  ? [{ label: "Gap risk", value: calc.gap.risk.toUpperCase() }]
                  : []),
              ]}
            />
          </div>
        )}

        <DataStamp
          className="mt-4"
          lastUpdated={rulesData.lastUpdated}
          source={rulesData.source}
          sourceLabel={rulesData.sourceLabel}
        />
      </section>

      {/* ============================ CHECKLISTS ============================ */}
      <section>
        <SectionTitle
          kicker="Action checklists"
          title="Your tappable game plan"
          sub="Tick items as you go — progress saves in the page link so you can share or come back."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {checklistsData.checklists.map((cl) => (
            <ChecklistCard
              key={cl.id}
              cl={cl as ChecklistShape}
              checked={checked}
              toggle={toggleCheck}
            />
          ))}
        </div>
        <DataStamp
          className="mt-4"
          lastUpdated={checklistsData.lastUpdated}
          source={checklistsData.source}
          sourceLabel={checklistsData.sourceLabel}
        />
      </section>

      {/* dependency risk callout */}
      <section className="rounded-2xl border-l-4 border-rose-400 bg-rose-50/60 p-5">
        <p className="text-sm font-bold text-ink-900">Key risk: your EAD depends on the H-1B</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-700">{rulesData.dependencyRisk}</p>
      </section>

      <ResultActions
        title="H-4 EAD Work & Business Navigator"
        shareText="H-4 EAD spouse? This free tool shows what work & businesses you can do, busts the myths, and checks your renewal gap:"
        fileName="h4-ead-navigator"
        footnote="Educational only — not legal/tax/immigration advice. nritousa.com"
        rows={[
          ...(goal ? [{ label: "Goal", value: GOAL_OPTS.find((o) => o.v === goal)?.label ?? "" }] : []),
          ...(matchCount ? [{ label: "Matched ideas", value: String(matchCount) }] : []),
        ]}
      />
    </div>
  );
}

/* ----------------------------- sub-components ---------------------------- */

function QuizStep({
  label,
  options,
  onPick,
  current,
  onBack,
}: {
  label: string;
  options: { v: string; label: string }[];
  onPick: (v: string) => void;
  current: string | null;
  onBack?: () => void;
}) {
  return (
    <div>
      <p className="mb-3 text-base font-bold text-ink-900">{label}</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onPick(o.v)}
            className={`rounded-2xl border bg-white px-4 py-5 text-left text-sm font-semibold shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover ${
              current === o.v ? "border-fuchsia-400 ring-2 ring-fuchsia-200" : "border-ink-900/5"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {onBack && (
        <button type="button" onClick={onBack} className="mt-3 text-xs font-semibold text-ink-400 hover:text-ink-700">
          ← Back
        </button>
      )}
    </div>
  );
}

function StateChildcarePicker({ code, setCode }: { code: string; setCode: (c: string) => void }) {
  const sel = statesData.states.find((s) => s.code === code);
  return (
    <div className="mt-3 rounded-lg border border-ink-900/5 bg-[#fafafa] p-3">
      <p className="text-[11px] font-semibold text-ink-800">Check your state&apos;s rules</p>
      <select
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="mt-1 w-full rounded-lg border border-ink-900/10 bg-white px-2 py-1.5 text-xs"
      >
        <option value="">Select your state…</option>
        {statesData.states.map((s) => (
          <option key={s.code} value={s.code}>
            {s.name}
          </option>
        ))}
      </select>
      {sel && (
        <p className="mt-2 text-[11px] leading-relaxed text-ink-600">
          {sel.authority}.{" "}
          <a
            href={sel.url ?? statesData.finderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-fuchsia-600 underline"
          >
            {sel.url ? "Open official site" : "Find it on childcare.gov"}
          </a>
        </p>
      )}
      <p className="mt-2 text-[10px] leading-relaxed text-ink-400">{statesData.caveat}</p>
    </div>
  );
}

interface ChecklistShape {
  id: string;
  title: string;
  blurb: string;
  accent: CategoryKey;
  items: { id: string; label: string }[];
}

function ChecklistCard({
  cl,
  checked,
  toggle,
}: {
  cl: ChecklistShape;
  checked: Set<string>;
  toggle: (id: string) => void;
}) {
  const doneCount = cl.items.filter((i) => checked.has(i.id)).length;
  const percent = Math.round((doneCount / cl.items.length) * 100);
  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-card">
      <div className="flex items-center gap-4">
        <div className="relative">
          <ProgressRing percent={percent} />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-ink-900">
            {percent}%
          </span>
        </div>
        <div>
          <h3 className="text-base font-bold text-ink-900">{cl.title}</h3>
          <p className="text-xs text-ink-500">{cl.blurb}</p>
          <p className="mt-0.5 text-xs font-semibold text-ink-400">
            {doneCount} of {cl.items.length} done
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-1.5">
        {cl.items.map((item) => {
          const on = checked.has(item.id);
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-ink-900/[0.03]"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md border text-xs ${
                    on ? "border-emerald-500 bg-emerald-500 text-white" : "border-ink-900/20 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className={on ? "text-ink-400 line-through" : "text-ink-700"}>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4">
        <ResultActions
          title={`${cl.title} — ${percent}% done`}
          shareText={`My H-4 EAD "${cl.title}" checklist — ${percent}% done:`}
          fileName={`h4-checklist-${cl.id}`}
          footnote="Educational only — not legal/tax advice. nritousa.com"
          rows={[{ label: cl.title, value: `${percent}% (${doneCount}/${cl.items.length})` }]}
        />
      </div>
    </div>
  );
}

function RiskCard({ calc }: { calc: CalcResult }) {
  if (!calc.gap) {
    return (
      <div className="rounded-2xl border border-ink-900/5 bg-[#fafafa] p-4">
        <p className="text-xs text-ink-400">Gap risk</p>
        <p className="text-lg font-bold text-ink-500">Add a filing date</p>
        <p className="mt-1 text-xs text-ink-500">Enter your planned renewal filing date to estimate the gap.</p>
      </div>
    );
  }
  const { risk, optDays, pessDays } = calc.gap;
  const tone =
    risk === "none"
      ? { bg: "bg-emerald-50/70 border-emerald-200", text: "text-emerald-700", label: "Likely no gap" }
      : risk === "low"
        ? { bg: "bg-amber-50/70 border-amber-200", text: "text-amber-700", label: "Possible gap" }
        : { bg: "bg-rose-50/70 border-rose-200", text: "text-rose-700", label: "Likely gap" };
  return (
    <div className={`rounded-2xl border p-4 ${tone.bg}`}>
      <p className="text-xs text-ink-400">Employment gap risk</p>
      <p className={`text-2xl font-extrabold ${tone.text}`}>{tone.label}</p>
      <p className="mt-1 text-xs text-ink-600">
        {risk === "none"
          ? "Based on current processing ranges, your renewal should be approved before authorization lapses — but verify."
          : `Estimated gap of roughly ${optDays === 0 ? "0" : optDays}–${pessDays} days at current ${calc.minM}–${calc.maxM} month processing, with ${calc.autoExt ? "the pre-2025 auto-extension applied" : "no auto-extension"}.`}
      </p>
    </div>
  );
}

/** Visual timeline: today → expiry/protected → approval window, gap shaded. */
function GapTimeline({ calc }: { calc: CalcResult }) {
  const points: Date[] = [calc.today, calc.ee, calc.protectedUntil];
  if (calc.fd) points.push(calc.fd);
  if (calc.gap) points.push(calc.gap.appPess);
  const min = new Date(Math.min(...points.map((p) => p.getTime())));
  const max = new Date(Math.max(...points.map((p) => p.getTime())));
  const span = Math.max(1, max.getTime() - min.getTime());
  const x = (d: Date) => ((d.getTime() - min.getTime()) / span) * 100;

  return (
    <div className="rounded-2xl border border-ink-900/5 bg-white p-4">
      <p className="mb-3 text-xs font-semibold text-ink-700">Your renewal timeline</p>
      <div className="relative h-12">
        {/* base line */}
        <div className="absolute left-0 right-0 top-5 h-1.5 rounded-full bg-ink-900/10" />
        {/* protected (authorized) segment from start to protectedUntil */}
        <div
          className="absolute top-5 h-1.5 rounded-full bg-emerald-400"
          style={{ left: 0, width: `${x(calc.protectedUntil)}%` }}
        />
        {/* gap segment */}
        {calc.gap && calc.gap.pessDays > 0 && (
          <div
            className="absolute top-5 h-1.5 bg-rose-400"
            style={{ left: `${x(calc.protectedUntil)}%`, width: `${x(calc.gap.appPess) - x(calc.protectedUntil)}%` }}
          />
        )}
        {/* markers */}
        <Marker x={x(calc.today)} label="Today" color="#374151" />
        <Marker x={x(calc.ee)} label="EAD expires" color="#1e40f5" />
        {calc.autoExt && x(calc.protectedUntil) > x(calc.ee) + 1 && (
          <Marker x={x(calc.protectedUntil)} label="Auto-ext ends" color="#059669" />
        )}
        {calc.gap && <Marker x={x(calc.gap.appPess)} label="Likely approval" color="#e11d48" />}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-ink-400">
        <span>🟢 Authorized to work</span>
        <span>🔴 Possible no-work gap</span>
      </div>
    </div>
  );
}

function Marker({ x, label, color }: { x: number; label: string; color: string }) {
  const clamped = Math.max(0, Math.min(100, x));
  return (
    <div className="absolute top-0" style={{ left: `${clamped}%`, transform: "translateX(-50%)" }}>
      <div className="mx-auto h-3 w-0.5" style={{ background: color }} />
      <div className="mt-0.5 h-3 w-3 -translate-y-2 rounded-full border-2" style={{ borderColor: color, background: "#fff" }} />
      <span
        className="block whitespace-nowrap text-[9px] font-semibold"
        style={{ color, transform: x > 80 ? "translateX(-40%)" : x < 20 ? "translateX(10%)" : "translateX(-50%)" }}
      >
        {label}
      </span>
    </div>
  );
}

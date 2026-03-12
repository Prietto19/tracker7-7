import { useState, useEffect, useCallback, useRef } from "react";

// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
function makeTheme(dark) {
  return {
    bg:          dark ? "#0F0F0F" : "#F7F7F7",
    white:       dark ? "#1C1C1C" : "#FFFFFF",
    black:       dark ? "#F0F0F0" : "#111111",
    blackCard:   dark ? "#0A0A0A" : "#1A1A1A",
    orange:      "#FF6B00",
    orangeLight: dark ? "#2A1500" : "#FFF3EB",
    orangeMid:   dark ? "#3D2000" : "#FFD9B8",
    grey:        dark ? "#666666" : "#8A8A8A",
    greyLight:   dark ? "#2A2A2A" : "#E8E8E8",
    greyMid:     dark ? "#444444" : "#D0D0D0",
    green:       "#22C55E",
    greenDark:   "#15803D",
    red:         "#EF4444",
    text:        dark ? "#F0F0F0" : "#111111",
    textMuted:   dark ? "#888888" : "#8A8A8A",
    navBg:       dark ? "#1C1C1C" : "#FFFFFF",
    headerBg:    dark ? "#1C1C1C" : "#FFFFFF",
    isDark:      dark,
  };
}
let C = makeTheme(false);

// ── SVG ICONS ────────────────────────────────────────────────────────────────
const Icon = {
  home:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  run:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="1.5"/><path d="M8 20l2-6 2 2 3-5"/><path d="M7 12l2-4 3 2 2-4"/></svg>,
  mountain: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 20 2 20"/><polyline points="7.5 14 12 8 16.5 14"/></svg>,
  target:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  body:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  plus:     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  trash:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  flame:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/></svg>,
  scale:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="3" x2="12" y2="21"/><path d="M3 9l4-4 4 4"/><path d="M3 15l4 4 4-4"/><path d="M21 9l-4-4-4 4"/><path d="M21 15l-4 4-4-4"/></svg>,
  arrow:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  bell:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  steps:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M5 20v-8a2 2 0 0 1 2-2h5"/><circle cx="5" cy="8" r="2"/><circle cx="19" cy="8" r="2"/></svg>,
  edit:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  camera:   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  no_smoke: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M12 12H3v4h13"/><path d="M17 12v4"/><path d="M22 12v4"/><path d="M7 8c0-2 1-3 3-3 2 0 4 1 4 3"/></svg>,
  trophy:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
  lock:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  globe:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  book:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  share:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  moon:     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  sun:      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  pen:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  grid:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  user:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  medal:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="14" r="8"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>,
  x:        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  download: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  upload:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  bar_up:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  zap:      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

// ── SMOKE-FREE LIVE TIMER ────────────────────────────────────────────────────
function useSmokeFreeTimer(smokeFreeStart) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!smokeFreeStart) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [smokeFreeStart]);

  if (!smokeFreeStart) return null;
  const ms = Date.now() - new Date(smokeFreeStart).getTime();
  const totalSecs = Math.floor(ms / 1000);
  const d = Math.floor(totalSecs / 86400);
  const h = Math.floor((totalSecs % 86400) / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return { d, h, m, s, totalSecs };
}

// ── STORAGE ───────────────────────────────────────────────────────────────────
const STORAGE_KEY = "7plus7_v4";
const defaultData = {
  runs: [], routes: [], weight: [], vo2max: [],
  goals: { monthly: [], annual: [], longterm: [] },
  smokeFreeStart: null, initialWeight: 82.3, targetWeight: 72.3, targetDate: "26/06/2026",
  retoChecked: {},
  challenge: {}, // { s1: { done: true, date: "15/10/2027", note: "" }, m1: {...} }
  diary: [], // [{ id, date, text, mood, tag }]
  profile: { name: "", avatar: null }, // { name: string, avatar: base64|null }
  progressPhotos: [], // [{ id, date, isoDate, dataUrl, note }]
  nextMilestone: { label: "Kilimanjaro", date: "15/10/2027" }, // editable
  seenBadges: [], // badge ids already toasted
  weeklyChallenge: {}, // { weekKey, challenges, done }
};

function useStorage() {
  const [data, setDataState] = useState(defaultData);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY);
        if (r?.value) setDataState({ ...defaultData, ...JSON.parse(r.value) });
      } catch {}
      setLoaded(true);
    })();
  }, []);
  const setData = useCallback((updater) => {
    setDataState(prev => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      window.storage.set(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);
  return { data, setData, loaded };
}

// ── PRIMITIVES ────────────────────────────────────────────────────────────────
function Card({ children, dark = false, style = {} }) {
  return (
    <div style={{
      background: dark ? C.blackCard : C.white,
      color: dark ? "#FFFFFF" : C.text,
      borderRadius: 20,
      padding: 18,
      ...style,
    }}>
      {children}
    </div>
  );
}

function OrangeCard({ children, style = {} }) {
  return (
    <div style={{ background: C.orange, borderRadius: 20, padding: 18, color: "#FFFFFF", ...style }}>
      {children}
    </div>
  );
}

function Label({ children, light = false }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, letterSpacing: 1.2,
      textTransform: "uppercase",
      color: light ? "rgba(255,255,255,0.6)" : C.textMuted,
      marginBottom: 4,
    }}>
      {children}
    </div>
  );
}

function Inp({ label, type = "number", value, onChange, placeholder, unit, step }) {
  return (
    <div style={{ marginBottom: 14, minWidth: 0 }}>
      {label && <Label>{label}</Label>}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type={type} value={value} step={step} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1, minWidth: 0, background: C.bg,
            border: `1.5px solid ${C.greyLight}`, borderRadius: 12,
            padding: "11px 14px", color: C.text, fontSize: 15,
            outline: "none", fontFamily: "inherit",
            WebkitAppearance: "none", boxSizing: "border-box",
          }}
        />
        {unit && <span style={{ color: C.textMuted, fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>{unit}</span>}
      </div>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style = {} }) {
  const variants = {
    primary: { background: C.isDark ? "#FF6B00" : "#111111", color: "#FFFFFF" },
    orange:  { background: C.orange, color: C.white },
    ghost:   { background: C.bg, color: C.text, border: `1.5px solid ${C.greyLight}` },
  };
  return (
    <button onClick={onClick} style={{
      width: "100%", border: "none", borderRadius: 14,
      padding: "13px", fontSize: 14, fontWeight: 700,
      cursor: "pointer", letterSpacing: 0.3,
      boxSizing: "border-box", ...variants[variant], ...style,
    }}>
      {children}
    </button>
  );
}

// Progress bar — thin, minimal
function ProgressBar({ value, max, color = C.orange }) {
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);
  return (
    <div style={{ background: C.greyLight, borderRadius: 99, height: 6, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.6s ease" }} />
    </div>
  );
}

// Bar chart — vertical bars like Figma design
function BarChart({ data, color = C.orange, max, goal, label }) {
  const chartMax = max || Math.max(...data.map(d => d.v), goal || 1, 1);
  return (
    <div>
      {(label || goal) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{label}</span>
          {goal && <span style={{ fontSize: 11, color: C.textMuted }}>Meta — {goal}/día</span>}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
        {data.map((d, i) => {
          const pct = Math.min(100, (d.v / chartMax) * 100);
          const isHigh = d.v >= (goal || chartMax * 0.8);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%" }}>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <div style={{
                  width: "100%", height: `${Math.max(pct, 8)}%`,
                  background: isHigh ? color : C.greyLight,
                  borderRadius: "6px 6px 0 0", transition: "height 0.5s ease",
                }} />
              </div>
              <span style={{ fontSize: 9, color: C.textMuted }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Shared line chart (weight + vo2max)
function LineChart({ data, color = C.orange, unit = "kg", gradId = "lg1", minPad = 1, maxPad = 1 }) {
  if (data.length < 2) return (
    <div style={{ textAlign: "center", padding: "24px 0", color: C.textMuted, fontSize: 13 }}>
      Registra al menos 2 mediciones para ver la gráfica
    </div>
  );
  const W = 300, H = 140, PAD = { t: 20, r: 20, b: 28, l: 40 };
  const vals = data.map(d => d.value);
  const minV = Math.min(...vals) - minPad, maxV = Math.max(...vals) + maxPad;
  const toX = i => PAD.l + (i / (data.length - 1)) * (W - PAD.l - PAD.r);
  const toY = v => PAD.t + (1 - (v - minV) / (maxV - minV)) * (H - PAD.t - PAD.b);
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(d.value).toFixed(1)}`).join(" ");
  const area = line + ` L${toX(data.length-1).toFixed(1)},${H-PAD.b} L${toX(0).toFixed(1)},${H-PAD.b} Z`;
  const ticks = [Math.round(minV+minPad), Math.round((minV+maxV)/2), Math.round(maxV-maxPad)];
  const last = data[data.length-1];
  return (
    <div style={{ width: "100%", overflowX: "hidden" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={W-PAD.r} y1={toY(t)} y2={toY(t)} stroke={C.greyLight} strokeWidth="1"/>
            <text x={PAD.l-6} y={toY(t)+4} textAnchor="end" fontSize="9" fill={C.textMuted}>{t}</text>
          </g>
        ))}
        <path d={area} fill={`url(#${gradId})`}/>
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {data.map((d, i) => (
          <circle key={i} cx={toX(i)} cy={toY(d.value)} r="4" fill={color} stroke={C.white} strokeWidth="2"/>
        ))}
        {data.length <= 8 && data.map((d, i) => (
          <text key={i} x={toX(i)} y={H-PAD.b+13} textAnchor="middle" fontSize="8" fill={C.textMuted}>
            {(d.date||"").split("/").slice(0,2).join("/")}
          </text>
        ))}
        <text x={toX(data.length-1)} y={toY(last.value)-10} textAnchor="middle" fontSize="10" fontWeight="bold" fill={color}>
          {last.value} {unit}
        </text>
      </svg>
    </div>
  );
}

// ── 7+7 RETO DATA ─────────────────────────────────────────────────────────────
const SUMMITS = [
  { id: "s1", name: "Kilimanjaro",    country: "Tanzania",    alt: "5.895m", year: 2027, diff: "Fácil",    emoji: "🇹🇿" },
  { id: "s2", name: "Elbrus",         country: "Rusia",       alt: "5.642m", year: 2028, diff: "Moderada", emoji: "🇷🇺" },
  { id: "s3", name: "Aconcagua",      country: "Argentina",   alt: "6.961m", year: 2029, diff: "Alta",     emoji: "🇦🇷" },
  { id: "s4", name: "Denali",         country: "EEUU",        alt: "6.190m", year: 2030, diff: "Alta",     emoji: "🇺🇸" },
  { id: "s5", name: "Carstensz",      country: "Indonesia",   alt: "4.884m", year: 2031, diff: "Técnica",  emoji: "🇮🇩" },
  { id: "s6", name: "Vinson",         country: "Antártida",   alt: "4.892m", year: 2031, diff: "Alta",     emoji: "🇦🇶" },
  { id: "s7", name: "Everest",        country: "Nepal",       alt: "8.849m", year: 2035, diff: "Extrema",  emoji: "🇳🇵" },
];

const MAJORS = [
  { id: "m1", name: "Berlín",         country: "Alemania",    year: 2029, month: "Sep", emoji: "🇩🇪" },
  { id: "m2", name: "Tokyo",          country: "Japón",       year: 2030, month: "Mar", emoji: "🇯🇵" },
  { id: "m3", name: "Chicago",        country: "EEUU",        year: 2030, month: "Oct", emoji: "🇺🇸" },
  { id: "m4", name: "London",         country: "Reino Unido", year: 2031, month: "Abr", emoji: "🇬🇧" },
  { id: "m5", name: "New York",       country: "EEUU",        year: 2031, month: "Nov", emoji: "🇺🇸" },
  { id: "m6", name: "Boston",         country: "EEUU",        year: 2032, month: "Abr", emoji: "🇺🇸" },
  { id: "m7", name: "Sydney",         country: "Australia",   year: 2033, month: "Sep", emoji: "🇦🇺" },
];

const DIFF_COLOR = {
  "Fácil":    "#22C55E",
  "Moderada": "#F59E0B",
  "Alta":     "#F97316",
  "Técnica":  "#8B5CF6",
  "Extrema":  "#EF4444",
};

// ── HAPTIC ───────────────────────────────────────────────────────────────────
function haptic(pattern = [10]) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch {}
}

// ── CONFETTI ──────────────────────────────────────────────────────────────────
function useConfetti() {
  const [particles, setParticles] = useState([]);
  const fire = useCallback(() => {
    const cols = ["#FF6B00","#FFD600","#22C55E","#3B82F6","#EC4899","#F59E0B","#8B5CF6"];
    const p = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 35 + Math.random() * 30,
      y: 40 + Math.random() * 20,
      vx: (Math.random() - 0.5) * 8,
      vy: -(Math.random() * 6 + 4),
      color: cols[Math.floor(Math.random() * cols.length)],
      size: 6 + Math.random() * 6,
      rot: Math.random() * 360,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
    setParticles(p);
    setTimeout(() => setParticles([]), 2800);
    haptic([30, 50, 30]);
  }, []);
  return { particles, fire };
}

// ── BADGE TOAST ───────────────────────────────────────────────────────────────
function BadgeToast({ badge, onDone }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 400); }, 3200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      position: "fixed", top: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, zIndex: 999,
      pointerEvents: "none",
    }}>
      <div style={{
        margin: "16px 14px 0",
        background: "linear-gradient(135deg,#FF6B00,#FF8C3A)",
        borderRadius: 18, padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 14,
        boxShadow: "0 8px 32px rgba(255,107,0,0.45)",
        transform: visible ? "translateY(0)" : "translateY(-110%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.3s",
      }}>
        <div style={{ fontSize: 32, flexShrink: 0 }}>{badge.emoji}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: 1 }}>¡Logro desbloqueado!</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: "#fff", marginTop: 2 }}>{badge.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 1 }}>{badge.desc}</div>
        </div>
        <div style={{ fontSize: 20 }}>🎉</div>
      </div>
    </div>
  );
}

// ── CONFETTI CANVAS ───────────────────────────────────────────────────────────
function ConfettiCanvas({ particles }) {
  if (!particles.length) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 998, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.shape === "rect" ? p.size * 0.6 : p.size,
          borderRadius: p.shape === "circle" ? "50%" : 2,
          background: p.color,
          transform: `rotate(${p.rot}deg)`,
          animation: `confetti-fall 2.8s ease-in forwards`,
          animationDelay: `${p.id * 20}ms`,
        }} />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: rotate(0deg) translateY(0); opacity: 1; }
          100% { transform: rotate(720deg) translateY(120vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── TABS ──────────────────────────────────────────────────────────────────────
// Primary nav (always visible) + secondary (in "Más" drawer)
const PRIMARY_TABS = [
  { id: "dashboard", label: "Inicio",    icon: "home" },
  { id: "running",   label: "Running",   icon: "run" },
  { id: "mountains", label: "Montaña",   icon: "mountain" },
  { id: "body",      label: "Perfil",    icon: "user" },
];
const SECONDARY_TABS = [
  { id: "reto",      label: "7+7",       icon: "trophy" },
  { id: "weekly",    label: "Retos",     icon: "zap" },
  { id: "goals",     label: "Objetivos", icon: "target" },
  { id: "diario",    label: "Diario",    icon: "book" },
  { id: "badges",    label: "Logros",    icon: "medal" },
  { id: "ajustes",   label: "Ajustes",   icon: "settings" },
];
const ALL_TABS = [...PRIMARY_TABS, ...SECONDARY_TABS];

// ── NEXT MILESTONE CARD ──────────────────────────────────────────────────────
function NextMilestoneCard({ data, setData }) {
  const ms = data.nextMilestone || { label: "Kilimanjaro", date: "15/10/2027" };
  const [editingMs, setEditingMs] = useState(false);
  const [msLabel, setMsLabel] = useState(ms.label);
  const [msDate, setMsDate] = useState(ms.date);

  function parseDate(str) {
    const parts = str.split("/");
    if (parts.length === 3) return new Date(parts[2], parts[1]-1, parts[0]);
    return null;
  }
  const target = parseDate(ms.date);
  const daysLeft = target ? Math.max(0, Math.ceil((target - Date.now()) / 86400000)) : null;
  const urgency = daysLeft !== null && daysLeft < 30 ? C.red : daysLeft < 180 ? C.orange : "#3B82F6";

  return (
    <Card dark style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700 }}>Próximo hito</div>
        <button onClick={() => { setMsLabel(ms.label); setMsDate(ms.date); setEditingMs(e => !e); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", padding: 2, fontSize: 16 }}>✏️</button>
      </div>
      {editingMs ? (
        <div>
          <input value={msLabel} onChange={e => setMsLabel(e.target.value)}
            placeholder="Nombre del hito" autoFocus
            style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 14, fontWeight: 700, outline: "none", fontFamily: "inherit", marginBottom: 8, colorScheme: "dark" }} />
          <input value={msDate} onChange={e => setMsDate(e.target.value)}
            placeholder="DD/MM/AAAA"
            style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "9px 12px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", marginBottom: 12, colorScheme: "dark" }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button onClick={() => { setData(d => ({ ...d, nextMilestone: { label: msLabel, date: msDate } })); setEditingMs(false); haptic([20]); }}
              style={{ background: C.orange, border: "none", borderRadius: 10, padding: "10px", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Guardar</button>
            <button onClick={() => setEditingMs(false)}
              style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "10px", color: "rgba(255,255,255,0.8)", fontSize: 13, cursor: "pointer" }}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 4 }}>{ms.label}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{ms.date}</div>
          </div>
          {daysLeft !== null && (
            <div style={{ textAlign: "center", background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 16px", minWidth: 72 }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: urgency, lineHeight: 1, letterSpacing: -1 }}>{daysLeft}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 3 }}>días</div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({ data, setData, totalKm, totalMtnKm, totalDesnivel, lastWeight, weightLost, smokeFreeDays, moneySaved, lastVo2, onShare }) {
  const smokeTarget = data.initialWeight - data.targetWeight;
  const timer = useSmokeFreeTimer(data.smokeFreeStart);
  const pad = n => String(n).padStart(2, "0");
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* HERO — dark card */}
      <Card dark style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
              Misión 2026–2036
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: C.white, lineHeight: 1.1, letterSpacing: -1 }}>
              7+7<br/>
              <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: 0 }}>Summits & Majors</span>
            </div>
          </div>
          <div style={{ background: C.orange, borderRadius: 14, padding: "8px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: C.white, lineHeight: 1 }}>{smokeFreeDays}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", letterSpacing: 1 }}>días libre</div>
          </div>
        </div>

        {/* 4 stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
          {[
            { label: "km run", value: Math.round(totalKm) },
            { label: "rutas mtn", value: data.routes.length },
            { label: "D+ (m)", value: Math.round(totalDesnivel) },
            { label: "VO2max", value: lastVo2 ? lastVo2 : "–" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "12px 8px", textAlign: "center", background: "rgba(255,255,255,0.04)" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: C.white }}>{s.value}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: 0.8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2 stat cards — like Figma "Completed exercises" + "Burned kcal" */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <OrangeCard style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Label light>Peso actual</Label>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.white, lineHeight: 1.1 }}>{lastWeight.toFixed(1)}<span style={{ fontSize: 14, fontWeight: 500 }}> kg</span></div>
              {weightLost > 0 && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>↓ {weightLost.toFixed(1)} kg</div>}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)" }}>{Icon.scale}</div>
          </div>
        </OrangeCard>
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <Label>VO2max</Label>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.text, lineHeight: 1.1 }}>
                {lastVo2 ? lastVo2 : "–"}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>ml/kg/min</div>
            </div>
            <div style={{ color: C.textMuted }}>{Icon.flame}</div>
          </div>
        </Card>
      </div>

      {/* WEEKLY SUMMARY */}
      {(() => {
        const now = new Date();
        const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay() + 1); startOfWeek.setHours(0,0,0,0);
        const startOfPrevWeek = new Date(startOfWeek); startOfPrevWeek.setDate(startOfPrevWeek.getDate() - 7);
        const thisWeekRuns = (data.runs||[]).filter(r => { const d = r.isoDate ? new Date(r.isoDate) : null; return d && d >= startOfWeek; });
        const prevWeekRuns = (data.runs||[]).filter(r => { const d = r.isoDate ? new Date(r.isoDate) : null; return d && d >= startOfPrevWeek && d < startOfWeek; });
        const thisKm = thisWeekRuns.reduce((s,r) => s + parseFloat(r.km||0), 0);
        const prevKm = prevWeekRuns.reduce((s,r) => s + parseFloat(r.km||0), 0);
        const kmDiff = thisKm - prevKm;
        const thisRoutes = (data.routes||[]).filter(r => { const d = r.isoDate ? new Date(r.isoDate) : null; return d && d >= startOfWeek; });
        const weekLabel = startOfWeek.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
        if (thisWeekRuns.length === 0 && thisRoutes.length === 0) return null;
        return (
          <Card style={{ borderLeft: `3px solid ${C.orange}`, paddingLeft: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Resumen semana · desde {weekLabel}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.orange }}>{thisWeekRuns.length}</div>
                <div style={{ fontSize: 10, color: C.textMuted }}>salidas</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.text }}>{thisKm.toFixed(1)}<span style={{ fontSize: 11, color: C.textMuted }}>km</span></div>
                <div style={{ fontSize: 10, color: C.textMuted, display: "flex", alignItems: "center", gap: 3 }}>
                  vs semana ant.
                  {prevKm > 0 && <span style={{ fontWeight: 800, color: kmDiff >= 0 ? C.green : C.red }}>{kmDiff >= 0 ? "↑" : "↓"}{Math.abs(kmDiff).toFixed(1)}</span>}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.text }}>{thisRoutes.length}</div>
                <div style={{ fontSize: 10, color: C.textMuted }}>rutas mtn</div>
              </div>
            </div>
          </Card>
        );
      })()}

      {/* Sin fumar — live counter */}
      {data.smokeFreeStart ? (
        <Card dark style={{ padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.white, letterSpacing: 0.5, textTransform: "uppercase" }}>Sin fumar</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Contador en tiempo real</div>
            </div>
            <div style={{ color: C.orange }}>{Icon.no_smoke}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
            {[
              { val: timer ? timer.d : 0, lbl: "días" },
              { val: timer ? pad(timer.h) : "00", lbl: "horas" },
              { val: timer ? pad(timer.m) : "00", lbl: "min" },
              { val: timer ? pad(timer.s) : "00", lbl: "seg" },
            ].map(({ val, lbl }, i) => (
              <div key={i} style={{ background: i === 0 ? C.orange : "rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px 4px", textAlign: "center" }}>
                <div style={{ fontSize: i === 0 ? 28 : 22, fontWeight: 900, color: C.white, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{val}</div>
                <div style={{ fontSize: 8.5, color: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 }}>{lbl}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#22C55E", lineHeight: 1 }}>{(smokeFreeDays * 5.1).toFixed(0)}€</div>
              <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 }}>ahorrado</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.orange, lineHeight: 1 }}>{Math.round(smokeFreeDays * 20)}</div>
              <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 }}>cigarrillos</div>
            </div>
          </div>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 12, padding: "10px", color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Reiniciar — nueva fecha de inicio
            </button>
          ) : (
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", textAlign: "center", marginBottom: 12 }}>
                ¿Confirmar recaída y reiniciar el contador?
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  onClick={() => { setData(d => ({ ...d, smokeFreeStart: new Date().toISOString() })); setConfirmReset(false); }}
                  style={{ background: C.orange, border: "none", borderRadius: 10, padding: "10px", color: C.white, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Sí, reiniciar
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: "10px", color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </Card>
      ) : null}

      {/* Progress cards */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Objetivo de peso</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.orange }}>-{weightLost.toFixed(1)} / -{smokeTarget.toFixed(1)} kg</span>
          </div>
          <ProgressBar value={weightLost} max={smokeTarget} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Desnivel acumulado</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{Math.round(totalDesnivel)}m</span>
          </div>
          <ProgressBar value={totalDesnivel} max={50000} color={C.text} />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Km de running</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{Math.round(totalKm)} km</span>
          </div>
          <ProgressBar value={totalKm} max={5000} color={C.text} />
        </div>
      </Card>

      {/* NEXT MILESTONE */}
      <NextMilestoneCard data={data} setData={setData} />

      {/* Share card button */}
      <button onClick={onShare} style={{
        width: "100%", background: C.isDark ? "#FF6B00" : "#111111", border: "none",
        borderRadius: 16, padding: "14px 18px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        color: "#fff",
      }}>
        <span style={{ color: C.orange }}>{Icon.share}</span>
        <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.3 }}>Compartir mi progreso</span>
      </button>

      {/* Smoke free CTA — only shown before starting */}
      {!data.smokeFreeStart && (
        <Card style={{ border: `2px solid ${C.orange}`, padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>¿Hoy es tu Día D?</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16, lineHeight: 1.5 }}>
            El paso más importante del plan. Activa el contador ahora.
          </div>
          <Btn variant="orange" onClick={() => setData(d => ({ ...d, smokeFreeStart: new Date().toISOString() }))}>
            Empezar sin tabaco
          </Btn>
        </Card>
      )}
    </div>
  );
}

// ── RUNNING HELPERS ──────────────────────────────────────────────────────────
// Parse "mm:ss" or "h:mm:ss" → total seconds
function parseTime(str) {
  if (!str) return null;
  const parts = str.trim().split(":").map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}
// seconds → "mm:ss" or "h:mm:ss"
function fmtTime(secs) {
  if (!secs || secs <= 0) return "–";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  return `${m}:${String(s).padStart(2,"0")}`;
}
// pace string "m:ss" → secs/km
function parsePace(str) {
  if (!str) return null;
  const p = str.replace(/[^0-9:]/g,"").split(":");
  if (p.length !== 2) return null;
  const v = parseInt(p[0]) * 60 + parseInt(p[1]);
  return isNaN(v) ? null : v;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RUNNING
// ═══════════════════════════════════════════════════════════════════════════════
function Running({ data, setData, totalKm }) {
  const [form, setForm] = useState({
    km: "", time: "", pace: "", note: "",
    tipo: "normal",          // normal | tempo | fartlek | series | cuestas
    series_num: "",          // nº de series
    series_dist: "",         // distancia de cada serie (m)
    series_rec: "",          // recuperación (ej: 90s, 2min)
    series_tiempo: "",       // tiempo por serie (ej: 3:45)
    fartlek_bloques: "",     // descripción bloques fartlek (ej: 5x(3min rápido/2min suave))
    cuestas_num: "",         // nº repeticiones
    cuestas_long: "",        // longitud cuesta (m)
    cuestas_pendiente: "",   // % pendiente aproximado
    ritmo_objetivo: "",      // para tempo: ritmo objetivo
  });
  const [statsView, setStatsView] = useState("semana"); // semana | mes | total

  function addRun() {
    if (!form.km) return;
    // Auto-calc pace if time given but no pace
    let finalPace = form.pace;
    if (!finalPace && form.time && form.km) {
      const secs = parseTime(form.time);
      if (secs) {
        const paceSecs = Math.round(secs / parseFloat(form.km));
        finalPace = fmtTime(paceSecs);
      }
    }
    setData(d => ({ ...d, runs: [...d.runs, {
      ...form, pace: finalPace, km: parseFloat(form.km),
      date: new Date().toLocaleDateString("es-ES"),
      isoDate: new Date().toISOString(),
    }] }));
    setForm({
      km: "", time: "", pace: "", note: "",
      tipo: "normal", series_num: "", series_dist: "", series_rec: "",
      series_tiempo: "", fartlek_bloques: "", cuestas_num: "",
      cuestas_long: "", cuestas_pendiente: "", ritmo_objetivo: "",
    });
    haptic([20, 40, 20]);
  }

  // ── Advanced stats ────────────────────────────────────────────────────────
  const runs = data.runs || [];
  const totalRuns = runs.length;

  // Best run (longest km)
  const bestKm = runs.length > 0 ? Math.max(...runs.map(r => parseFloat(r.km||0))) : 0;

  // Average km per run
  const avgKm = totalRuns > 0 ? (totalKm / totalRuns) : 0;

  // Average pace (from runs that have pace)
  const pacedRuns = runs.filter(r => r.pace && parsePace(r.pace));
  const avgPaceSecs = pacedRuns.length > 0
    ? Math.round(pacedRuns.reduce((s,r) => s + parsePace(r.pace), 0) / pacedRuns.length)
    : null;

  // Best pace
  const bestPaceSecs = pacedRuns.length > 0
    ? Math.min(...pacedRuns.map(r => parsePace(r.pace)))
    : null;

  // Streak: consecutive days with runs
  const runDays = new Set(runs.map(r => r.date));
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    if (runDays.has(d.toLocaleDateString("es-ES"))) streak++;
    else if (i > 0) break;
  }

  // Monthly km breakdown (last 6 months)
  const monthlyKm = {};
  runs.forEach(r => {
    const d = r.isoDate ? new Date(r.isoDate) : null;
    if (!d) return;
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
    monthlyKm[key] = (monthlyKm[key] || 0) + parseFloat(r.km || 0);
  });
  const monthKeys = Object.keys(monthlyKm).sort().slice(-6);
  const monthBars = monthKeys.map(k => ({
    label: k.split("-")[1] + "/" + k.split("-")[0].slice(2),
    v: Math.round(monthlyKm[k] * 10) / 10,
  }));

  // Weekly bars (last 7 runs)
  const lastRuns = [...runs].reverse().slice(0, 7);
  const weekBars = ["L","M","X","J","V","S","D"].map((l, i) => ({
    label: l, v: lastRuns[6-i] ? parseFloat(lastRuns[6-i].km) : 0,
  }));

  // Projected race times from avgPace
  const raceDistances = [
    { name: "5K",      km: 5 },
    { name: "10K",     km: 10 },
    { name: "½ Marat", km: 21.097 },
    { name: "Maratón", km: 42.195 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Hero stats — dark card */}
      <Card dark style={{ padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Total acumulado</div>
            <div style={{ fontSize: 38, fontWeight: 900, color: C.orange, lineHeight: 1, letterSpacing: -1 }}>{Math.round(totalKm)}<span style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.65)" }}>km</span></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, justifyContent: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>Salidas</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{totalRuns}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>Racha</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: streak > 0 ? C.orange : "#fff" }}>{streak}d</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>Mejor salida</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{bestKm > 0 ? `${bestKm}km` : "–"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>Media/salida</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{avgKm > 0 ? `${avgKm.toFixed(1)}km` : "–"}</span>
            </div>
          </div>
        </div>
        {/* Pace stats */}
        {avgPaceSecs && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>Ritmo medio</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>{fmtTime(avgPaceSecs)}<span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>/km</span></div>
            </div>
            {bestPaceSecs && (
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>Mejor ritmo</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.orange }}>{fmtTime(bestPaceSecs)}<span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>/km</span></div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Chart toggle */}
      <div style={{ display: "flex", gap: 4, background: C.white, borderRadius: 14, padding: 4 }}>
        {[["semana","Últimas salidas"],["mes","Por mes"]].map(([id, label]) => (
          <button key={id} onClick={() => setStatsView(id)} style={{
            flex: 1, border: "none", borderRadius: 10, padding: "8px",
            background: statsView === id ? (C.isDark ? C.orange : C.black) : "transparent",
            color: statsView === id ? "#fff" : C.textMuted,
            fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}>{label}</button>
        ))}
      </div>

      {/* Bar chart */}
      <Card dark style={{ padding: 18 }}>
        {statsView === "semana"
          ? <BarChart data={weekBars} color={C.orange} label="Últimas salidas (km)" goal={8} />
          : monthBars.length > 0
            ? <BarChart data={monthBars} color={C.orange} label="Km por mes" />
            : <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,0.65)", fontSize: 13 }}>Registra salidas con fecha para ver el gráfico mensual</div>
        }
      </Card>

      {/* Race time projections */}
      {avgPaceSecs && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Tiempos estimados</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14 }}>Basado en tu ritmo medio actual ({fmtTime(avgPaceSecs)}/km)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {raceDistances.map(({ name, km }) => {
              const totalSecs = Math.round(avgPaceSecs * km);
              return (
                <div key={name} style={{ background: C.bg, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.greyLight}` }}>
                  <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{name}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: name === "Maratón" ? C.orange : C.text }}>
                    {fmtTime(totalSecs)}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Form */}
      <Card>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Registrar salida</div>

        {/* Tipo de entreno */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Tipo de entrenamiento</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            {[
              { id: "normal",  label: "🏃 Normal" },
              { id: "tempo",   label: "⚡ Tempo" },
              { id: "fartlek", label: "🎲 Fartlek" },
              { id: "series",  label: "🔁 Series" },
              { id: "cuestas", label: "⛰️ Cuestas" },
            ].map(t => (
              <button key={t.id} onClick={() => setForm(f => ({...f, tipo: t.id}))}
                style={{
                  padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontSize: 11, fontWeight: 700, fontFamily: "inherit",
                  background: form.tipo === t.id ? C.orange : C.bg,
                  color: form.tipo === t.id ? "#fff" : C.textMuted,
                  boxShadow: form.tipo === t.id ? "0 2px 8px rgba(255,107,0,0.3)" : "none",
                  transition: "all 0.15s",
                }}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* Campos comunes */}
        <Inp label="Distancia total *" value={form.km} onChange={v => setForm(f => ({...f, km: v}))} placeholder="8.5" unit="km" step="0.1" />
        <Inp label="Tiempo total" type="text" value={form.time} onChange={v => setForm(f => ({...f, time: v}))} placeholder="45:20" />

        {/* Tempo */}
        {form.tipo === "tempo" && (
          <Inp label="Ritmo objetivo" type="text" value={form.ritmo_objetivo} onChange={v => setForm(f => ({...f, ritmo_objetivo: v}))} placeholder="4:30" unit="/km" />
        )}

        {/* Series */}
        {form.tipo === "series" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Inp label="Nº series" value={form.series_num} onChange={v => setForm(f => ({...f, series_num: v}))} placeholder="8" />
              <Inp label="Distancia/serie" value={form.series_dist} onChange={v => setForm(f => ({...f, series_dist: v}))} placeholder="400" unit="m" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Inp label="Tiempo/serie" type="text" value={form.series_tiempo} onChange={v => setForm(f => ({...f, series_tiempo: v}))} placeholder="1:45" />
              <Inp label="Recuperación" type="text" value={form.series_rec} onChange={v => setForm(f => ({...f, series_rec: v}))} placeholder="90s" />
            </div>
            {form.series_num && form.series_dist && (
              <div style={{ background: C.orange + "12", borderRadius: 10, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: C.orange, fontWeight: 700 }}>
                {form.series_num}×{form.series_dist}m
                {form.series_tiempo ? ` · ${form.series_tiempo}/serie` : ""}
                {form.series_rec ? ` · rec: ${form.series_rec}` : ""}
              </div>
            )}
          </>
        )}

        {/* Fartlek */}
        {form.tipo === "fartlek" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Inp label="Nº bloques" value={form.series_num} onChange={v => setForm(f => ({...f, series_num: v}))} placeholder="6" />
              <Inp label="Duración bloque" type="text" value={form.series_tiempo} onChange={v => setForm(f => ({...f, series_tiempo: v}))} placeholder="3min" />
            </div>
            <Inp label="Recuperación entre bloques" type="text" value={form.series_rec} onChange={v => setForm(f => ({...f, series_rec: v}))} placeholder="2min suave" />
            <Inp label="Descripción bloques (opcional)" type="text" value={form.fartlek_bloques} onChange={v => setForm(f => ({...f, fartlek_bloques: v}))} placeholder="3min rápido / 2min suave" />
            {form.series_num && form.series_tiempo && (
              <div style={{ background: C.orange + "12", borderRadius: 10, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: C.orange, fontWeight: 700 }}>
                {form.series_num}×{form.series_tiempo}
                {form.series_rec ? ` · rec: ${form.series_rec}` : ""}
              </div>
            )}
          </>
        )}

        {/* Cuestas */}
        {form.tipo === "cuestas" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Inp label="Nº repeticiones" value={form.cuestas_num} onChange={v => setForm(f => ({...f, cuestas_num: v}))} placeholder="10" />
              <Inp label="Longitud cuesta" value={form.cuestas_long} onChange={v => setForm(f => ({...f, cuestas_long: v}))} placeholder="150" unit="m" />
            </div>
            <Inp label="Pendiente aprox." value={form.cuestas_pendiente} onChange={v => setForm(f => ({...f, cuestas_pendiente: v}))} placeholder="8" unit="%" />
            {form.cuestas_num && form.cuestas_long && (
              <div style={{ background: C.orange + "12", borderRadius: 10, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: C.orange, fontWeight: 700 }}>
                {form.cuestas_num}× {form.cuestas_long}m
                {form.cuestas_pendiente ? ` · ${form.cuestas_pendiente}% pendiente` : ""}
              </div>
            )}
          </>
        )}

        <Inp label="Ritmo medio (se calcula solo)" type="text" value={form.pace} onChange={v => setForm(f => ({...f, pace: v}))} placeholder="5:20" unit="/km" />
        <Inp label="Nota" type="text" value={form.note} onChange={v => setForm(f => ({...f, note: v}))} placeholder="Sensaciones, ruta..." />
        <Btn variant="primary" onClick={addRun}>Guardar salida</Btn>
      </Card>

      {/* History */}
      <Card>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Historial</div>
        {runs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "24px 0", color: C.textMuted, fontSize: 13 }}>
            Aún no hay salidas. ¡A por la primera!
          </div>
        ) : (
          (() => {
            const TIPO_LABEL = { normal:"Normal", tempo:"Tempo", fartlek:"Fartlek", series:"Series", cuestas:"Cuestas" };
            const TIPO_COLOR = { normal: C.orange, tempo:"#3B82F6", fartlek:"#8B5CF6", series:"#EF4444", cuestas:"#10B981" };
            return [...runs].reverse().slice(0, 15).map((r, i) => {
              const tipo = r.tipo || "normal";
              const tc = TIPO_COLOR[tipo] || C.orange;
              let detail = "";
              if (tipo === "series" && r.series_num && r.series_dist) detail = r.series_num + "×" + r.series_dist + "m" + (r.series_rec ? " · rec " + r.series_rec : "");
              if (tipo === "fartlek" && r.series_num && r.series_tiempo) detail = r.series_num + "×" + r.series_tiempo + (r.series_rec ? " · " + r.series_rec : "");
              if (tipo === "cuestas" && r.cuestas_num && r.cuestas_long) detail = r.cuestas_num + "× " + r.cuestas_long + "m" + (r.cuestas_pendiente ? " al " + r.cuestas_pendiente + "%" : "");
              if (tipo === "tempo" && r.ritmo_objetivo) detail = "objetivo " + r.ritmo_objetivo + "/km";
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  padding: "12px 0", borderBottom: `1px solid ${C.greyLight}`,
                }}>
                  <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{r.km} km</span>
                      <span style={{ fontSize: 9, fontWeight: 800, color: tc, background: tc + "18", borderRadius: 5, padding: "2px 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>{TIPO_LABEL[tipo]}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>
                      {[r.time, r.pace ? r.pace + "/km" : null].filter(Boolean).join(" · ")}
                    </div>
                    {detail && <div style={{ fontSize: 11, color: tc, fontWeight: 600, marginTop: 2 }}>{detail}</div>}
                    {r.note && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.note}</div>}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted, flexShrink: 0 }}>{r.date}</div>
                </div>
              );
            });
          })()
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOUNTAINS
// ═══════════════════════════════════════════════════════════════════════════════
function Mountains({ data, setData, totalMtnKm, totalDesnivel }) {
  const [form, setForm] = useState({ name: "", km: "", desnivel: "", time: "", note: "", photo: null });
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const photoRef = useRef();

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  }

  function addRoute() {
    if (!form.name) return;
    setData(d => ({ ...d, routes: [...d.routes, { ...form, date: new Date().toLocaleDateString("es-ES") }] }));
    setForm({ name: "", km: "", desnivel: "", time: "", note: "", photo: null });
    setShowForm(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        {[
          { label: "Rutas", value: data.routes.length, accent: true },
          { label: "Km MTN", value: Math.round(totalMtnKm) },
          { label: "D+ total", value: `${Math.round(totalDesnivel)}m` },
        ].map((s, i) => (
          <Card key={i} dark={i === 0} style={{ padding: 14, textAlign: "center" }}>
            <Label light={i === 0}>{s.label}</Label>
            <div style={{ fontSize: 22, fontWeight: 900, color: i === 0 ? C.orange : C.text }}>
              {s.value}
            </div>
          </Card>
        ))}
      </div>

      {!showForm && (
        <Btn variant="orange" onClick={() => setShowForm(true)}>
          + Añadir ruta de montaña
        </Btn>
      )}

      {showForm && (
        <Card style={{ border: `2px solid ${C.orange}` }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>Nueva ruta</div>
          <Inp label="Nombre *" type="text" value={form.name} onChange={v => setForm(f => ({...f, name: v}))} placeholder="Penyagolosa circular" />
          <Inp label="Distancia (km)" value={form.km} onChange={v => setForm(f => ({...f, km: v}))} placeholder="8" step="0.1" unit="km" />
          <Inp label="Desnivel +" value={form.desnivel} onChange={v => setForm(f => ({...f, desnivel: v}))} placeholder="500" unit="m" />
          <Inp label="Tiempo" type="text" value={form.time} onChange={v => setForm(f => ({...f, time: v}))} placeholder="3h 15m" />
          <Inp label="Notas" type="text" value={form.note} onChange={v => setForm(f => ({...f, note: v}))} placeholder="Condiciones, sensaciones..." />
          <div style={{ marginBottom: 14 }}>
            <Label>Foto</Label>
            {form.photo ? (
              <div style={{ position: "relative" }}>
                <img src={form.photo} alt="preview" style={{ width: "100%", borderRadius: 12, maxHeight: 180, objectFit: "cover", display: "block" }} />
                <button onClick={() => setForm(f => ({...f, photo: null}))} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 28, height: 28, color: "#fff", fontSize: 14, cursor: "pointer" }}>✕</button>
              </div>
            ) : (
              <div onClick={() => photoRef.current?.click()} style={{ background: C.bg, border: `1.5px dashed ${C.greyMid}`, borderRadius: 12, padding: "22px", textAlign: "center", cursor: "pointer" }}>
                <div style={{ color: C.textMuted, marginBottom: 4 }}>{Icon.camera}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Toca para añadir foto</div>
                <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
              </div>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Btn variant="primary" onClick={addRoute}>Guardar</Btn>
            <Btn variant="ghost" onClick={() => { setShowForm(false); setForm({ name: "", km: "", desnivel: "", time: "", note: "", photo: null }); }}>Cancelar</Btn>
          </div>
        </Card>
      )}

      {data.routes.length > 0 ? (
        <Card>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Mis rutas ({data.routes.length})</div>
          {[...data.routes].reverse().map((r, i) => (
            <div key={i} style={{ marginBottom: 12, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.greyLight}` }}>
              {r.photo && <img src={r.photo} alt={r.name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />}
              <div style={{ padding: "12px 14px", cursor: "pointer" }} onClick={() => setExpanded(expanded === i ? null : i)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, flexShrink: 0, marginLeft: 8 }}>{r.date}</div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                  {r.km && <span style={{ fontSize: 12, color: C.orange, fontWeight: 700 }}>{r.km} km</span>}
                  {r.desnivel && <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>↑ {r.desnivel}m</span>}
                  {r.time && <span style={{ fontSize: 12, color: C.textMuted }}>{r.time}</span>}
                </div>
                {r.note && expanded === i && (
                  <div style={{ marginTop: 8, fontSize: 12, color: C.textMuted, lineHeight: 1.5 }}>{r.note}</div>
                )}
              </div>
            </div>
          ))}
        </Card>
      ) : !showForm && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.textMuted }}>
          <div style={{ color: C.greyMid, marginBottom: 8 }}>{Icon.mountain}</div>
          <div style={{ fontSize: 13 }}>Añade tu primera ruta de montaña</div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// WEEKLY CHALLENGE — retos semanales automáticos
// ═══════════════════════════════════════════════════════════════════════════════
function getWeekKey() {
  const now = new Date();
  const mon = new Date(now);
  mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  return mon.toISOString().slice(0, 10); // "2026-03-09"
}

function generateChallenges(data, totalKm, totalDesnivel, smokeFreeDays) {
  const runs   = data.runs   || [];
  const routes = data.routes || [];
  const lastWeight = data.weight?.length > 0 ? data.weight[data.weight.length-1].value : data.initialWeight;

  // Last 4 weeks avg km
  const now = Date.now();
  const recent = runs.filter(r => r.isoDate && (now - new Date(r.isoDate)) < 28*86400000);
  const avgWeeklyKm = recent.reduce((s,r) => s + parseFloat(r.km||0), 0) / 4;
  const avgWeeklyRuns = recent.length / 4;

  // Last 4 weeks avg routes
  const recentRoutes = routes.filter(r => r.isoDate && (now - new Date(r.isoDate)) < 28*86400000);
  const avgWeeklyRoutes = recentRoutes.length / 4;

  const challenges = [];

  // ── Running challenges (adaptive) ──────────────────────────────────────────
  if (runs.length === 0) {
    challenges.push({ id:"c_run_first", emoji:"👟", cat:"Running", text:"Completa tu primera salida de running", target: 1, unit: "salida" });
  } else if (avgWeeklyRuns < 1) {
    challenges.push({ id:"c_run_1", emoji:"🏃", cat:"Running", text:"Haz 1 salida de running esta semana", target: 1, unit: "salida" });
  } else if (avgWeeklyRuns < 2) {
    challenges.push({ id:"c_run_2", emoji:"🏃", cat:"Running", text:"Haz 2 salidas de running esta semana", target: 2, unit: "salidas" });
  } else if (avgWeeklyRuns < 3) {
    challenges.push({ id:"c_run_3", emoji:"🏃", cat:"Running", text:"Haz 3 salidas de running esta semana", target: 3, unit: "salidas" });
  } else {
    challenges.push({ id:"c_run_4", emoji:"🏃", cat:"Running", text:"Haz 4 salidas de running esta semana", target: 4, unit: "salidas" });
  }

  // ── km challenge ───────────────────────────────────────────────────────────
  const kmTarget = avgWeeklyKm < 5 ? 5 : avgWeeklyKm < 15 ? Math.round(avgWeeklyKm * 1.1 / 5) * 5 : Math.round(avgWeeklyKm * 1.1 / 5) * 5;
  const kmT = Math.max(5, Math.round(kmTarget / 5) * 5);
  challenges.push({ id:"c_km_" + kmT, emoji:"📏", cat:"Running", text:`Acumula ${kmT} km corriendo esta semana`, target: kmT, unit: "km" });

  // ── Quality session ────────────────────────────────────────────────────────
  const hasIntensity = runs.some(r => r.tipo && r.tipo !== "normal");
  if (!hasIntensity || runs.length < 5) {
    challenges.push({ id:"c_quality_tempo", emoji:"⚡", cat:"Running", text:"Haz 1 entrenamiento de calidad (tempo, series o fartlek)", target: 1, unit: "sesión" });
  } else {
    challenges.push({ id:"c_quality_series", emoji:"🔁", cat:"Running", text:"Completa una sesión de series esta semana", target: 1, unit: "sesión" });
  }

  // ── Montaña challenge ──────────────────────────────────────────────────────
  if (routes.length === 0) {
    challenges.push({ id:"c_mtn_first", emoji:"🏔️", cat:"Montaña", text:"Registra tu primera salida a la montaña", target: 1, unit: "ruta" });
  } else if (avgWeeklyRoutes < 0.5) {
    challenges.push({ id:"c_mtn_1", emoji:"🗻", cat:"Montaña", text:"Haz 1 salida a la montaña esta semana", target: 1, unit: "ruta" });
  } else {
    challenges.push({ id:"c_mtn_2", emoji:"🗻", cat:"Montaña", text:"Haz 2 salidas a la montaña esta semana", target: 2, unit: "rutas" });
  }

  // ── Salud: tabaco ──────────────────────────────────────────────────────────
  if (!data.smokeFreeStart) {
    challenges.push({ id:"c_smoke_start", emoji:"🚭", cat:"Salud", text:"Establece tu fecha de inicio sin tabaco", target: 1, unit: "acción" });
  } else if (smokeFreeDays < 7) {
    challenges.push({ id:"c_smoke_week", emoji:"🌱", cat:"Salud", text:"Llega a 7 días sin fumar", target: 7, unit: "días" });
  } else if (smokeFreeDays < 30) {
    const next = smokeFreeDays < 14 ? 14 : smokeFreeDays < 21 ? 21 : 30;
    challenges.push({ id:"c_smoke_" + next, emoji:"🌿", cat:"Salud", text:`Llega a ${next} días sin fumar`, target: next, unit: "días" });
  } else {
    challenges.push({ id:"c_smoke_keep", emoji:"🌳", cat:"Salud", text:`Mantén ${smokeFreeDays + 7} días sin fumar`, target: smokeFreeDays + 7, unit: "días" });
  }

  // ── Salud: peso ────────────────────────────────────────────────────────────
  if (data.weight?.length === 0) {
    challenges.push({ id:"c_weight_first", emoji:"⚖️", cat:"Salud", text:"Registra tu primer peso de la semana", target: 1, unit: "registro" });
  } else {
    challenges.push({ id:"c_weight_3", emoji:"⚖️", cat:"Salud", text:"Regístra tu peso 3 veces esta semana", target: 3, unit: "registros" });
  }

  // ── Diario ─────────────────────────────────────────────────────────────────
  const diary = data.diary || [];
  if (diary.length === 0) {
    challenges.push({ id:"c_diary_first", emoji:"✍️", cat:"Diario", text:"Escribe tu primera entrada en el diario", target: 1, unit: "entrada" });
  } else {
    challenges.push({ id:"c_diary_3", emoji:"📝", cat:"Diario", text:"Escribe 3 entradas en el diario esta semana", target: 3, unit: "entradas" });
  }

  // Return max 6 (most relevant)
  return challenges.slice(0, 6);
}

function WeeklyChallenge({ data, setData, totalKm, totalDesnivel, smokeFreeDays }) {
  const weekKey = getWeekKey();
  const weekData = data.weeklyChallenge || {};
  const isCurrentWeek = weekData.weekKey === weekKey;

  // Generate or reuse challenges for this week
  const challenges = isCurrentWeek && weekData.challenges?.length
    ? weekData.challenges
    : generateChallenges(data, totalKm, totalDesnivel, smokeFreeDays);

  // Persist if new week
  useEffect(() => {
    if (!isCurrentWeek) {
      setData(d => ({ ...d, weeklyChallenge: { weekKey, challenges, done: {} } }));
    }
  }, [weekKey]);

  const done = (isCurrentWeek ? weekData.done : {}) || {};
  const completedCount = Object.values(done).filter(Boolean).length;
  const total = challenges.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  function toggle(id) {
    haptic([10]);
    setData(d => ({
      ...d,
      weeklyChallenge: {
        ...d.weeklyChallenge,
        done: { ...(d.weeklyChallenge?.done || {}), [id]: !done[id] },
      }
    }));
  }

  // Monday label
  const [y, m, day] = weekKey.split("-").map(Number);
  const monDate = new Date(y, m-1, day);
  const weekLabel = monDate.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  const sunDate = new Date(monDate); sunDate.setDate(monDate.getDate() + 6);
  const sunLabel = sunDate.toLocaleDateString("es-ES", { day: "numeric", month: "short" });

  const CAT_C = { Running: C.orange, Montaña: "#8B5CF6", Salud: "#22C55E", Diario: "#F59E0B" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header card */}
      <Card dark style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700 }}>Retos semanales</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", marginTop: 3 }}>{weekLabel} — {sunLabel}</div>
          </div>
          <div style={{ textAlign: "center", background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 14px", minWidth: 60 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: pct === 100 ? "#22C55E" : C.orange, lineHeight: 1 }}>{completedCount}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 2 }}>de {total}</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 6, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, background: pct === 100 ? "#22C55E" : C.orange, height: "100%", borderRadius: 99, transition: "width 0.5s" }} />
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>
          {pct === 100 ? "🎉 ¡Semana completada! Increíble trabajo." : `${pct}% completado — ¡sigue así!`}
        </div>
      </Card>

      {/* Challenge list */}
      <Card>
        {challenges.map((c, i) => {
          const isDone = !!done[c.id];
          const cc = CAT_C[c.cat] || C.orange;
          return (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "13px 0",
              borderBottom: i < challenges.length - 1 ? `1px solid ${C.greyLight}` : "none",
              opacity: isDone ? 0.65 : 1,
            }}>
              <button onClick={() => toggle(c.id)} style={{
                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                border: `2.5px solid ${isDone ? cc : C.greyMid}`,
                background: isDone ? cc : "transparent",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", transition: "all 0.2s",
              }}>
                {isDone && Icon.check}
              </button>
              <div style={{ fontSize: 20, flexShrink: 0 }}>{c.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: isDone ? 500 : 700, color: isDone ? C.textMuted : C.text, textDecoration: isDone ? "line-through" : "none" }}>{c.text}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: cc, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.cat}</div>
              </div>
            </div>
          );
        })}
      </Card>

      <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center", padding: "4px 0 8px" }}>
        Los retos se regeneran automáticamente cada lunes según tu progreso
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOALS
// ═══════════════════════════════════════════════════════════════════════════════
// GOAL_TYPES is a function so colors are read at render time (dark mode safe)
function GOAL_TYPES() {
  return [
    { id: "monthly",  label: "Mensual",     labelPlural: "Mensuales",   color: C.orange },
    { id: "annual",   label: "Anual",       labelPlural: "Anuales",     color: "#8B5CF6" },
    { id: "longterm", label: "Largo plazo", labelPlural: "Largo plazo", color: C.text },
  ];
}

// Parse "dd/mm/yyyy" or "dd/mm/yy" → Date (for sorting)
function parseGoalDate(str) {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length < 2) return null;
  const d = parseInt(parts[0]), m = parseInt(parts[1]) - 1;
  const y = parts[2] ? (parseInt(parts[2]) < 100 ? 2000 + parseInt(parts[2]) : parseInt(parts[2])) : new Date().getFullYear();
  const dt = new Date(y, m, d);
  return isNaN(dt.getTime()) ? null : dt;
}

function GoalItem({ g, onToggle, onDelete, typeColor }) {
  const due = g.dueDate ? parseGoalDate(g.dueDate) : null;
  const isOverdue = due && !g.done && due < new Date();
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.greyLight}` }}>
      <button onClick={onToggle} style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 1,
        border: `2px solid ${g.done ? typeColor : C.greyMid}`,
        background: g.done ? typeColor : "transparent", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", color: C.white,
      }}>
        {g.done && Icon.check}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: g.done ? C.textMuted : C.text, textDecoration: g.done ? "line-through" : "none" }}>{g.text}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap", alignItems: "center" }}>
          {g.label && <span style={{ fontSize: 10, fontWeight: 700, color: typeColor }}>{g.label}</span>}
          {g.dueDate && (
            <span style={{ fontSize: 10, color: isOverdue ? C.red : C.textMuted, fontWeight: isOverdue ? 700 : 400 }}>
              {isOverdue ? "⚠ " : ""}Fecha: {g.dueDate}
            </span>
          )}
          {g.createdDate && <span style={{ fontSize: 10, color: C.greyMid }}>Creado: {g.createdDate}</span>}
        </div>
      </div>
      <button onClick={onDelete} style={{ background: "none", border: "none", cursor: "pointer", color: C.greyMid, padding: 4, flexShrink: 0 }}>
        {Icon.trash}
      </button>
    </div>
  );
}

function Goals({ data, setData }) {
  const [view, setView] = useState("monthly"); // monthly | annual | longterm | timeline
  const [goalText, setGoalText] = useState("");
  const [goalLabel, setGoalLabel] = useState("");
  const [goalDueDate, setGoalDueDate] = useState("");

  function addGoal() {
    if (!goalText.trim()) return;
    const typeId = view === "timeline" ? "monthly" : view;
    setData(d => ({
      ...d,
      goals: {
        ...d.goals,
        [typeId]: [...(d.goals[typeId] || []), {
          text: goalText, label: goalLabel,
          dueDate: goalDueDate, done: false,
          createdDate: new Date().toLocaleDateString("es-ES"),
        }],
      }
    }));
    setGoalText(""); setGoalLabel(""); setGoalDueDate("");
  }

  function toggleGoal(type, idx) {
    setData(d => ({ ...d, goals: { ...d.goals, [type]: d.goals[type].map((g, i) => i === idx ? { ...g, done: !g.done } : g) } }));
  }

  function deleteGoal(type, idx) {
    setData(d => ({ ...d, goals: { ...d.goals, [type]: d.goals[type].filter((_, i) => i !== idx) } }));
  }

  // All goals merged and sorted by dueDate (goals without date go to the end)
  const allGoals = GOAL_TYPES().flatMap(gt =>
    (data.goals[gt.id] || []).map((g, i) => ({ ...g, typeId: gt.id, typeLabel: gt.labelPlural, typeColor: gt.color, idx: i }))
  ).sort((a, b) => {
    const da = parseGoalDate(a.dueDate), db = parseGoalDate(b.dueDate);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return da - db;
  });

  const totalGoals = allGoals.length;
  const doneGoals = allGoals.filter(g => g.done).length;

  const VIEWS = [
    ...GOAL_TYPES().map(gt => ({ id: gt.id, label: gt.labelPlural.substring(0, 5) + "." })),
    { id: "timeline", label: "Todos" },
  ];

  const activeType = GOAL_TYPES().find(g => g.id === view);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Summary */}
      <Card dark style={{ padding: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
          {GOAL_TYPES().map(gt => {
            const goals = data.goals[gt.id] || [];
            const done = goals.filter(g => g.done).length;
            return (
              <div key={gt.id} style={{ padding: "12px 6px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: done === goals.length && goals.length > 0 ? gt.color : C.white }}>
                  {done}/{goals.length}
                </div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.5 }}>{gt.label.substring(0,4)}.</div>
              </div>
            );
          })}
          <div style={{ padding: "12px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: doneGoals === totalGoals && totalGoals > 0 ? C.orange : C.white }}>{doneGoals}/{totalGoals}</div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.5 }}>Total</div>
          </div>
        </div>
      </Card>

      {/* View selector */}
      <div style={{ display: "flex", gap: 4, background: C.white, borderRadius: 16, padding: 4 }}>
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setView(v.id)} style={{
            flex: 1, border: "none", borderRadius: 12, padding: "9px 2px",
            background: view === v.id ? (C.isDark ? C.orange : C.black) : "transparent",
            color: view === v.id ? C.white : C.textMuted,
            fontSize: 11, fontWeight: 700, cursor: "pointer",
          }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Add form — only show for category views */}
      {view !== "timeline" && (
        <Card>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>
            Nuevo — {activeType?.labelPlural}
          </div>
          <Inp label="Objetivo *" type="text" value={goalText} onChange={setGoalText} placeholder="Correr media maratón..." />
          <Inp label="Etiqueta" type="text" value={goalLabel} onChange={setGoalLabel} placeholder="Running, Montaña..." />
          <Inp label="Fecha límite" type="text" value={goalDueDate} onChange={setGoalDueDate} placeholder="26/04/2026" />
          <Btn variant="primary" onClick={addGoal}>Añadir objetivo</Btn>
        </Card>
      )}

      {/* TIMELINE VIEW — todos los objetivos por fecha */}
      {view === "timeline" && (
        <Card>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Todos los objetivos</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14 }}>Ordenados por fecha límite</div>
          {allGoals.length === 0 ? (
            <div style={{ textAlign: "center", padding: "24px 0", color: C.textMuted, fontSize: 13 }}>
              Aún no hay objetivos. Añade desde las pestañas de categoría.
            </div>
          ) : (
            allGoals.map((g, i) => {
              const typeColor = g.typeColor;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.greyLight}` }}>
                  {/* Timeline dot */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 3 }}>
                    <div style={{
                      width: 12, height: 12, borderRadius: "50%",
                      background: g.done ? typeColor : C.greyLight,
                      border: `2px solid ${typeColor}`,
                    }}/>
                    {i < allGoals.length - 1 && <div style={{ width: 1.5, flex: 1, minHeight: 20, background: C.greyLight, marginTop: 4 }}/>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: g.done ? C.textMuted : C.text, textDecoration: g.done ? "line-through" : "none" }}>{g.text}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 3, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: typeColor, background: typeColor + "18", borderRadius: 5, padding: "2px 6px" }}>{g.typeLabel}</span>
                      {g.label && <span style={{ fontSize: 10, color: C.textMuted }}>{g.label}</span>}
                      {g.dueDate && (() => {
                        const due = parseGoalDate(g.dueDate);
                        const overdue = due && !g.done && due < new Date();
                        return <span style={{ fontSize: 10, color: overdue ? C.red : C.textMuted, fontWeight: overdue ? 700 : 400 }}>{overdue ? "⚠ " : ""}{g.dueDate}</span>;
                      })()}
                    </div>
                  </div>
                  <button onClick={() => toggleGoal(g.typeId, g.idx)} style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    border: `2px solid ${g.done ? typeColor : C.greyMid}`,
                    background: g.done ? typeColor : "transparent", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", color: C.white,
                  }}>
                    {g.done && Icon.check}
                  </button>
                </div>
              );
            })
          )}
        </Card>
      )}

      {/* Category goals list */}
      {view !== "timeline" && (() => {
        const goals = data.goals[view] || [];
        const color = GOAL_TYPES().find(g => g.id === view)?.color || C.orange;
        if (goals.length === 0) return (
          <div style={{ textAlign: "center", padding: "24px 0", color: C.textMuted, fontSize: 13 }}>
            No hay objetivos en esta categoría todavía.
          </div>
        );
        return (
          <Card>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>{GOAL_TYPES().find(g => g.id === view)?.labelPlural}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>{goals.filter(g => g.done).length} de {goals.length} completados</div>
            {goals.map((g, i) => (
              <GoalItem key={i} g={g} typeColor={color}
                onToggle={() => toggleGoal(view, i)}
                onDelete={() => deleteGoal(view, i)} />
            ))}
          </Card>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BODY
// ═══════════════════════════════════════════════════════════════════════════════
function Body({ data, setData, lastWeight, weightLost, lastVo2 }) {
  const avatarRef = useRef();
  const photoRef = useRef();
  const [editingProfile, setEditingProfile] = useState(false);
  const [nameForm, setNameForm] = useState(data.profile?.name || "");
  const [photoNote, setPhotoNote] = useState("");
  const [viewingPhoto, setViewingPhoto] = useState(null);

  function handleProgressPhoto(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString("es-ES"),
        isoDate: new Date().toISOString(),
        dataUrl: ev.target.result,
        note: photoNote,
        weight: lastWeight,
      };
      setData(d => ({ ...d, progressPhotos: [entry, ...(d.progressPhotos || [])] }));
      setPhotoNote("");
      haptic([20, 30, 20]);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function deletePhoto(id) {
    setData(d => ({ ...d, progressPhotos: (d.progressPhotos||[]).filter(p => p.id !== id) }));
  }

  function handleAvatar(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setData(d => ({ ...d, profile: { ...(d.profile||{}), avatar: ev.target.result } }));
    reader.readAsDataURL(file);
  }
  function saveName() {
    setData(d => ({ ...d, profile: { ...(d.profile||{}), name: nameForm } }));
    setEditingProfile(false);
  }
  const [weightForm, setWeightForm] = useState("");
  const [vo2Form, setVo2Form] = useState("");
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetWeightForm, setTargetWeightForm] = useState(String(data.targetWeight));
  const [targetDateForm, setTargetDateForm] = useState(data.targetDate || "");

  function addWeight() {
    if (!weightForm) return;
    setData(d => ({ ...d, weight: [...d.weight, { value: parseFloat(weightForm), date: new Date().toLocaleDateString("es-ES") }] }));
    setWeightForm("");
  }

  function addVo2() {
    if (!vo2Form) return;
    setData(d => ({ ...d, vo2max: [...d.vo2max, { value: parseFloat(vo2Form), date: new Date().toLocaleDateString("es-ES") }] }));
    setVo2Form("");
  }

  function saveTarget() {
    setData(d => ({ ...d, targetWeight: parseFloat(targetWeightForm) || d.targetWeight, targetDate: targetDateForm }));
    setEditingTarget(false);
  }

  const imc = lastWeight / (1.73 * 1.73);
  const weightToGo = lastWeight - data.targetWeight;
  const weightProgress = Math.min(100, (weightLost / (data.initialWeight - data.targetWeight)) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* PROFILE HERO */}
      <Card dark style={{ padding: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Avatar */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              onClick={() => avatarRef.current?.click()}
              style={{
                width: 76, height: 76, borderRadius: "50%",
                background: C.orange, overflow: "hidden", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "3px solid rgba(255,255,255,0.15)",
              }}
            >
              {data.profile?.avatar
                ? <img src={data.profile.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{(data.profile?.name||"7+7").charAt(0).toUpperCase()}</span>
              }
            </div>
            <div style={{ position: "absolute", bottom: 0, right: 0, background: C.orange, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0A0A0A" }}>
              {Icon.camera}
            </div>
            <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatar} style={{ display: "none" }} />
          </div>
          {/* Name + stats */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingProfile ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={nameForm} onChange={e => setNameForm(e.target.value)}
                  placeholder="Tu nombre..."
                  autoFocus
                  style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "7px 10px", color: "#fff", fontSize: 15, fontWeight: 700, outline: "none", fontFamily: "inherit" }}
                />
                <button onClick={saveName} style={{ background: C.orange, border: "none", borderRadius: 10, padding: "7px 12px", color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>OK</button>
                <button onClick={() => setEditingProfile(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: "7px 10px", color: "rgba(255,255,255,0.85)", cursor: "pointer" }}>{Icon.x}</button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {data.profile?.name || "Atleta 7+7"}
                </div>
                <button onClick={() => { setNameForm(data.profile?.name||""); setEditingProfile(true); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", padding: 2 }}>{Icon.pen}</button>
              </div>
            )}
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)" }}>
              {lastWeight.toFixed(1)} kg · IMC {imc.toFixed(1)} · {imc > 25 ? "Sobrepeso leve" : "Normal"}
            </div>
            {weightLost > 0 && (
              <div style={{ marginTop: 6, background: C.orange, borderRadius: 8, padding: "3px 10px", display: "inline-block" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>↓ {weightLost.toFixed(1)} kg perdidos</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Weight bar — like Figma weight card */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Peso</div>
          <button onClick={() => { setTargetWeightForm(String(data.targetWeight)); setTargetDateForm(data.targetDate || ""); setEditingTarget(!editingTarget); }}
            style={{ background: "none", border: "none", cursor: "pointer", color: C.textMuted, display: "flex" }}>
            {Icon.edit}
          </button>
        </div>
        <div style={{ background: C.greyLight, borderRadius: 99, height: 8, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ width: `${weightProgress}%`, background: C.orange, height: "100%", borderRadius: 99, transition: "width 0.6s" }}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Inicio</div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{data.initialWeight}kg</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Ahora</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.orange }}>{lastWeight.toFixed(1)}kg</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 2 }}>Meta</div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{data.targetWeight}kg</div>
          </div>
        </div>

        {editingTarget && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.greyLight}` }}>
            <Inp label="Peso objetivo (kg)" value={targetWeightForm} onChange={setTargetWeightForm} placeholder="72.3" step="0.1" />
            <Inp label="Fecha objetivo" type="text" value={targetDateForm} onChange={setTargetDateForm} placeholder="26/04/2026" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Btn variant="primary" onClick={saveTarget}>Guardar</Btn>
              <Btn variant="ghost" onClick={() => setEditingTarget(false)}>Cancelar</Btn>
            </div>
          </div>
        )}

        <button onClick={() => {}} style={{ display: "none" }}/>
      </Card>

      {/* Log weight */}
      {/* Weight form inline */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Peso de hoy</div>
        <Inp label="Peso" value={weightForm} onChange={setWeightForm} placeholder="81.5" unit="kg" step="0.1" />
        <Btn variant="primary" onClick={addWeight}>Guardar</Btn>
      </Card>

      {/* Weight chart */}
      {data.weight.length >= 2 && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>
            Evolución de peso
          </div>
          <LineChart data={data.weight} color={C.orange} />
        </Card>
      )}

      {/* VO2max dark card */}
      <Card dark style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.white, textTransform: "uppercase", letterSpacing: 0.5 }}>VO2max</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Apple Health → Actividad → VO2max</div>
          </div>
          {lastVo2 && <div style={{ fontSize: 32, fontWeight: 900, color: C.orange }}>{lastVo2}</div>}
        </div>
        <Inp label="VO2max" value={vo2Form} onChange={setVo2Form} placeholder="42.5" unit="ml/kg/min" step="0.1" />
        <Btn variant="orange" onClick={addVo2}>Guardar VO2max</Btn>
      </Card>

      {/* VO2max chart */}
      {data.vo2max.length >= 2 && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
            Evolución VO2max
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 14 }}>
            ml/kg/min · Objetivo running avanzado: 50+
          </div>
          <LineChart data={data.vo2max} color="#6366F1" unit="ml/kg/min" gradId="lg2" minPad={3} maxPad={3} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.greyLight}` }}>
            {[["Sedentario", "<35"], ["Básico", "35-42"], ["Bueno", "43-50"], ["Elite", "50+"]].map(([l, v]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.text }}>{v}</div>
                <div style={{ fontSize: 9, color: C.textMuted }}>{l}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reference table */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 14 }}>Referencias</div>
        {[
          ["Peso inicial", `${data.initialWeight} kg`],
          ["Objetivo", `${data.targetWeight} kg`, true],
          ["Fecha objetivo", data.targetDate || "Sin fecha", true],
          ["Ideal running", "68–72 kg"],
          ["Altura", "173 cm"],
          ["IMC actual", `${imc.toFixed(1)}`],
        ].map(([k, v, hi], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.greyLight}` }}>
            <span style={{ fontSize: 13, color: C.textMuted }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: hi ? C.orange : C.text }}>{v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// RETO 7+7
// ═══════════════════════════════════════════════════════════════════════════════

// ── RETO ITEM ────────────────────────────────────────────────────────────────
function RetoItem({ item, isSummit, ch, editing, editNote, editDate, setEditNote, setEditDate, onToggle, onSave, onCancelEdit, onStartEdit }) {
  const done = !!ch[item.id]?.done;
  const note = ch[item.id]?.note;
  const date = ch[item.id]?.date;
  const isEditing = editing === item.id;
  const accentColor = isSummit ? (DIFF_COLOR[item.diff] || C.orange) : C.orange;

  return (
    <div key={item.id}>
      <div
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 0",
          borderBottom: `1px solid ${C.greyLight}`,
          opacity: done ? 0.75 : 1,
        }}
      >
        {/* Checkbox */}
        <button
          onClick={() => onToggle(item.id)}
          style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            border: `2.5px solid ${done ? accentColor : C.greyMid}`,
            background: done ? accentColor : "transparent",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: C.white, transition: "all 0.2s",
          }}
        >
          {done && Icon.check}
        </button>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 15 }}>{item.emoji}</span>
            <span style={{
              fontSize: 14, fontWeight: 700,
              color: done ? C.textMuted : C.text,
              textDecoration: done ? "line-through" : "none",
            }}>{item.name}</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 3, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: C.textMuted }}>{item.country}</span>
            {isSummit && (
              <>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.text }}>{item.alt}</span>
                <span style={{
                  fontSize: 9, fontWeight: 800, color: accentColor,
                  background: accentColor + "18", borderRadius: 5, padding: "1px 6px",
                }}>{item.diff}</span>
              </>
            )}
            {!isSummit && (
              <span style={{ fontSize: 10, color: C.textMuted }}>{item.month} {item.year}</span>
            )}
            {isSummit && !done && (
              <span style={{ fontSize: 10, color: C.greyMid }}>Plan: {item.year}</span>
            )}
          </div>
          {done && date && (
            <div style={{ fontSize: 10, color: accentColor, fontWeight: 700, marginTop: 3 }}>
              Completado {date}
            </div>
          )}
          {done && note && (
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2, fontStyle: "italic" }}>{note}</div>
          )}
        </div>

        {/* Year badge or done badge */}
        {done ? (
          <div style={{
            background: accentColor + "18", borderRadius: 8, padding: "4px 8px",
            fontSize: 11, fontWeight: 800, color: accentColor, flexShrink: 0,
          }}>OK</div>
        ) : (
          <div style={{
            background: C.bg, borderRadius: 8, padding: "4px 8px",
            fontSize: 11, fontWeight: 700, color: C.textMuted, flexShrink: 0,
          }}>{item.year}</div>
        )}
      </div>

      {/* Inline edit panel */}
      {isEditing && (
        <div style={{
          background: C.bg, borderRadius: 14, padding: 14, marginTop: 4, marginBottom: 8,
          border: `1.5px solid ${accentColor}44`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 12 }}>
            Registrar: {item.name}
          </div>
          <Inp label="Fecha de consecución" type="text" value={editDate} onChange={setEditDate} placeholder="15/10/2027" />
          <Inp label="Nota (opcional)" type="text" value={editNote} onChange={setEditNote} placeholder="Tiempo, condiciones, sensaciones..." />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Btn variant="orange" onClick={() => onSave(item.id)} style={{ fontSize: 13, padding: "11px" }}>
              Confirmar
            </Btn>
            <Btn variant="ghost" onClick={onCancelEdit} style={{ fontSize: 13, padding: "11px" }}>
              Cancelar
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}


function Reto({ data, setData }) {
  const ch = data.challenge || {};
  const [editing, setEditing] = useState(null); // id being edited
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState("");

  const summitsDone = SUMMITS.filter(s => ch[s.id]?.done).length;
  const majorsDone  = MAJORS.filter(m => ch[m.id]?.done).length;
  const totalDone   = summitsDone + majorsDone;
  const totalPct    = Math.round((totalDone / 14) * 100);
  const summitsPct  = Math.round((summitsDone / 7) * 100);
  const majorsPct   = Math.round((majorsDone / 7) * 100);

  function toggle(id) {
    const current = ch[id] || {};
    if (current.done) {
      setData(d => ({ ...d, challenge: { ...d.challenge, [id]: { ...current, done: false } } }));
    } else {
      // open edit panel to add date+note when marking done
      setEditing(id);
      setEditDate(current.date || new Date().toLocaleDateString("es-ES"));
      setEditNote(current.note || "");
    }
  }

  function saveEdit(id) {
    setData(d => ({ ...d, challenge: { ...d.challenge, [id]: { done: true, date: editDate, note: editNote } } }));
    setEditing(null);
    setEditNote("");
    setEditDate("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Hero progress card */}
      <Card dark style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>
              Progreso total
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: totalPct === 100 ? C.orange : C.white, lineHeight: 1, letterSpacing: -2 }}>
              {totalPct}<span style={{ fontSize: 20, fontWeight: 500, letterSpacing: 0 }}>%</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              {totalDone} de 14 objetivos completados
            </div>
          </div>
          <div style={{ color: C.orange }}>{Icon.trophy}</div>
        </div>

        {/* Two progress bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>7 Summits</span>
              <span style={{ fontSize: 11, color: C.orange, fontWeight: 800 }}>{summitsDone}/7 · {summitsPct}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 7, overflow: "hidden" }}>
              <div style={{ width: `${summitsPct}%`, background: C.orange, height: "100%", borderRadius: 99, transition: "width 0.6s" }} />
            </div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8 }}>7 Majors</span>
              <span style={{ fontSize: 11, color: C.white, fontWeight: 800 }}>{majorsDone}/7 · {majorsPct}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 7, overflow: "hidden" }}>
              <div style={{ width: `${majorsPct}%`, background: C.white, height: "100%", borderRadius: 99, transition: "width 0.6s" }} />
            </div>
          </div>
        </div>

        {/* Mini stat grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden", marginTop: 16 }}>
          {[
            { label: "Completados", value: totalDone },
            { label: "Pendientes", value: 14 - totalDone },
            { label: "Años restantes", value: Math.max(0, 2036 - new Date().getFullYear()) },
          ].map((s, i) => (
            <div key={i} style={{ padding: "10px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: i === 0 ? C.orange : C.white }}>{s.value}</div>
              <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 7 SUMMITS */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: -0.3 }}>7 Summits</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.orange }}>{summitsDone}/7</div>
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>
          Las 7 cimas más altas de cada continente
        </div>
        <div style={{ background: C.greyLight, borderRadius: 99, height: 4, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ width: `${summitsPct}%`, background: C.orange, height: "100%", borderRadius: 99, transition: "width 0.6s" }} />
        </div>
        {SUMMITS.map(s => (
          <RetoItem key={s.id} item={s} isSummit={true} ch={ch}
            editing={editing} editNote={editNote} editDate={editDate}
            setEditNote={setEditNote} setEditDate={setEditDate}
            onToggle={toggle} onSave={saveEdit} onCancelEdit={() => setEditing(null)} />
        ))}
      </Card>

      {/* 7 MAJORS */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: -0.3 }}>7 Majors</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.text }}>{majorsDone}/7</div>
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>
          Abbott World Marathon Majors + Sydney
        </div>
        <div style={{ background: C.greyLight, borderRadius: 99, height: 4, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ width: `${majorsPct}%`, background: C.isDark ? "#FFFFFF" : "#111111", height: "100%", borderRadius: 99, transition: "width 0.6s" }} />
        </div>
        {MAJORS.map(m => (
          <RetoItem key={m.id} item={m} isSummit={false} ch={ch}
            editing={editing} editNote={editNote} editDate={editDate}
            setEditNote={setEditNote} setEditDate={setEditDate}
            onToggle={toggle} onSave={saveEdit} onCancelEdit={() => setEditing(null)} />
        ))}
      </Card>

      {/* Legend difficulty */}
      <Card>
        <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>Dificultad técnica — Summits</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(DIFF_COLOR).map(([label, color]) => (
            <div key={label} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: color + "14", borderRadius: 8, padding: "5px 10px",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// SHARE CARD — tarjeta visual para RRSS
// ═══════════════════════════════════════════════════════════════════════════════
function ShareCard({ data, onClose, totalKm, totalDesnivel, smokeFreeDays, lastWeight }) {
  const canvasRef = useRef();
  const ch = data.challenge || {};
  const summitsDone = SUMMITS.filter(s => ch[s.id]?.done).length;
  const majorsDone  = MAJORS.filter(m => ch[m.id]?.done).length;
  const totalDone   = summitsDone + majorsDone;
  const pct         = Math.round((totalDone / 14) * 100);
  const weightLost  = data.initialWeight - lastWeight;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 1080, H = 1080;
    canvas.width = W; canvas.height = H;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#111111");
    grad.addColorStop(1, "#1a1a1a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Orange accent bar top
    ctx.fillStyle = "#FF6B00";
    ctx.fillRect(0, 0, W, 10);

    // Decorative circles
    ctx.save();
    ctx.globalAlpha = 0.07;
    ctx.fillStyle = "#FF6B00";
    ctx.beginPath(); ctx.arc(W * 0.85, H * 0.18, 280, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(W * 0.05, H * 0.82, 180, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // Logo / title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 96px -apple-system, Helvetica, sans-serif";
    ctx.fillText("7+7", 80, 160);
    ctx.fillStyle = "#FF6B00";
    ctx.font = "bold 96px -apple-system, Helvetica, sans-serif";
    ctx.fillText("TRACKER", 260, 160);

    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "32px -apple-system, Helvetica, sans-serif";
    ctx.fillText("Summits · Majors · 2026–2036", 80, 215);

    // Divider
    ctx.fillStyle = "#FF6B00";
    ctx.fillRect(80, 248, 120, 4);

    // Big % progress
    ctx.fillStyle = "#FF6B00";
    ctx.font = "bold 200px -apple-system, Helvetica, sans-serif";
    ctx.fillText(`${pct}%`, 80, 520);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "38px -apple-system, Helvetica, sans-serif";
    ctx.fillText("del reto completado", 80, 575);

    // Stats row
    const stats = [
      { v: `${summitsDone}/7`, l: "Cimas" },
      { v: `${majorsDone}/7`,  l: "Majors" },
      { v: `${Math.round(totalKm)}`,  l: "km running" },
      { v: `${smokeFreeDays}`,  l: "días sin fumar" },
    ];
    const boxW = 220, boxH = 160, startX = 80, startY = 660, gap = 16;
    stats.forEach((s, i) => {
      const x = startX + i * (boxW + gap);
      // box bg
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      roundRect(ctx, x, startY, boxW, boxH, 20);
      ctx.fill();
      // value
      ctx.fillStyle = i < 2 ? "#FF6B00" : "#FFFFFF";
      ctx.font = `bold 56px -apple-system, Helvetica, sans-serif`;
      ctx.fillText(s.v, x + 20, startY + 78);
      // label
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.font = "26px -apple-system, Helvetica, sans-serif";
      ctx.fillText(s.l, x + 20, startY + 128);
    });

    // Weight lost badge
    if (weightLost > 0) {
      ctx.fillStyle = "#22C55E";
      roundRect(ctx, 80, 870, 340, 80, 16);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 34px -apple-system, Helvetica, sans-serif";
      ctx.fillText(`↓ ${weightLost.toFixed(1)} kg perdidos`, 104, 920);
    }

    // Hashtag
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.font = "28px -apple-system, Helvetica, sans-serif";
    ctx.fillText("#7plus7journey  #7summits  #worldmajors", 80, 1030);

    // Orange bar bottom
    ctx.fillStyle = "#FF6B00";
    ctx.fillRect(0, H - 10, W, 10);

  }, []);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function download() {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "7plus7_progreso.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.85)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: 16,
    }}>
      <div style={{
        background: C.white, borderRadius: 20, padding: 16,
        width: "100%", maxWidth: 400,
        display: "flex", flexDirection: "column", gap: 12,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text }}>Tarjeta para RRSS</div>
          <button onClick={onClose} style={{ background: C.greyLight, border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 16, color: C.text }}>✕</button>
        </div>
        {/* Preview scaled */}
        <div style={{ width: "100%", borderRadius: 12, overflow: "hidden", background: "#111" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "auto", display: "block" }} />
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center" }}>
          Imagen 1080×1080px lista para Instagram/Twitter
        </div>
        <button onClick={download} style={{
          background: C.orange, color: "#fff", border: "none",
          borderRadius: 14, padding: "13px", fontSize: 14, fontWeight: 700,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          Descargar imagen
        </button>
        <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center", lineHeight: 1.5 }}>
          En iPhone: mantén pulsada la imagen → "Guardar en Fotos"
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIARIO
// ═══════════════════════════════════════════════════════════════════════════════
const MOODS = [
  { id: "fuego",    emoji: "🔥", label: "En racha" },
  { id: "bien",     emoji: "💪", label: "Bien" },
  { id: "normal",   emoji: "😐", label: "Normal" },
  { id: "cansado",  emoji: "😴", label: "Cansado" },
  { id: "duro",     emoji: "💀", label: "Duro" },
];
const TAGS = ["Running", "Montaña", "Nutrición", "Mental", "Descanso", "Tabaco", "Vida", "Reto"];

function Diario({ data, setData }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("bien");
  const [tag, setTag] = useState("Vida");
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const textRef = useRef();

  const today = new Date().toLocaleDateString("es-ES");
  const entries = data.diary || [];

  function addEntry() {
    if (!text.trim()) return;
    const entry = {
      id: Date.now(),
      date: today,
      isoDate: new Date().toISOString(),
      text: text.trim(),
      mood,
      tag,
    };
    setData(d => ({ ...d, diary: [entry, ...(d.diary || [])] }));
    setText("");
  }

  function deleteEntry(id) {
    setData(d => ({ ...d, diary: (d.diary || []).filter(e => e.id !== id) }));
  }

  const filtered = entries.filter(e => {
    if (!search) return true;
    return e.text.toLowerCase().includes(search.toLowerCase()) || e.tag.toLowerCase().includes(search.toLowerCase());
  });

  // streak: consecutive days with entries
  const daySet = new Set(entries.map(e => e.date));
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    if (daySet.has(d.toLocaleDateString("es-ES"))) streak++;
    else if (i > 0) break;
  }

  const moodCurrent = MOODS.find(m => m.id === mood);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Stats header */}
      <Card dark style={{ padding: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
          {[
            { v: entries.length,          l: "entradas" },
            { v: `${streak}d`,            l: "racha actual" },
            { v: daySet.size,             l: "días registrados" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "12px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: i === 0 ? C.orange : "#fff" }}>{s.v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: 0.6, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* New entry form */}
      <Card style={{ border: `1.5px solid ${C.greyLight}` }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: C.text, marginBottom: 12 }}>
          {today} — Nueva entrada
        </div>

        {/* Mood selector */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.textMuted, marginBottom: 8 }}>Estado</div>
          <div style={{ display: "flex", gap: 8 }}>
            {MOODS.map(m => (
              <button key={m.id} onClick={() => setMood(m.id)} style={{
                flex: 1, border: `2px solid ${mood === m.id ? C.orange : C.greyLight}`,
                background: mood === m.id ? C.orangeLight : C.bg,
                borderRadius: 12, padding: "8px 2px", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              }}>
                <span style={{ fontSize: 20 }}>{m.emoji}</span>
                <span style={{ fontSize: 8, fontWeight: 700, color: mood === m.id ? C.orange : C.textMuted }}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tag selector */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.textMuted, marginBottom: 8 }}>Categoría</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TAGS.map(t => (
              <button key={t} onClick={() => setTag(t)} style={{
                border: `1.5px solid ${tag === t ? C.orange : C.greyLight}`,
                background: tag === t ? C.orangeLight : C.bg,
                borderRadius: 20, padding: "5px 12px",
                fontSize: 12, fontWeight: tag === t ? 700 : 500,
                color: tag === t ? C.orange : C.textMuted, cursor: "pointer",
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Text area */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.textMuted, marginBottom: 8 }}>Entrada *</div>
          <textarea
            ref={textRef}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="¿Cómo fue hoy? Entreno, sensaciones, progreso, pensamientos..."
            rows={4}
            style={{
              width: "100%", boxSizing: "border-box",
              background: C.bg, border: `1.5px solid ${C.greyLight}`,
              borderRadius: 12, padding: "11px 14px",
              color: C.text, fontSize: 14, lineHeight: 1.6,
              outline: "none", fontFamily: "inherit", resize: "vertical",
              colorScheme: C.isDark ? "dark" : "light",
            }}
          />
        </div>
        <Btn variant="primary" onClick={addEntry}>Guardar entrada</Btn>
      </Card>

      {/* Search */}
      {entries.length > 0 && (
        <div style={{ position: "relative" }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar entradas..."
            style={{
              width: "100%", boxSizing: "border-box",
              background: C.white, border: `1.5px solid ${C.greyLight}`,
              borderRadius: 14, padding: "12px 16px",
              color: C.text, fontSize: 14, outline: "none", fontFamily: "inherit",
              colorScheme: C.isDark ? "dark" : "light",
            }}
          />
        </div>
      )}

      {/* Entries list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0", color: C.textMuted, fontSize: 13 }}>
          {entries.length === 0 ? "Tu diario está vacío. ¡Empieza a escribir hoy!" : "No hay entradas con ese texto."}
        </div>
      ) : (
        filtered.map((e, i) => {
          const moodObj = MOODS.find(m => m.id === e.mood) || MOODS[1];
          const isExp = expanded === e.id;
          const preview = e.text.length > 120 && !isExp ? e.text.slice(0, 120) + "…" : e.text;
          return (
            <Card key={e.id} style={{ borderLeft: `3px solid ${C.orange}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{moodObj.emoji}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{e.date}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.orange, background: C.orangeLight, borderRadius: 6, padding: "1px 7px" }}>{e.tag}</span>
                      <span style={{ fontSize: 10, color: C.textMuted }}>{moodObj.label}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteEntry(e.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.greyMid, padding: 4 }}>
                  {Icon.trash}
                </button>
              </div>
              <div
                style={{ fontSize: 13, color: C.text, lineHeight: 1.6, cursor: e.text.length > 120 ? "pointer" : "default" }}
                onClick={() => setExpanded(isExp ? null : e.id)}
              >
                {preview}
              </div>
              {e.text.length > 120 && (
                <div style={{ fontSize: 11, color: C.orange, marginTop: 4, cursor: "pointer" }} onClick={() => setExpanded(isExp ? null : e.id)}>
                  {isExp ? "Ver menos" : "Ver más"}
                </div>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// BADGES — logros desbloqueables
// ═══════════════════════════════════════════════════════════════════════════════
function calcBadges(data, totalKm, totalDesnivel, smokeFreeDays) {
  const runs    = data.runs    || [];
  const routes  = data.routes  || [];
  const diary   = data.diary   || [];
  const ch      = data.challenge || {};
  const summitsDone = SUMMITS.filter(s => ch[s.id]?.done).length;
  const majorsDone  = MAJORS.filter(m => ch[m.id]?.done).length;
  const lastWeight  = data.weight?.length > 0 ? data.weight[data.weight.length-1].value : data.initialWeight;
  const weightLost  = data.initialWeight - lastWeight;
  const vo2         = data.vo2max?.length > 0 ? data.vo2max[data.vo2max.length-1].value : 0;
  const photos      = data.progressPhotos?.length || 0;
  const goals       = [...(data.goals?.monthly||[]), ...(data.goals?.annual||[]), ...(data.goals?.longterm||[])];
  const goalsDone   = goals.filter(g => g.done).length;

  // pace helpers
  const pacedRuns = runs.filter(r => r.pace && r.pace.includes(':'));
  const parsePSecs = str => { const p = str?.replace(/[^0-9:]/g,'').split(':'); if (!p||p.length!==2) return null; return parseInt(p[0])*60+parseInt(p[1]); };
  const bestPaceSecs = pacedRuns.length ? Math.min(...pacedRuns.map(r => parsePSecs(r.pace)).filter(Boolean)) : null;
  const sub6  = bestPaceSecs && bestPaceSecs < 360;
  const sub5  = bestPaceSecs && bestPaceSecs < 300;
  const sub430 = bestPaceSecs && bestPaceSecs < 270;
  const sub4  = bestPaceSecs && bestPaceSecs < 240;
  const longestKm = runs.length ? Math.max(...runs.map(r => parseFloat(r.km||0))) : 0;
  const runDays = new Set(runs.map(r => r.date));
  let streak = 0;
  const now2 = new Date();
  for (let i=0; i<1000; i++) { const d=new Date(now2); d.setDate(d.getDate()-i); const k=d.toLocaleDateString("es-ES"); if (runDays.has(k)) streak++; else if (i>0) break; }

  const all = [
    // ── RUNNING: salidas ──────────────────────────────────────────────────────
    { id:"run_1",    cat:"Running", emoji:"👟", name:"Primera zancada",  desc:"Completa tu primera salida de running",    unlocked: runs.length>=1 },
    { id:"run_3",    cat:"Running", emoji:"🏃", name:"3 salidas",        desc:"Completa 3 salidas de running",            unlocked: runs.length>=3 },
    { id:"run_5",    cat:"Running", emoji:"🏃", name:"5 salidas",        desc:"Completa 5 salidas de running",            unlocked: runs.length>=5 },
    { id:"run_10",   cat:"Running", emoji:"💪", name:"10 salidas",       desc:"Completa 10 salidas de running",           unlocked: runs.length>=10 },
    { id:"run_20",   cat:"Running", emoji:"💪", name:"20 salidas",       desc:"Completa 20 salidas de running",           unlocked: runs.length>=20 },
    { id:"run_30",   cat:"Running", emoji:"📅", name:"30 salidas",       desc:"Un mes de constancia (si entrenas a diario)", unlocked: runs.length>=30 },
    { id:"run_50",   cat:"Running", emoji:"🔥", name:"50 salidas",       desc:"Completa 50 salidas de running",           unlocked: runs.length>=50 },
    { id:"run_75",   cat:"Running", emoji:"🔥", name:"75 salidas",       desc:"Completa 75 salidas de running",           unlocked: runs.length>=75 },
    { id:"run_100",  cat:"Running", emoji:"💯", name:"100 salidas",      desc:"Completa 100 salidas de running",          unlocked: runs.length>=100 },
    { id:"run_150",  cat:"Running", emoji:"🦾", name:"150 salidas",      desc:"Completa 150 salidas de running",          unlocked: runs.length>=150 },
    { id:"run_200",  cat:"Running", emoji:"🦾", name:"200 salidas",      desc:"Completa 200 salidas de running",          unlocked: runs.length>=200 },
    { id:"run_300",  cat:"Running", emoji:"👾", name:"300 salidas",      desc:"Completa 300 salidas de running",          unlocked: runs.length>=300 },
    { id:"run_500",  cat:"Running", emoji:"👾", name:"500 salidas",      desc:"Completa 500 salidas de running",          unlocked: runs.length>=500 },
    { id:"run_750",  cat:"Running", emoji:"🌟", name:"750 salidas",      desc:"Completa 750 salidas de running",          unlocked: runs.length>=750 },
    { id:"run_1000", cat:"Running", emoji:"👑", name:"1.000 salidas",    desc:"Leyenda absoluta del running",             unlocked: runs.length>=1000 },
    // ── RUNNING: km ───────────────────────────────────────────────────────────
    { id:"km_5",     cat:"Running", emoji:"🟠", name:"5 km",             desc:"Acumula 5 km de running",                  unlocked: totalKm>=5 },
    { id:"km_10",    cat:"Running", emoji:"🟠", name:"10 km",            desc:"Acumula 10 km de running",                 unlocked: totalKm>=10 },
    { id:"km_25",    cat:"Running", emoji:"🟠", name:"25 km",            desc:"Acumula 25 km de running",                 unlocked: totalKm>=25 },
    { id:"km_50",    cat:"Running", emoji:"🟠", name:"50 km",            desc:"Acumula 50 km de running",                 unlocked: totalKm>=50 },
    { id:"km_100",   cat:"Running", emoji:"🏅", name:"100 km",           desc:"Acumula 100 km de running",                unlocked: totalKm>=100 },
    { id:"km_200",   cat:"Running", emoji:"🏅", name:"200 km",           desc:"Acumula 200 km de running",                unlocked: totalKm>=200 },
    { id:"km_300",   cat:"Running", emoji:"🏅", name:"300 km",           desc:"Acumula 300 km de running",                unlocked: totalKm>=300 },
    { id:"km_500",   cat:"Running", emoji:"🥇", name:"500 km",           desc:"Acumula 500 km de running",                unlocked: totalKm>=500 },
    { id:"km_750",   cat:"Running", emoji:"🥇", name:"750 km",           desc:"Acumula 750 km de running",                unlocked: totalKm>=750 },
    { id:"km_1000",  cat:"Running", emoji:"🌍", name:"1.000 km",         desc:"Acumula 1.000 km de running",              unlocked: totalKm>=1000 },
    { id:"km_1500",  cat:"Running", emoji:"🌍", name:"1.500 km",         desc:"Acumula 1.500 km de running",              unlocked: totalKm>=1500 },
    { id:"km_2000",  cat:"Running", emoji:"🌍", name:"2.000 km",         desc:"Acumula 2.000 km de running",              unlocked: totalKm>=2000 },
    { id:"km_3000",  cat:"Running", emoji:"🌙", name:"3.000 km",         desc:"Acumula 3.000 km de running",              unlocked: totalKm>=3000 },
    { id:"km_5000",  cat:"Running", emoji:"🌙", name:"5.000 km",         desc:"Acumula 5.000 km de running",              unlocked: totalKm>=5000 },
    { id:"km_7500",  cat:"Running", emoji:"🌙", name:"7.500 km",         desc:"Acumula 7.500 km de running",              unlocked: totalKm>=7500 },
    { id:"km_10000", cat:"Running", emoji:"🌑", name:"10.000 km",        desc:"Distancia Luna-Tierra (casi)",             unlocked: totalKm>=10000 },
    { id:"km_15000", cat:"Running", emoji:"🌑", name:"15.000 km",        desc:"Acumula 15.000 km de running",             unlocked: totalKm>=15000 },
    { id:"km_20000", cat:"Running", emoji:"🌑", name:"20.000 km",        desc:"Acumula 20.000 km de running",             unlocked: totalKm>=20000 },
    { id:"km_world", cat:"Running", emoji:"🌐", name:"Vuelta al mundo",  desc:"40.075 km — la vuelta al mundo corriendo", unlocked: totalKm>=40075 },
    // ── RUNNING: distancia en un tirón ────────────────────────────────────────
    { id:"dist_5",   cat:"Running", emoji:"⚡", name:"5 km de un tirón",  desc:"Corre 5 km sin parar",                    unlocked: longestKm>=5 },
    { id:"dist_10",  cat:"Running", emoji:"⚡", name:"10 km de un tirón", desc:"Corre 10 km sin parar",                   unlocked: longestKm>=10 },
    { id:"dist_15",  cat:"Running", emoji:"⚡", name:"15 km de un tirón", desc:"Corre 15 km sin parar",                   unlocked: longestKm>=15 },
    { id:"dist_hm",  cat:"Running", emoji:"⚡", name:"Media maratón",     desc:"Corre 21.1 km sin parar",                 unlocked: longestKm>=21.1 },
    { id:"dist_30",  cat:"Running", emoji:"⚡", name:"30 km de un tirón", desc:"Corre 30 km sin parar",                   unlocked: longestKm>=30 },
    { id:"dist_fm",  cat:"Running", emoji:"⚡", name:"Distancia maratón", desc:"Corre 42.2 km sin parar",                 unlocked: longestKm>=42.2 },
    // ── RUNNING: ritmo ────────────────────────────────────────────────────────
    { id:"pace_6",   cat:"Running", emoji:"🚀", name:"Ritmo sub-6:00",   desc:"Logra un ritmo mejor de 6:00 min/km",      unlocked: sub6 },
    { id:"pace_5",   cat:"Running", emoji:"🚀", name:"Ritmo sub-5:00",   desc:"Logra un ritmo mejor de 5:00 min/km",      unlocked: sub5 },
    { id:"pace_430", cat:"Running", emoji:"🚀", name:"Ritmo sub-4:30",   desc:"Logra un ritmo mejor de 4:30 min/km",      unlocked: sub430 },
    { id:"pace_4",   cat:"Running", emoji:"🚀", name:"Ritmo sub-4:00",   desc:"Logra un ritmo mejor de 4:00 min/km",      unlocked: sub4 },
    // ── RUNNING: racha ────────────────────────────────────────────────────────
    { id:"streak_3",  cat:"Running", emoji:"🔥", name:"Racha 3 días",     desc:"Corre 3 días seguidos",                    unlocked: streak>=3 },
    { id:"streak_7",  cat:"Running", emoji:"🔥", name:"Racha 7 días",     desc:"Corre 7 días seguidos",                    unlocked: streak>=7 },
    { id:"streak_14", cat:"Running", emoji:"🔥", name:"Racha 2 semanas",  desc:"Corre 14 días seguidos",                   unlocked: streak>=14 },
    { id:"streak_30", cat:"Running", emoji:"🔥", name:"Racha 30 días",    desc:"Corre 30 días seguidos",                   unlocked: streak>=30 },
    { id:"streak_60", cat:"Running", emoji:"💥", name:"Racha 60 días",    desc:"Corre 60 días seguidos",                   unlocked: streak>=60 },
    { id:"streak_100",cat:"Running", emoji:"💥", name:"Racha 100 días",   desc:"Corre 100 días seguidos",                  unlocked: streak>=100 },
    // ── MONTAÑA: rutas ────────────────────────────────────────────────────────
    { id:"mtn_1",    cat:"Montaña", emoji:"🏔️", name:"Primera cima",     desc:"Completa tu primera ruta de montaña",      unlocked: routes.length>=1 },
    { id:"mtn_3",    cat:"Montaña", emoji:"🏔️", name:"3 rutas",          desc:"Completa 3 rutas de montaña",              unlocked: routes.length>=3 },
    { id:"mtn_5",    cat:"Montaña", emoji:"🏔️", name:"5 rutas",          desc:"Completa 5 rutas de montaña",              unlocked: routes.length>=5 },
    { id:"mtn_10",   cat:"Montaña", emoji:"🗻", name:"10 rutas",         desc:"Completa 10 rutas de montaña",             unlocked: routes.length>=10 },
    { id:"mtn_15",   cat:"Montaña", emoji:"🗻", name:"15 rutas",         desc:"Completa 15 rutas de montaña",             unlocked: routes.length>=15 },
    { id:"mtn_20",   cat:"Montaña", emoji:"🗻", name:"20 rutas",         desc:"Completa 20 rutas de montaña",             unlocked: routes.length>=20 },
    { id:"mtn_30",   cat:"Montaña", emoji:"🗻", name:"30 rutas",         desc:"Completa 30 rutas de montaña",             unlocked: routes.length>=30 },
    { id:"mtn_50",   cat:"Montaña", emoji:"🧗", name:"50 rutas",         desc:"Completa 50 rutas de montaña",             unlocked: routes.length>=50 },
    { id:"mtn_75",   cat:"Montaña", emoji:"🧗", name:"75 rutas",         desc:"Completa 75 rutas de montaña",             unlocked: routes.length>=75 },
    { id:"mtn_100",  cat:"Montaña", emoji:"🧗", name:"100 rutas",        desc:"Completa 100 rutas de montaña",            unlocked: routes.length>=100 },
    { id:"mtn_150",  cat:"Montaña", emoji:"🌄", name:"150 rutas",        desc:"Completa 150 rutas de montaña",            unlocked: routes.length>=150 },
    { id:"mtn_200",  cat:"Montaña", emoji:"🌄", name:"200 rutas",        desc:"200 rutas de montaña",                     unlocked: routes.length>=200 },
    { id:"mtn_300",  cat:"Montaña", emoji:"🌄", name:"300 rutas",        desc:"300 rutas de montaña",                     unlocked: routes.length>=300 },
    { id:"mtn_500",  cat:"Montaña", emoji:"🏆", name:"500 rutas",        desc:"500 rutas de montaña",                     unlocked: routes.length>=500 },
    // ── MONTAÑA: desnivel ─────────────────────────────────────────────────────
    { id:"d_500",    cat:"Montaña", emoji:"📈", name:"500 m D+",         desc:"Acumula 500m de desnivel positivo",         unlocked: totalDesnivel>=500 },
    { id:"d_1k",     cat:"Montaña", emoji:"📈", name:"1.000 m D+",       desc:"Acumula 1.000m de desnivel positivo",       unlocked: totalDesnivel>=1000 },
    { id:"d_2k",     cat:"Montaña", emoji:"📈", name:"2.000 m D+",       desc:"Acumula 2.000m de desnivel positivo",       unlocked: totalDesnivel>=2000 },
    { id:"d_5k",     cat:"Montaña", emoji:"⛰️", name:"5.000 m D+",       desc:"Acumula 5.000m de desnivel positivo",       unlocked: totalDesnivel>=5000 },
    { id:"d_10k",    cat:"Montaña", emoji:"⛰️", name:"10.000 m D+",      desc:"Acumula 10.000m de desnivel positivo",      unlocked: totalDesnivel>=10000 },
    { id:"d_20k",    cat:"Montaña", emoji:"⛰️", name:"20.000 m D+",      desc:"Acumula 20.000m de desnivel positivo",      unlocked: totalDesnivel>=20000 },
    { id:"d_30k",    cat:"Montaña", emoji:"🌋", name:"30.000 m D+",      desc:"Acumula 30.000m de desnivel positivo",      unlocked: totalDesnivel>=30000 },
    { id:"d_50k",    cat:"Montaña", emoji:"🌋", name:"50.000 m D+",      desc:"Acumula 50.000m de desnivel positivo",      unlocked: totalDesnivel>=50000 },
    { id:"d_75k",    cat:"Montaña", emoji:"🌋", name:"75.000 m D+",      desc:"Acumula 75.000m de desnivel positivo",      unlocked: totalDesnivel>=75000 },
    { id:"d_ev10",   cat:"Montaña", emoji:"👑", name:"10× Everest",      desc:"88.490m D+ — 10 veces el Everest",          unlocked: totalDesnivel>=88490 },
    { id:"d_100k",   cat:"Montaña", emoji:"👑", name:"100.000 m D+",     desc:"Acumula 100.000m de desnivel positivo",     unlocked: totalDesnivel>=100000 },
    { id:"d_150k",   cat:"Montaña", emoji:"👑", name:"150.000 m D+",     desc:"Acumula 150.000m de desnivel positivo",     unlocked: totalDesnivel>=150000 },
    { id:"d_200k",   cat:"Montaña", emoji:"👑", name:"200.000 m D+",     desc:"Acumula 200.000m de desnivel positivo",     unlocked: totalDesnivel>=200000 },
    // ── 7 SUMMITS ─────────────────────────────────────────────────────────────
    { id:"s_kili",   cat:"7 Summits", emoji:"🇹🇿", name:"Kilimanjaro",    desc:"Coronas el Kilimanjaro (5.895m)",           unlocked: !!ch["kili"]?.done },
    { id:"s_elbrus", cat:"7 Summits", emoji:"🇷🇺", name:"Elbrus",          desc:"Coronas el Elbrus (5.642m)",                unlocked: !!ch["elbrus"]?.done },
    { id:"s_aconc",  cat:"7 Summits", emoji:"🇦🇷", name:"Aconcagua",       desc:"Coronas el Aconcagua (6.961m)",             unlocked: !!ch["aconc"]?.done },
    { id:"s_denali", cat:"7 Summits", emoji:"🇺🇸", name:"Denali",          desc:"Coronas el Denali (6.190m)",                unlocked: !!ch["denali"]?.done },
    { id:"s_cars",   cat:"7 Summits", emoji:"🇮🇩", name:"Carstensz",       desc:"Coronas el Carstensz (4.884m)",             unlocked: !!ch["cars"]?.done },
    { id:"s_vins",   cat:"7 Summits", emoji:"🇦🇶", name:"Vinson",          desc:"Coronas el Vinson (4.892m)",                unlocked: !!ch["vins"]?.done },
    { id:"s_ever",   cat:"7 Summits", emoji:"🇳🇵", name:"Everest",         desc:"Coronas el Everest (8.849m)",               unlocked: !!ch["ever"]?.done },
    { id:"s_2",      cat:"7 Summits", emoji:"🏔️", name:"2 Summits",        desc:"Completa 2 de los 7 Summits",               unlocked: summitsDone>=2 },
    { id:"s_3",      cat:"7 Summits", emoji:"🏔️", name:"3 Summits",        desc:"Completa 3 de los 7 Summits",               unlocked: summitsDone>=3 },
    { id:"s_4",      cat:"7 Summits", emoji:"🏔️", name:"4 Summits",        desc:"Completa 4 de los 7 Summits",               unlocked: summitsDone>=4 },
    { id:"s_5",      cat:"7 Summits", emoji:"🏔️", name:"5 Summits",        desc:"Completa 5 de los 7 Summits",               unlocked: summitsDone>=5 },
    { id:"s_6",      cat:"7 Summits", emoji:"🏔️", name:"6 Summits",        desc:"Completa 6 de los 7 Summits",               unlocked: summitsDone>=6 },
    { id:"s_all",    cat:"7 Summits", emoji:"🌍", name:"7 Summits COMPLETO", desc:"¡Has completado los 7 Summits!",           unlocked: summitsDone>=7 },
    // ── 7 MAJORS ──────────────────────────────────────────────────────────────
    { id:"m_berlin", cat:"7 Majors", emoji:"🇩🇪", name:"Berlin Major",    desc:"Completas el Maratón de Berlín",            unlocked: !!ch["berlin"]?.done },
    { id:"m_tokyo",  cat:"7 Majors", emoji:"🇯🇵", name:"Tokyo Major",     desc:"Completas el Maratón de Tokyo",             unlocked: !!ch["tokyo"]?.done },
    { id:"m_chic",   cat:"7 Majors", emoji:"🇺🇸", name:"Chicago Major",   desc:"Completas el Maratón de Chicago",           unlocked: !!ch["chicago"]?.done },
    { id:"m_london", cat:"7 Majors", emoji:"🇬🇧", name:"London Major",    desc:"Completas el Maratón de Londres",           unlocked: !!ch["london"]?.done },
    { id:"m_ny",     cat:"7 Majors", emoji:"🗽", name:"New York Major",   desc:"Completas el Maratón de Nueva York",        unlocked: !!ch["ny"]?.done },
    { id:"m_boston", cat:"7 Majors", emoji:"🇺🇸", name:"Boston Major",    desc:"Completas el Maratón de Boston",            unlocked: !!ch["boston"]?.done },
    { id:"m_sydney", cat:"7 Majors", emoji:"🇦🇺", name:"Sydney Major",    desc:"Completas el Maratón de Sydney",            unlocked: !!ch["sydney"]?.done },
    { id:"m_2",      cat:"7 Majors", emoji:"🏃", name:"2 Majors",         desc:"Completa 2 de los 7 Majors",                unlocked: majorsDone>=2 },
    { id:"m_3",      cat:"7 Majors", emoji:"🏃", name:"3 Majors",         desc:"Completa 3 de los 7 Majors",                unlocked: majorsDone>=3 },
    { id:"m_4",      cat:"7 Majors", emoji:"🏃", name:"4 Majors",         desc:"Completa 4 de los 7 Majors",                unlocked: majorsDone>=4 },
    { id:"m_5",      cat:"7 Majors", emoji:"🏃", name:"5 Majors",         desc:"Completa 5 de los 7 Majors",                unlocked: majorsDone>=5 },
    { id:"m_6star",  cat:"7 Majors", emoji:"⭐", name:"Abbott 6 Star",   desc:"Completa los 6 Majors Abbott",              unlocked: majorsDone>=6 },
    { id:"m_all",    cat:"7 Majors", emoji:"🏆", name:"7 Majors COMPLETO", desc:"¡Has completado los 7 Majors!",            unlocked: majorsDone>=7 },
    // ── RETO ──────────────────────────────────────────────────────────────────
    { id:"reto_start", cat:"Reto", emoji:"🎯", name:"Reto iniciado",    desc:"Has comenzado el reto 7+7",                  unlocked: summitsDone+majorsDone>=1 },
    { id:"reto_25",    cat:"Reto", emoji:"🎯", name:"25% del reto",     desc:"Completa 3-4 objetivos del 7+7",             unlocked: summitsDone+majorsDone>=4 },
    { id:"reto_50",    cat:"Reto", emoji:"🎯", name:"Mitad del reto",   desc:"7 de 14 objetivos completados",              unlocked: summitsDone+majorsDone>=7 },
    { id:"reto_75",    cat:"Reto", emoji:"🎯", name:"75% del reto",     desc:"11 de 14 objetivos completados",             unlocked: summitsDone+majorsDone>=11 },
    { id:"reto_all",   cat:"Reto", emoji:"🏅", name:"7+7 LEGEND",       desc:"¡El reto completo. Eres una leyenda!",       unlocked: summitsDone>=7 && majorsDone>=7 },
    // ── SALUD: tabaco ─────────────────────────────────────────────────────────
    { id:"smoke_1",    cat:"Salud", emoji:"🌱", name:"1 día libre",      desc:"1 día sin fumar",                           unlocked: smokeFreeDays>=1 },
    { id:"smoke_3",    cat:"Salud", emoji:"🌱", name:"3 días libre",     desc:"3 días sin fumar",                          unlocked: smokeFreeDays>=3 },
    { id:"smoke_7",    cat:"Salud", emoji:"🌿", name:"1 semana libre",   desc:"7 días sin fumar",                          unlocked: smokeFreeDays>=7 },
    { id:"smoke_14",   cat:"Salud", emoji:"🌿", name:"2 semanas libre",  desc:"14 días sin fumar",                         unlocked: smokeFreeDays>=14 },
    { id:"smoke_21",   cat:"Salud", emoji:"🌿", name:"3 semanas libre",  desc:"21 días sin fumar",                         unlocked: smokeFreeDays>=21 },
    { id:"smoke_30",   cat:"Salud", emoji:"🍃", name:"1 mes libre",      desc:"30 días sin fumar",                         unlocked: smokeFreeDays>=30 },
    { id:"smoke_45",   cat:"Salud", emoji:"🍃", name:"45 días libre",    desc:"45 días sin fumar",                         unlocked: smokeFreeDays>=45 },
    { id:"smoke_60",   cat:"Salud", emoji:"🍃", name:"2 meses libre",    desc:"60 días sin fumar",                         unlocked: smokeFreeDays>=60 },
    { id:"smoke_90",   cat:"Salud", emoji:"🌳", name:"3 meses libre",    desc:"90 días sin fumar",                         unlocked: smokeFreeDays>=90 },
    { id:"smoke_100",  cat:"Salud", emoji:"🌳", name:"100 días libre",   desc:"100 días sin fumar",                        unlocked: smokeFreeDays>=100 },
    { id:"smoke_180",  cat:"Salud", emoji:"🌳", name:"6 meses libre",    desc:"180 días sin fumar",                        unlocked: smokeFreeDays>=180 },
    { id:"smoke_270",  cat:"Salud", emoji:"🌲", name:"9 meses libre",    desc:"270 días sin fumar",                        unlocked: smokeFreeDays>=270 },
    { id:"smoke_365",  cat:"Salud", emoji:"🌲", name:"1 año libre",      desc:"365 días sin fumar",                        unlocked: smokeFreeDays>=365 },
    { id:"smoke_500",  cat:"Salud", emoji:"🌲", name:"500 días libre",   desc:"500 días sin fumar",                        unlocked: smokeFreeDays>=500 },
    { id:"smoke_730",  cat:"Salud", emoji:"🌴", name:"2 años libre",     desc:"730 días sin fumar",                        unlocked: smokeFreeDays>=730 },
    { id:"smoke_1000", cat:"Salud", emoji:"🌴", name:"1.000 días libre", desc:"1.000 días sin fumar",                      unlocked: smokeFreeDays>=1000 },
    { id:"smoke_1825", cat:"Salud", emoji:"🌴", name:"5 años libre",     desc:"1.825 días sin fumar",                      unlocked: smokeFreeDays>=1825 },
    { id:"smoke_3650", cat:"Salud", emoji:"🏆", name:"10 años libre",    desc:"3.650 días sin fumar",                      unlocked: smokeFreeDays>=3650 },
    // ── SALUD: peso ───────────────────────────────────────────────────────────
    { id:"w_1",    cat:"Salud", emoji:"📉", name:"-1 kg",               desc:"Perder 1 kg desde el inicio",               unlocked: weightLost>=1 },
    { id:"w_2",    cat:"Salud", emoji:"📉", name:"-2 kg",               desc:"Perder 2 kg desde el inicio",               unlocked: weightLost>=2 },
    { id:"w_3",    cat:"Salud", emoji:"📉", name:"-3 kg",               desc:"Perder 3 kg desde el inicio",               unlocked: weightLost>=3 },
    { id:"w_5",    cat:"Salud", emoji:"📉", name:"-5 kg",               desc:"Perder 5 kg desde el inicio",               unlocked: weightLost>=5 },
    { id:"w_7",    cat:"Salud", emoji:"📉", name:"-7 kg",               desc:"Perder 7 kg desde el inicio",               unlocked: weightLost>=7 },
    { id:"w_10",   cat:"Salud", emoji:"🎯", name:"-10 kg",              desc:"Perder 10 kg desde el inicio",              unlocked: weightLost>=10 },
    { id:"w_12",   cat:"Salud", emoji:"🎯", name:"-12 kg",              desc:"Perder 12 kg desde el inicio",              unlocked: weightLost>=12 },
    { id:"w_15",   cat:"Salud", emoji:"🎯", name:"-15 kg",              desc:"Perder 15 kg desde el inicio",              unlocked: weightLost>=15 },
    { id:"w_20",   cat:"Salud", emoji:"🎯", name:"-20 kg",              desc:"Perder 20 kg desde el inicio",              unlocked: weightLost>=20 },
    // ── SALUD: VO2max ─────────────────────────────────────────────────────────
    { id:"vo2_30",  cat:"Salud", emoji:"💛", name:"VO2 30+",            desc:"VO2max igual o superior a 30",              unlocked: vo2>=30 },
    { id:"vo2_35",  cat:"Salud", emoji:"💛", name:"VO2 35+",            desc:"VO2max igual o superior a 35",              unlocked: vo2>=35 },
    { id:"vo2_40",  cat:"Salud", emoji:"💙", name:"VO2 40+",            desc:"VO2max igual o superior a 40",              unlocked: vo2>=40 },
    { id:"vo2_45",  cat:"Salud", emoji:"💙", name:"VO2 45+",            desc:"VO2max igual o superior a 45",              unlocked: vo2>=45 },
    { id:"vo2_50",  cat:"Salud", emoji:"💜", name:"VO2 50+",            desc:"VO2max igual o superior a 50",              unlocked: vo2>=50 },
    { id:"vo2_55",  cat:"Salud", emoji:"💜", name:"VO2 55+",            desc:"VO2max igual o superior a 55 (élite)",      unlocked: vo2>=55 },
    { id:"vo2_60",  cat:"Salud", emoji:"💜", name:"VO2 60+",            desc:"VO2max igual o superior a 60 (pro)",        unlocked: vo2>=60 },
    { id:"vo2_65",  cat:"Salud", emoji:"❤️", name:"VO2 65+",            desc:"VO2max igual o superior a 65 (campeón)",    unlocked: vo2>=65 },
    // ── DIARIO ────────────────────────────────────────────────────────────────
    { id:"diary_1",   cat:"Diario", emoji:"✍️", name:"Primera entrada",  desc:"Escribe tu primera entrada en el diario",  unlocked: diary.length>=1 },
    { id:"diary_3",   cat:"Diario", emoji:"📝", name:"3 entradas",       desc:"Escribe 3 entradas en el diario",           unlocked: diary.length>=3 },
    { id:"diary_7",   cat:"Diario", emoji:"📝", name:"7 entradas",       desc:"Escribe 7 entradas en el diario",           unlocked: diary.length>=7 },
    { id:"diary_14",  cat:"Diario", emoji:"📝", name:"14 entradas",      desc:"Escribe 14 entradas en el diario",          unlocked: diary.length>=14 },
    { id:"diary_30",  cat:"Diario", emoji:"📖", name:"30 entradas",      desc:"Escribe 30 entradas en el diario",          unlocked: diary.length>=30 },
    { id:"diary_50",  cat:"Diario", emoji:"📖", name:"50 entradas",      desc:"Escribe 50 entradas en el diario",          unlocked: diary.length>=50 },
    { id:"diary_100", cat:"Diario", emoji:"📚", name:"100 entradas",     desc:"Escribe 100 entradas en el diario",         unlocked: diary.length>=100 },
    { id:"diary_200", cat:"Diario", emoji:"📚", name:"200 entradas",     desc:"Escribe 200 entradas en el diario",         unlocked: diary.length>=200 },
    { id:"diary_365", cat:"Diario", emoji:"🗓️", name:"365 entradas",     desc:"Un año entero de diario",                   unlocked: diary.length>=365 },
    { id:"diary_500", cat:"Diario", emoji:"🗓️", name:"500 entradas",     desc:"Escribe 500 entradas en el diario",         unlocked: diary.length>=500 },
    { id:"diary_1000",cat:"Diario", emoji:"🗓️", name:"1.000 entradas",   desc:"Escribe 1.000 entradas en el diario",       unlocked: diary.length>=1000 },
    // ── FOTOS PROGRESO ────────────────────────────────────────────────────────
    { id:"photo_1",   cat:"Diario", emoji:"📷", name:"Primera foto",     desc:"Añade tu primera foto de progreso",         unlocked: photos>=1 },
    { id:"photo_5",   cat:"Diario", emoji:"📷", name:"5 fotos",          desc:"Añade 5 fotos de progreso",                 unlocked: photos>=5 },
    { id:"photo_12",  cat:"Diario", emoji:"📷", name:"12 fotos",         desc:"Un año de fotos mensuales",                 unlocked: photos>=12 },
    { id:"photo_52",  cat:"Diario", emoji:"📷", name:"52 fotos",         desc:"Un año de fotos semanales",                 unlocked: photos>=52 },
    { id:"photo_100", cat:"Diario", emoji:"📷", name:"100 fotos",        desc:"100 fotos de progreso",                     unlocked: photos>=100 },
    // ── OBJETIVOS ─────────────────────────────────────────────────────────────
    { id:"goal_1",    cat:"Diario", emoji:"🎯", name:"1 objetivo logrado", desc:"Completa tu primer objetivo",             unlocked: goalsDone>=1 },
    { id:"goal_5",    cat:"Diario", emoji:"🎯", name:"5 objetivos logrados", desc:"Completa 5 objetivos",                  unlocked: goalsDone>=5 },
    { id:"goal_10",   cat:"Diario", emoji:"🎯", name:"10 objetivos logrados", desc:"Completa 10 objetivos",                unlocked: goalsDone>=10 },
    { id:"goal_25",   cat:"Diario", emoji:"🎯", name:"25 objetivos logrados", desc:"Completa 25 objetivos",                unlocked: goalsDone>=25 },
    { id:"goal_50",   cat:"Diario", emoji:"🎯", name:"50 objetivos logrados", desc:"Completa 50 objetivos",                unlocked: goalsDone>=50 },
    // ── COMBOS ────────────────────────────────────────────────────────────────
    { id:"combo_trail", cat:"Reto", emoji:"🏃‍♂️", name:"Corredor de montaña", desc:"Más de 100 km corriendo y 5 rutas de montaña", unlocked: totalKm>=100 && routes.length>=5 },
    { id:"combo_clean", cat:"Reto", emoji:"🫁",  name:"Pulmones limpios",   desc:"Sin fumar 30 días y 20 salidas de running",    unlocked: smokeFreeDays>=30 && runs.length>=20 },
    { id:"combo_triple",cat:"Reto", emoji:"🔱",  name:"Triple amenaza",     desc:"Running + Montaña + sin fumar 90 días",         unlocked: totalKm>=200 && routes.length>=10 && smokeFreeDays>=90 },
    { id:"combo_iron",  cat:"Reto", emoji:"🦾",  name:"Iron 7+7",           desc:"500km + 50 rutas + 1 año sin fumar",            unlocked: totalKm>=500 && routes.length>=50 && smokeFreeDays>=365 },
    { id:"combo_legend",cat:"Reto", emoji:"⚜️",  name:"Leyenda total",      desc:"7+7 completo + 1.000 km + 100 rutas",           unlocked: summitsDone>=7 && majorsDone>=7 && totalKm>=1000 && routes.length>=100 },
    // ── KM EXTRA ──────────────────────────────────────────────────────────────
    { id:"km_400",   cat:"Running", emoji:"🏅", name:"400 km",           desc:"Acumula 400 km de running",                 unlocked: totalKm>=400 },
    { id:"km_600",   cat:"Running", emoji:"🏅", name:"600 km",           desc:"Acumula 600 km de running",                 unlocked: totalKm>=600 },
    { id:"km_850",   cat:"Running", emoji:"🥇", name:"850 km",           desc:"Acumula 850 km de running",                 unlocked: totalKm>=850 },
    { id:"km_1200",  cat:"Running", emoji:"🥇", name:"1.200 km",         desc:"Acumula 1.200 km de running",               unlocked: totalKm>=1200 },
    { id:"km_2500",  cat:"Running", emoji:"🌍", name:"2.500 km",         desc:"Acumula 2.500 km de running",               unlocked: totalKm>=2500 },
    { id:"km_4000",  cat:"Running", emoji:"🌍", name:"4.000 km",         desc:"Acumula 4.000 km de running",               unlocked: totalKm>=4000 },
    { id:"km_6000",  cat:"Running", emoji:"🌑", name:"6.000 km",         desc:"Acumula 6.000 km de running",               unlocked: totalKm>=6000 },
    { id:"km_8000",  cat:"Running", emoji:"🌑", name:"8.000 km",         desc:"Acumula 8.000 km de running",               unlocked: totalKm>=8000 },
    { id:"km_12000", cat:"Running", emoji:"🌑", name:"12.000 km",        desc:"Acumula 12.000 km de running",              unlocked: totalKm>=12000 },
    { id:"km_25000", cat:"Running", emoji:"🌐", name:"25.000 km",        desc:"Acumula 25.000 km de running",              unlocked: totalKm>=25000 },
    // ── SALIDAS EXTRA ─────────────────────────────────────────────────────────
    { id:"run_7",    cat:"Running", emoji:"📅", name:"7 salidas",        desc:"Completa 7 salidas de running",             unlocked: runs.length>=7 },
    { id:"run_40",   cat:"Running", emoji:"💪", name:"40 salidas",       desc:"Completa 40 salidas de running",            unlocked: runs.length>=40 },
    { id:"run_60",   cat:"Running", emoji:"🔥", name:"60 salidas",       desc:"Completa 60 salidas de running",            unlocked: runs.length>=60 },
    { id:"run_125",  cat:"Running", emoji:"💯", name:"125 salidas",      desc:"Completa 125 salidas de running",           unlocked: runs.length>=125 },
    { id:"run_250",  cat:"Running", emoji:"🦾", name:"250 salidas",      desc:"Completa 250 salidas de running",           unlocked: runs.length>=250 },
    { id:"run_365",  cat:"Running", emoji:"👑", name:"365 salidas",      desc:"Un salida por cada día del año",            unlocked: runs.length>=365 },
    // ── DESNIVEL EXTRA ────────────────────────────────────────────────────────
    { id:"d_3k",     cat:"Montaña", emoji:"📈", name:"3.000 m D+",       desc:"Acumula 3.000m de desnivel positivo",       unlocked: totalDesnivel>=3000 },
    { id:"d_7k",     cat:"Montaña", emoji:"⛰️", name:"7.000 m D+",       desc:"Acumula 7.000m de desnivel positivo",       unlocked: totalDesnivel>=7000 },
    { id:"d_15k",    cat:"Montaña", emoji:"⛰️", name:"15.000 m D+",      desc:"Acumula 15.000m de desnivel positivo",      unlocked: totalDesnivel>=15000 },
    { id:"d_25k",    cat:"Montaña", emoji:"🌋", name:"25.000 m D+",      desc:"Acumula 25.000m de desnivel positivo",      unlocked: totalDesnivel>=25000 },
    { id:"d_40k",    cat:"Montaña", emoji:"🌋", name:"40.000 m D+",      desc:"Acumula 40.000m de desnivel positivo",      unlocked: totalDesnivel>=40000 },
    { id:"d_60k",    cat:"Montaña", emoji:"🌋", name:"60.000 m D+",      desc:"Acumula 60.000m de desnivel positivo",      unlocked: totalDesnivel>=60000 },
    { id:"d_120k",   cat:"Montaña", emoji:"👑", name:"120.000 m D+",     desc:"Acumula 120.000m de desnivel positivo",     unlocked: totalDesnivel>=120000 },
    // ── TABACO EXTRA ──────────────────────────────────────────────────────────
    { id:"smoke_2",    cat:"Salud", emoji:"🌱", name:"2 días libre",     desc:"2 días sin fumar",                          unlocked: smokeFreeDays>=2 },
    { id:"smoke_10",   cat:"Salud", emoji:"🌿", name:"10 días libre",    desc:"10 días sin fumar",                         unlocked: smokeFreeDays>=10 },
    { id:"smoke_120",  cat:"Salud", emoji:"🌳", name:"4 meses libre",    desc:"120 días sin fumar",                        unlocked: smokeFreeDays>=120 },
    { id:"smoke_150",  cat:"Salud", emoji:"🌳", name:"5 meses libre",    desc:"150 días sin fumar",                        unlocked: smokeFreeDays>=150 },
    { id:"smoke_200",  cat:"Salud", emoji:"🌲", name:"200 días libre",   desc:"200 días sin fumar",                        unlocked: smokeFreeDays>=200 },
    { id:"smoke_400",  cat:"Salud", emoji:"🌲", name:"400 días libre",   desc:"400 días sin fumar",                        unlocked: smokeFreeDays>=400 },
    { id:"smoke_600",  cat:"Salud", emoji:"🌴", name:"600 días libre",   desc:"600 días sin fumar",                        unlocked: smokeFreeDays>=600 },
    { id:"smoke_2555", cat:"Salud", emoji:"🏆", name:"7 años libre",     desc:"2.555 días sin fumar",                      unlocked: smokeFreeDays>=2555 },
  ];
  return all;
}

const CAT_COLORS = {
  "Running":    "#FF6B00",
  "Montaña":    "#8B5CF6",
  "7 Summits":  "#10B981",
  "7 Majors":   "#3B82F6",
  "Reto":       "#EF4444",
  "Salud":      "#22C55E",
  "Diario":     "#F59E0B",
};


function Badges({ data, totalKm, totalDesnivel, smokeFreeDays }) {
  const [filter, setFilter] = useState("Todos");
  const badges = calcBadges(data, totalKm, totalDesnivel, smokeFreeDays);
  const unlockedCount = badges.filter(b => b.unlocked).length;
  const cats = ["Todos", ...Object.keys(CAT_COLORS)];

  const filtered = filter === "Todos" ? badges : badges.filter(b => b.cat === filter);
  const unlocked = filtered.filter(b => b.unlocked);
  const locked   = filtered.filter(b => !b.unlocked);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Hero */}
      <Card dark style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Logros</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: unlockedCount > 0 ? C.orange : "#fff", lineHeight: 1, letterSpacing: -2 }}>
              {unlockedCount}<span style={{ fontSize: 18, fontWeight: 500, letterSpacing: 0, color: "rgba(255,255,255,0.8)" }}>/{badges.length}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>🏅</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{Math.round(unlockedCount/badges.length*100)}% completado</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 99, height: 6, overflow: "hidden" }}>
          <div style={{ width: `${(unlockedCount/badges.length)*100}%`, background: C.orange, height: "100%", borderRadius: 99, transition: "width 0.8s" }} />
        </div>
        {/* Cat mini stats */}
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {Object.entries(CAT_COLORS).map(([cat, color]) => {
            const total = badges.filter(b => b.cat === cat).length;
            const done  = badges.filter(b => b.cat === cat && b.unlocked).length;
            return (
              <div key={cat} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "4px 9px" }}>
                <span style={{ fontSize: 9, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: 0.5 }}>{cat} </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: done === total ? color : "rgba(255,255,255,0.65)" }}>{done}/{total}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
        {cats.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            flexShrink: 0, border: `1.5px solid ${filter === cat ? C.orange : C.greyLight}`,
            background: filter === cat ? C.orangeLight : C.white,
            borderRadius: 20, padding: "6px 14px",
            fontSize: 11, fontWeight: filter === cat ? 800 : 500,
            color: filter === cat ? C.orange : C.textMuted, cursor: "pointer",
          }}>{cat}</button>
        ))}
      </div>

      {/* Unlocked badges */}
      {unlocked.length > 0 && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.orange, marginBottom: 12 }}>
            ✓ Desbloqueados ({unlocked.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {unlocked.map(b => (
              <div key={b.id} style={{
                background: (CAT_COLORS[b.cat] || C.orange) + "14",
                borderRadius: 14, padding: "12px 10px",
                border: `1.5px solid ${CAT_COLORS[b.cat] || C.orange}33`,
              }}>
                <div style={{ fontSize: 28, marginBottom: 6, lineHeight: 1 }}>{b.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: C.text, lineHeight: 1.3, marginBottom: 3 }}>{b.name}</div>
                <div style={{ fontSize: 9, color: C.textMuted, lineHeight: 1.4 }}>{b.desc}</div>
                <div style={{ marginTop: 5 }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: CAT_COLORS[b.cat] || C.orange, background: (CAT_COLORS[b.cat]||C.orange)+"22", borderRadius: 5, padding: "2px 6px", textTransform: "uppercase", letterSpacing: 0.5 }}>{b.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Locked badges */}
      {locked.length > 0 && (
        <Card>
          <div style={{ fontSize: 13, fontWeight: 800, color: C.textMuted, marginBottom: 12 }}>
            Bloqueados ({locked.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {locked.map(b => (
              <div key={b.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 0", borderBottom: `1px solid ${C.greyLight}`,
                opacity: 0.5,
              }}>
                <div style={{ fontSize: 24, flexShrink: 0, filter: "grayscale(1)" }}>{b.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: C.textMuted, lineHeight: 1.4 }}>{b.desc}</div>
                </div>
                <span style={{ fontSize: 8, fontWeight: 800, color: CAT_COLORS[b.cat]||C.orange, background: (CAT_COLORS[b.cat]||C.orange)+"18", borderRadius: 5, padding: "2px 6px", textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0 }}>{b.cat}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// AJUSTES — exportar / importar datos
// ═══════════════════════════════════════════════════════════════════════════════
function Ajustes({ data, setData, dark, toggleDark }) {
  const [importError, setImportError] = useState("");
  const [importOk, setImportOk] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef();

  function exportData() {
    const json = JSON.stringify({ version: "7plus7_v1", exportedAt: new Date().toISOString(), data }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `7plus7_backup_${new Date().toLocaleDateString("es-ES").replace(/\//g,"-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImportError(""); setImportOk(false);
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const importedData = parsed.data || parsed; // support both wrapped and raw
        if (!importedData.runs || !importedData.routes) throw new Error("Formato no reconocido");
        setData(importedData);
        setImportOk(true);
      } catch (err) {
        setImportError("Error al importar: " + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function resetAll() {
    setData({
      runs: [], routes: [], weight: [], vo2max: [],
      goals: { monthly: [], annual: [], longterm: [] },
      smokeFreeStart: null, initialWeight: 82.3,
      targetWeight: 72.3, targetDate: "26/06/2026",
      challenge: {}, diary: [],
      profile: { name: "", avatar: null },
    });
    setConfirmReset(false);
  }

  const dataSize = JSON.stringify(data).length;
  const runs = data.runs?.length || 0;
  const routes = data.routes?.length || 0;
  const diary = data.diary?.length || 0;
  const weight = data.weight?.length || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

      {/* Summary */}
      <Card dark style={{ padding: 20 }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>Tus datos</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { label: "Salidas", value: runs },
            { label: "Rutas montaña", value: routes },
            { label: "Entradas diario", value: diary },
            { label: "Registros peso", value: weight },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: value > 0 ? C.orange : "rgba(255,255,255,0.3)" }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 10, color: "rgba(255,255,255,0.4)", textAlign: "right" }}>
          {(dataSize / 1024).toFixed(1)} KB almacenados
        </div>
      </Card>

      {/* Export */}
      <Card>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>Exportar backup</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16, lineHeight: 1.5 }}>
          Descarga un archivo JSON con todos tus datos. Guárdalo en iCloud, Google Drive o donde quieras.
        </div>
        <button onClick={exportData} style={{
          width: "100%", border: "none", borderRadius: 14, padding: "14px",
          background: C.isDark ? "#FF6B00" : "#111111", color: "#fff",
          fontSize: 14, fontWeight: 800, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          {Icon.download} Descargar backup
        </button>
      </Card>

      {/* Import */}
      <Card>
        <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 6 }}>Importar backup</div>
        <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 16, lineHeight: 1.5 }}>
          Restaura tus datos desde un backup anterior. <strong style={{ color: C.orange }}>Esto sobreescribirá todos los datos actuales.</strong>
        </div>
        {importOk && (
          <div style={{ background: "#22C55E22", border: "1px solid #22C55E", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#22C55E", fontWeight: 700 }}>
            ✓ Datos importados correctamente
          </div>
        )}
        {importError && (
          <div style={{ background: "#EF444422", border: "1px solid #EF4444", borderRadius: 10, padding: "10px 14px", marginBottom: 12, fontSize: 13, color: "#EF4444" }}>
            {importError}
          </div>
        )}
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
        <button onClick={() => fileRef.current?.click()} style={{
          width: "100%", border: `1.5px solid ${C.greyLight}`, borderRadius: 14, padding: "14px",
          background: C.bg, color: C.text,
          fontSize: 14, fontWeight: 800, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
        }}>
          {Icon.upload} Seleccionar archivo
        </button>
      </Card>

      {/* Theme */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 2 }}>Modo oscuro</div>
            <div style={{ fontSize: 12, color: C.textMuted }}>Cambia el aspecto de la app</div>
          </div>
          <button onClick={toggleDark} style={{
            width: 52, height: 30, borderRadius: 99, border: "none", cursor: "pointer",
            background: dark ? C.orange : C.greyLight,
            position: "relative", transition: "background 0.3s",
          }}>
            <div style={{
              position: "absolute", top: 3, left: dark ? 25 : 3,
              width: 24, height: 24, borderRadius: "50%", background: "#fff",
              transition: "left 0.3s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
            }} />
          </button>
        </div>
      </Card>

      {/* Danger zone */}
      <Card style={{ border: `1.5px solid ${C.red}22` }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: C.red, marginBottom: 6 }}>Zona peligrosa</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14, lineHeight: 1.5 }}>
          Elimina todos tus datos permanentemente. Esta acción no se puede deshacer.
        </div>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} style={{
            width: "100%", border: `1.5px solid ${C.red}`, borderRadius: 14, padding: "12px",
            background: "transparent", color: C.red, fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}>Borrar todos los datos</button>
        ) : (
          <div style={{ background: C.red + "18", borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 12, textAlign: "center" }}>¿Estás seguro? No hay vuelta atrás.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <button onClick={resetAll} style={{ border: "none", borderRadius: 10, padding: "11px", background: C.red, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>Sí, borrar</button>
              <button onClick={() => setConfirmReset(false)} style={{ border: `1.5px solid ${C.greyLight}`, borderRadius: 10, padding: "11px", background: "transparent", color: C.text, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Cancelar</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// AI COACH — entrenador personal con contexto real
// ═══════════════════════════════════════════════════════════════════════════════
function AICoach({ data, totalKm, totalDesnivel, smokeFreeDays, lastWeight, lastVo2, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "¡Hola! Soy tu entrenador personal para el reto 7+7. Tengo acceso a todos tus datos de entreno, peso, salidas sin fumar y progreso en cimas y maratones. ¿En qué te ayudo hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();

  const ch = data.challenge || {};
  const summitsDone = SUMMITS.filter(s => ch[s.id]?.done).length;
  const majorsDone  = MAJORS.filter(m => ch[m.id]?.done).length;
  const runs = data.runs || [];
  const routes = data.routes || [];
  const diary = data.diary || [];
  const weightLost = data.initialWeight - lastWeight;

  const systemPrompt = "Eres un entrenador personal experto en running, montañismo y hábitos saludables. Hablas en español, eres directo, motivador y concreto. Das consejos basados en los datos reales del usuario.\n\n" +
    "DATOS DEL USUARIO:\n" +
    "- Nombre: " + (data.profile?.name || "Atleta") + "\n" +
    "- Peso actual: " + lastWeight.toFixed(1) + " kg (inicio: " + data.initialWeight + " kg, perdido: " + weightLost.toFixed(1) + " kg, meta: " + data.targetWeight + " kg)\n" +
    "- VO2max: " + (lastVo2 || "no registrado") + " ml/kg/min\n" +
    "- Días sin fumar: " + smokeFreeDays + "\n" +
    "- Running: " + runs.length + " salidas, " + Math.round(totalKm) + " km totales\n" +
    "- Montaña: " + routes.length + " rutas, " + Math.round(totalDesnivel) + " m desnivel acumulado\n" +
    "- 7 Summits completados: " + summitsDone + "/7\n" +
    "- 7 Majors completados: " + majorsDone + "/7\n" +
    "- Próximo hito: " + ((data.nextMilestone?.label) || "Kilimanjaro") + " el " + ((data.nextMilestone?.date) || "15/10/2027") + "\n" +
    "- Entradas en diario: " + diary.length + "\n\n" +
    "CONTEXTO DEL RETO: Plan 10 años (2026-2036) para completar los 7 Cumbres del Mundo y las 7 World Marathon Majors. Actualmente en fase inicial: recuperación aeróbica, dejar tabaco, bajar peso.\n\n" +
    "Sé conciso (máximo 3 párrafos). Usa datos concretos.";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    haptic([10]);
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const apiMessages = newMessages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages,
        }),
      });
      const data2 = await res.json();
      const reply = data2.content?.[0]?.text || "No he podido responder. Inténtalo de nuevo.";
      setMessages(m => [...m, { role: "assistant", text: reply }]);
      haptic([15]);
    } catch {
      setMessages(m => [...m, { role: "assistant", text: "Error de conexión. Comprueba tu internet e inténtalo de nuevo." }]);
    }
    setLoading(false);
  }

  const suggestions = [
    "¿Voy bien para el Kilimanjaro?",
    "Dame un plan de running para esta semana",
    "¿Cuánto tiempo necesito para bajar a 72 kg?",
    "¿Cómo mejorar mi VO2max?",
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 40, background: C.bg, display: "flex", flexDirection: "column", maxWidth: 430, margin: "0 auto" }}>
      <div style={{ padding: "16px 18px", background: C.headerBg, borderBottom: "1px solid " + C.greyLight, display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.text, padding: 4, fontSize: 20 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: C.text }}>Coach 7+7 <span style={{ color: C.orange }}>IA</span></div>
          <div style={{ fontSize: 10, color: C.textMuted }}>Entrenador personal con tus datos</div>
        </div>
        <div style={{ background: C.orange, borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 800, color: "#fff" }}>EN VIVO</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 0" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", marginRight: 8, flexShrink: 0, marginTop: 2 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="15" x2="8" y2="17"/><line x1="16" y1="15" x2="16" y2="17"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/></svg></div>
            )}
            <div style={{
              maxWidth: "78%", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "11px 14px", fontSize: 13, lineHeight: 1.6,
              background: m.role === "user" ? C.orange : C.white,
              color: m.role === "user" ? "#fff" : C.text,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}>
              {m.text.split("\n").map((line, j) => <span key={j}>{line}{j < m.text.split("\n").length-1 && <br/>}</span>)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.orange, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="15" x2="8" y2="17"/><line x1="16" y1="15" x2="16" y2="17"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/></svg></div>
            <div style={{ background: C.white, borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
              <div style={{ fontSize: 12, color: C.textMuted }}>Pensando...</div>
            </div>
          </div>
        )}
        {messages.length === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: C.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>Preguntas sugeridas</div>
            {suggestions.map(s => (
              <button key={s} onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
                style={{ background: C.white, border: "1.5px solid " + C.greyLight, borderRadius: 14, padding: "10px 14px", fontSize: 12, color: C.text, textAlign: "left", cursor: "pointer", fontWeight: 500, fontFamily: "inherit" }}>
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "12px 14px", background: C.navBg, borderTop: "1px solid " + C.greyLight, paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))", display: "flex", gap: 10 }}>
        <input
          ref={inputRef}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Pregúntame lo que quieras..."
          style={{ flex: 1, background: C.bg, border: "1.5px solid " + C.greyLight, borderRadius: 22, padding: "11px 16px", fontSize: 14, color: C.text, outline: "none", fontFamily: "inherit", colorScheme: C.isDark ? "dark" : "light" }}
        />
        <button onClick={send} disabled={loading || !input.trim()} style={{
          width: 44, height: 44, borderRadius: "50%", border: "none",
          background: input.trim() ? C.orange : C.greyLight, cursor: input.trim() ? "pointer" : "default",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          fontSize: 18,
        }}>
          ➤
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const { data, setData, loaded } = useStorage();
  const [tab, setTab] = useState("dashboard");
  const [showShare, setShowShare] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [badgeQueue, setBadgeQueue] = useState([]);
  const [showAI, setShowAI] = useState(false);
  const { particles, fire: fireConfetti } = useConfetti();
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("7plus7_dark") === "1"; } catch { return false; }
  });

  // Update global C whenever dark changes so all components pick it up
  C = makeTheme(dark);
  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    try { localStorage.setItem("7plus7_dark", next ? "1" : "0"); } catch {}
  };

  // Derived values — before early return (Rules of Hooks: no hooks after this)
  const totalKm       = loaded ? data.runs.reduce((s, r) => s + parseFloat(r.km || 0), 0) : 0;
  const totalMtnKm    = loaded ? data.routes.reduce((s, r) => s + parseFloat(r.km || 0), 0) : 0;
  const totalDesnivel = loaded ? data.routes.reduce((s, r) => s + parseFloat(r.desnivel || 0), 0) : 0;
  const lastWeight    = loaded && data.weight.length > 0 ? data.weight[data.weight.length-1].value : (loaded ? data.initialWeight : 0);
  const lastVo2       = loaded && data.vo2max.length > 0 ? data.vo2max[data.vo2max.length-1].value : null;
  const weightLost    = loaded ? data.initialWeight - lastWeight : 0;
  const smokeFreeDays = loaded && data.smokeFreeStart ? Math.floor((Date.now() - new Date(data.smokeFreeStart).getTime()) / 86400000) : 0;
  const moneySaved    = smokeFreeDays * 5.1;

  // Badge detection — MUST be before early return
  useEffect(() => {
    if (!loaded) return;
    const allBadges = calcBadges(data, totalKm, totalDesnivel, smokeFreeDays);
    const seen = data.seenBadges || [];
    const newlyUnlocked = allBadges.filter(b => b.unlocked && !seen.includes(b.id));
    if (newlyUnlocked.length > 0) {
      setBadgeQueue(q => [...q, ...newlyUnlocked]);
      setData(d => ({ ...d, seenBadges: [...(d.seenBadges || []), ...newlyUnlocked.map(b => b.id)] }));
      fireConfetti();
    }
  }, [loaded, totalKm, totalDesnivel, smokeFreeDays, data.runs?.length, data.routes?.length, data.diary?.length, data.weight?.length, data.challenge]);

  function dismissBadge() {
    setBadgeQueue(q => q.slice(1));
    if (badgeQueue.length > 1) fireConfetti();
  }

  const shared = { data, setData };

  if (!loaded) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 900, color: C.orange }}>7+7</div>
    </div>
  );

  return (
    <div style={{
      background: C.bg, minHeight: "100vh", maxWidth: 430,
      margin: "0 auto", fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', sans-serif",
      paddingBottom: 90, overflowX: "hidden",
      color: C.text,
    }}>

      {/* HEADER */}
      <div style={{
        padding: "20px 18px 14px",
        background: C.headerBg,
        position: "sticky", top: 0, zIndex: 10,
        borderBottom: `1px solid ${C.greyLight}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: -0.8, color: C.text }}>
              7+7 <span style={{ color: C.orange }}>Tracker</span>
            </div>
            <div style={{ fontSize: 10, color: C.textMuted, letterSpacing: 0.5, marginTop: 1 }}>
              Summits · Majors · 2026–2036
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ background: C.orange, borderRadius: 10, padding: "4px 11px", fontSize: 11, fontWeight: 800, color: C.white }}>
              {smokeFreeDays}d
            </div>
            <button onClick={() => setShowAI(true)} style={{ background: C.orangeLight, border: "none", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.orange }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><line x1="12" y1="7" x2="12" y2="11"/><line x1="8" y1="15" x2="8" y2="17"/><line x1="16" y1="15" x2="16" y2="17"/><circle cx="8" cy="15" r="1" fill="currentColor"/><circle cx="16" cy="15" r="1" fill="currentColor"/></svg>
            </button>
            <button onClick={toggleDark} style={{ background: C.greyLight, border: "none", borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.text }}>
              {dark ? Icon.sun : Icon.moon}
            </button>
          </div>
        </div>
      </div>

      {/* CONFETTI */}
      <ConfettiCanvas particles={particles} />

      {/* BADGE TOASTS */}
      {badgeQueue.length > 0 && <BadgeToast badge={badgeQueue[0]} onDone={dismissBadge} />}

      {/* AI COACH OVERLAY */}
      {showAI && (
        <AICoach
          data={data}
          totalKm={totalKm}
          totalDesnivel={totalDesnivel}
          smokeFreeDays={smokeFreeDays}
          lastWeight={lastWeight}
          lastVo2={lastVo2}
          onClose={() => setShowAI(false)}
        />
      )}

      {/* SHARE CARD OVERLAY */}
      {showShare && (
        <ShareCard
          data={data}
          onClose={() => setShowShare(false)}
          totalKm={totalKm}
          totalDesnivel={totalDesnivel}
          smokeFreeDays={smokeFreeDays}
          lastWeight={lastWeight}
        />
      )}

      {/* CONTENT */}
      <div style={{ padding: 14, overflowX: "hidden" }}>
        {tab === "dashboard" && <Dashboard {...shared} totalKm={totalKm} totalMtnKm={totalMtnKm} totalDesnivel={totalDesnivel} lastWeight={lastWeight} weightLost={weightLost} smokeFreeDays={smokeFreeDays} moneySaved={moneySaved} lastVo2={lastVo2} onShare={() => setShowShare(true)} />}
        {tab === "running"   && <Running   {...shared} totalKm={totalKm} />}
        {tab === "mountains" && <Mountains {...shared} totalMtnKm={totalMtnKm} totalDesnivel={totalDesnivel} />}
        {tab === "goals"     && <Goals     {...shared} />}
        {tab === "weekly"    && <WeeklyChallenge {...shared} totalKm={totalKm} totalDesnivel={totalDesnivel} smokeFreeDays={smokeFreeDays} />}
        {tab === "reto"      && <Reto      {...shared} />}
        {tab === "body"      && <Body      {...shared} lastWeight={lastWeight} weightLost={weightLost} lastVo2={lastVo2} />}
        {tab === "diario"    && <Diario    {...shared} />}
        {tab === "badges"    && <Badges    {...shared} totalKm={totalKm} totalDesnivel={totalDesnivel} smokeFreeDays={smokeFreeDays} />}
        {tab === "ajustes"   && <Ajustes   {...shared} dark={dark} toggleDark={toggleDark} />}
      </div>

      {/* MORE DRAWER — secondary tabs */}
      {showMore && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 30, background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowMore(false)}
        >
          <div
            style={{
              position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
              width: "100%", maxWidth: 430,
              background: C.navBg,
              borderRadius: "20px 20px 0 0",
              padding: "20px 16px",
              paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{ width: 40, height: 4, background: C.greyMid, borderRadius: 99, margin: "0 auto 20px" }} />
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, color: C.textMuted, marginBottom: 14 }}>Más secciones</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {SECONDARY_TABS.map((t, idx) => {
                const active = tab === t.id;
                return (
                  <button key={t.id} onClick={() => { setTab(t.id); setShowMore(false); }} style={{
                    border: `1.5px solid ${active ? C.orange : C.greyLight}`,
                    background: active ? C.orangeLight : C.bg,
                    borderRadius: 16, padding: "14px 12px",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                    color: active ? C.orange : C.text,
                    gridColumn: idx === SECONDARY_TABS.length - 1 && SECONDARY_TABS.length % 2 !== 0 ? "1 / -1" : undefined,
                  }}>
                    <span style={{ color: active ? C.orange : C.textMuted }}>{Icon[t.icon]}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV — 4 primary tabs + "Más" */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: C.navBg,
        borderTop: `1px solid ${C.greyLight}`,
        display: "flex", zIndex: 20,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {PRIMARY_TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => { setTab(t.id); setShowMore(false); }} style={{
              flex: 1, border: "none", background: "transparent",
              padding: "12px 0 10px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              color: active ? C.orange : C.greyMid,
              transition: "color 0.2s",
              position: "relative",
            }}>
              {Icon[t.icon]}
              <span style={{
                fontSize: 9, fontWeight: active ? 800 : 500,
                textTransform: "uppercase", letterSpacing: 0.8,
                color: active ? C.orange : C.textMuted,
              }}>{t.label}</span>
              {active && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 2.5, background: C.orange, borderRadius: 2 }} />}
            </button>
          );
        })}
        {/* "Más" button */}
        <button
          onClick={() => setShowMore(m => !m)}
          style={{
            flex: 1, border: "none", background: "transparent",
            padding: "12px 0 10px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: SECONDARY_TABS.some(t => t.id === tab) ? C.orange : C.greyMid,
            position: "relative",
          }}
        >
          {Icon.grid}
          <span style={{
            fontSize: 9, fontWeight: 500,
            textTransform: "uppercase", letterSpacing: 0.8,
            color: SECONDARY_TABS.some(t => t.id === tab) ? C.orange : C.textMuted,
          }}>Más</span>
          {SECONDARY_TABS.some(t => t.id === tab) && <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 24, height: 2.5, background: C.orange, borderRadius: 2 }} />}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "hero",       label: "Home",          pct: 2  },
  { id: "about",      label: "About",         pct: 13 },
  { id: "work",       label: "Work",          pct: 24 },
  { id: "realestate", label: "Real Estate",   pct: 35 },
  { id: "investing",  label: "Investing",     pct: 46 },
  { id: "service",    label: "Service",       pct: 57 },
  { id: "leadership", label: "Experience",    pct: 68 },
  { id: "skills",     label: "Skills",        pct: 79 },
  { id: "contact",    label: "Contact",       pct: 91 },
];

// Islands placed above/below the center course line
const ISLANDS = [
  { pct: 17, dy: -9,  type: "atoll" as const },
  { pct: 31, dy:  9,  type: "rocky" as const },
  { pct: 49, dy: -9,  type: "atoll" as const },
  { pct: 65, dy:  9,  type: "rocky" as const },
  { pct: 82, dy: -9,  type: "atoll" as const },
];

// Boat weave path: [pct*100, yOffset from centerline px]
// Boat arcs around each island as it passes
const WEAVE: [number, number][] = [
  [0,    0],
  [10,  -2],
  [17, -10],   // arc above island @17%
  [24,   0],
  [28,   3],
  [31,  10],   // arc below island @31%
  [38,   0],
  [44,  -3],
  [49, -10],   // arc above island @49%
  [56,   0],
  [61,   3],
  [65,  10],   // arc below island @65%
  [72,   0],
  [78,  -3],
  [82, -10],   // arc above island @82%
  [90,   0],
  [100,  0],
];

function getWeaveY(pct100: number): number {
  for (let i = 0; i < WEAVE.length - 1; i++) {
    const [x0, y0] = WEAVE[i];
    const [x1, y1] = WEAVE[i + 1];
    if (pct100 >= x0 && pct100 <= x1) {
      const t = (x1 === x0) ? 0 : (pct100 - x0) / (x1 - x0);
      const s = t * t * (3 - 2 * t); // smoothstep easing
      return y0 + (y1 - y0) * s;
    }
  }
  return 0;
}

// Deterministic water sparkle positions (no Math.random — avoids hydration mismatch)
const SPARKLES = Array.from({ length: 28 }, (_, i) => ({
  x: ((i * 89 + 11) % 1000) + ((i % 3) * 333),
  y: ((i * 37 + 7) % 42) + 5,
  o: ((i * 13) % 6) / 100 + 0.03,
  r: ((i * 7) % 3) / 10 + 0.5,
}));

// ── Island SVGs ──────────────────────────────────────────────────────

function IslandAtoll() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
      {/* Water halo / reflection */}
      <ellipse cx="14" cy="18" rx="13" ry="4" fill="rgba(94,122,150,0.1)" />
      {/* Sandy base */}
      <ellipse cx="14" cy="16.5" rx="9" ry="3.2"
        fill="rgba(196,164,96,0.13)"
        stroke="rgba(196,164,96,0.25)"
        strokeWidth="0.5"
      />
      {/* Trunk */}
      <path d="M14,15.5 C14.5,12 13.5,9 13,6.5"
        stroke="rgba(255,255,255,0.22)" strokeWidth="0.9" fill="none" />
      {/* Fronds */}
      <path d="M13,6.5 C10.5,4.5 8,4 7,5"   stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" fill="none" />
      <path d="M13,6.5 C11.5,3 12.5,1 13.5,1" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" fill="none" />
      <path d="M13,6.5 C15.5,4.5 18,4.5 19,5.5" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" fill="none" />
      {/* Frond tips */}
      <circle cx="7"  cy="5"   r="0.7" fill="rgba(255,255,255,0.1)" />
      <circle cx="13.5" cy="1" r="0.7" fill="rgba(255,255,255,0.1)" />
      <circle cx="19" cy="5.5" r="0.7" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

function IslandRocky() {
  return (
    <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
      {/* Water halo */}
      <ellipse cx="14" cy="18.5" rx="13" ry="3.5" fill="rgba(94,122,150,0.09)" />
      {/* Outer rock mass */}
      <path
        d="M4,18 L7,10 L10,14 L13,7 L16,12.5 L20,8 L23.5,11 L25,18 Z"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* Inner shadow / depth */}
      <path
        d="M8,18 L10,13 L13,15.5 L17,11.5 L21,18 Z"
        fill="rgba(255,255,255,0.04)"
        strokeLinejoin="round"
      />
      {/* Rock highlight */}
      <path d="M13,7 L14,5.5 L15,7" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

// ── Detailed NavBoat ──────────────────────────────────────────────────

function NavBoat({ flipped, speed }: { flipped: boolean; speed: number }) {
  const wk = Math.min(speed, 1); // 0–1 wake intensity
  return (
    <svg
      width="64" height="22" viewBox="0 0 64 22" fill="none"
      overflow="visible"
      style={{ display: "block", transform: flipped ? "scaleX(-1)" : "none" }}
    >
      {/* === Wake lines (trailing from stern) === */}
      <path
        d="M61,8.5 C68,7.6 76,8.4 86,7.5"
        stroke={`rgba(255,255,255,${wk * 0.65})`}
        strokeWidth="0.9" strokeDasharray="5 3" fill="none"
        strokeLinecap="round"
      />
      <path
        d="M61,13.5 C68,14.4 76,13.6 86,14.5"
        stroke={`rgba(255,255,255,${wk * 0.45})`}
        strokeWidth="0.7" strokeDasharray="4 4" fill="none"
        strokeLinecap="round"
      />
      <path
        d="M61,11 C70,11 80,11.5 90,11"
        stroke={`rgba(255,255,255,${wk * 0.22})`}
        strokeWidth="0.5" strokeDasharray="2 6" fill="none"
        strokeLinecap="round"
      />
      {/* Foam at bow when moving */}
      <ellipse
        cx="4" cy="11" rx="3.5" ry="2"
        fill={`rgba(255,255,255,${wk * 0.1})`}
      />

      {/* === Hull outer === */}
      <path
        d="M4,11 C7,5 17,2 32,2 C47,2 57,5 60,11 C57,17 47,20 32,20 C17,20 7,17 4,11 Z"
        fill="#0D1520"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth="0.6"
      />
      {/* === Deck surface === */}
      <path
        d="M8,11 C11,6.5 19,4 32,4 C45,4 53,6.5 56,11 C53,15.5 45,18 32,18 C19,18 11,15.5 8,11 Z"
        fill="#131E2C"
      />
      {/* === Gold waterline top === */}
      <path
        d="M8,9.5 C11,5.5 19,3.5 32,3.5 C45,3.5 53,5.5 56,9.5"
        stroke="rgba(196,164,96,0.58)" strokeWidth="0.7" fill="none"
      />
      {/* === Gold waterline bottom === */}
      <path
        d="M8,12.5 C11,16.5 19,18.5 32,18.5 C45,18.5 53,16.5 56,12.5"
        stroke="rgba(196,164,96,0.58)" strokeWidth="0.7" fill="none"
      />

      {/* === Forward deck panels === */}
      <path d="M9,10 L8,11 L9,12 L17,12.5 L17,9.5 Z" fill="rgba(255,255,255,0.03)" />

      {/* === Cabin / bridge block === */}
      <rect x="23" y="5.5" width="20" height="11" rx="1.5"
        fill="#0A1320" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      {/* Windshield */}
      <path d="M25,6.5 L39,6.5 L41,9 L23,9 Z"
        fill="rgba(94,122,150,0.2)" stroke="rgba(94,122,150,0.2)" strokeWidth="0.3" />
      {/* Cabin windows */}
      <rect x="27" y="10" width="4" height="3" rx="0.6"
        fill="rgba(94,122,150,0.16)" stroke="rgba(94,122,150,0.2)" strokeWidth="0.3" />
      <rect x="33.5" y="10" width="4" height="3" rx="0.6"
        fill="rgba(94,122,150,0.16)" stroke="rgba(94,122,150,0.2)" strokeWidth="0.3" />

      {/* === Mast === */}
      <line x1="33" y1="5.5" x2="33" y2="2.5" stroke="rgba(255,255,255,0.22)" strokeWidth="0.5" />
      {/* Radar arm */}
      <line x1="33" y1="3.2" x2="35.5" y2="3.2" stroke="rgba(255,255,255,0.14)" strokeWidth="0.5" />
      <circle cx="35.5" cy="3.2" r="0.8" fill="rgba(196,164,96,0.3)" />

      {/* === Bow nav light === */}
      <circle cx="4" cy="11" r="2.2" fill="rgba(196,164,96,0.25)" />
      <circle cx="4" cy="11" r="1.1" fill="rgba(196,164,96,0.9)" />

      {/* === Stern engine block === */}
      <rect x="58" y="7.5" width="6" height="7" rx="1.2"
        fill="#090E16" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
      {/* Engine vents */}
      <line x1="59.5" y1="9.5" x2="62.5" y2="9.5" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
      <line x1="59.5" y1="11" x2="62.5" y2="11"  stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
      <line x1="59.5" y1="12.5" x2="62.5" y2="12.5" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />

      {/* === Deck cleats / detail lines === */}
      <line x1="16" y1="8.5"  x2="22" y2="8.5"  stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <line x1="16" y1="13.5" x2="22" y2="13.5" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <line x1="44" y1="8.5"  x2="54" y2="8.5"  stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <line x1="44" y1="13.5" x2="54" y2="13.5" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
    </svg>
  );
}

// ── Waypoint dot ─────────────────────────────────────────────────────

function Waypoint({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <a href={href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none" }}>
      <div style={{
        width:        active ? "7px" : "5px",
        height:       active ? "7px" : "5px",
        borderRadius: "50%",
        background:   active ? "var(--gold)" : "rgba(255,255,255,0.22)",
        boxShadow:    active ? "0 0 8px rgba(196,164,96,0.6)" : "none",
        transition:   "all 0.4s ease",
      }} />
      <span
        className="hidden md:block"
        style={{
          fontSize:      "0.53rem",
          fontWeight:    600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         active ? "var(--gold)" : "rgba(255,255,255,0.22)",
          transition:    "color 0.4s ease",
          lineHeight:    1,
          whiteSpace:    "nowrap",
        }}
      >
        {label}
      </span>
    </a>
  );
}

// ── Main component ───────────────────────────────────────────────────

interface Ripple { id: number; x: number; y: number; }

const BOAT_W = 64;

export default function OceanNav() {
  const [scrollPct,  setScrollPct]  = useState(0);
  const [activeId,   setActiveId]   = useState("hero");
  const [flipped,    setFlipped]    = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [speed,      setSpeed]      = useState(0);
  const [ripples,    setRipples]    = useState<Ripple[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const routeRef      = useRef<HTMLDivElement>(null);
  const prevBoatXRef  = useRef(0);
  const lastRippleX   = useRef(-999);
  const rippleIdRef   = useRef(0);

  useEffect(() => {
    function onScroll() {
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      const pct    = totalH > 0 ? Math.min(window.scrollY / totalH, 1) : 0;
      setScrollPct(pct);
      setScrolled(window.scrollY > 30);

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.5) {
          setActiveId(SECTIONS[i].id);
          break;
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const routeW = routeRef.current?.clientWidth ?? 0;
  const boatX  = scrollPct * Math.max(0, routeW - BOAT_W);
  const boatDY = getWeaveY(scrollPct * 100);

  // Track velocity and spawn ripples
  useEffect(() => {
    const dx = boatX - prevBoatXRef.current;
    prevBoatXRef.current = boatX;

    if (Math.abs(dx) > 0.3) {
      setFlipped(dx < 0);
      setSpeed(Math.min(Math.abs(dx) * 5, 10));
    } else {
      setSpeed(0);
    }

    // Spawn a wake ripple every ~14px of travel
    if (Math.abs(boatX - lastRippleX.current) > 14) {
      lastRippleX.current = boatX;
      const id  = rippleIdRef.current++;
      const sx  = flipped ? boatX : boatX + BOAT_W;
      setRipples(prev => [...prev.slice(-6), { id, x: sx, y: boatDY }]);
      const t = setTimeout(
        () => setRipples(prev => prev.filter(r => r.id !== id)),
        1100,
      );
      return () => clearTimeout(t);
    }
  }, [boatX, boatDY, flipped]);

  return (
    <nav
      style={{
        position:       "fixed",
        top: 0, left: 0, right: 0,
        zIndex:         50,
        background:     scrolled ? "rgba(4,10,20,0.97)" : "rgba(4,10,20,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom:   scrolled
          ? "1px solid rgba(94,122,150,0.2)"
          : "1px solid rgba(94,122,150,0.08)",
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}
    >
      {/* ── Main strip ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        height: "52px",
        padding: "0 20px",
        gap: "16px",
      }}>
        {/* Logo */}
        <a href="#hero" style={{
          fontFamily:     "var(--font-serif)",
          fontSize:       "1rem",
          fontWeight:     500,
          color:          "var(--text-1)",
          letterSpacing:  "0.08em",
          textDecoration: "none",
          flexShrink:     0,
        }}>
          BLN<span style={{ color: "var(--gold)" }}>.</span>
        </a>

        {/* ── Route / water track ── */}
        <div
          ref={routeRef}
          style={{
            flex:      1,
            position:  "relative",
            height:    "40px",
            display:   "flex",
            alignItems: "center",
            overflow:  "hidden",
            borderRadius: "5px",
            border:    "1px solid rgba(94,122,150,0.12)",
          }}
        >
          {/* Water gradient base */}
          <div style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg," +
              " rgba(3,12,26,0.9) 0%," +
              " rgba(4,16,32,0.95) 40%," +
              " rgba(3,12,26,0.9) 100%)",
          }} />

          {/* Animated water shimmer — layer 1 (slow) */}
          <svg
            aria-hidden="true"
            style={{
              position:  "absolute",
              top: 0, left: 0,
              width:     "200%",
              height:    "100%",
              animation: "navWaterScroll 18s linear infinite",
              pointerEvents: "none",
              opacity:   0.9,
            }}
            viewBox="0 0 2000 40"
            preserveAspectRatio="none"
          >
            {/* Gentle wave lines */}
            {[7, 13, 19, 26, 33].map((y, i) => (
              <path
                key={i}
                d={
                  `M0,${y}` +
                  ` Q200,${y - 1.8} 400,${y}` +
                  ` Q600,${y + 1.8} 800,${y}` +
                  ` Q1000,${y - 1.8} 1200,${y}` +
                  ` Q1400,${y + 1.8} 1600,${y}` +
                  ` Q1800,${y - 1.8} 2000,${y}`
                }
                stroke={`rgba(94,122,150,${0.04 + (i % 2) * 0.03})`}
                strokeWidth="0.6"
                fill="none"
              />
            ))}
            {/* Gold sparkles */}
            {SPARKLES.slice(0, 14).map((s, i) => (
              <circle key={i} cx={s.x % 2000} cy={(s.y * 40) / 52} r={s.r}
                fill={`rgba(196,164,96,${s.o})`} />
            ))}
          </svg>

          {/* Animated water shimmer — layer 2 (slightly faster, opposite phase) */}
          <svg
            aria-hidden="true"
            style={{
              position:  "absolute",
              top: 0, left: 0,
              width:     "200%",
              height:    "100%",
              animation: "navWaterScroll2 24s linear infinite",
              pointerEvents: "none",
              opacity:   0.5,
            }}
            viewBox="0 0 2000 40"
            preserveAspectRatio="none"
          >
            {[10, 20, 30].map((y, i) => (
              <path
                key={i}
                d={
                  `M0,${y}` +
                  ` Q300,${y + 2} 600,${y}` +
                  ` Q900,${y - 2} 1200,${y}` +
                  ` Q1500,${y + 2} 1800,${y}` +
                  ` Q1900,${y - 1} 2000,${y}`
                }
                stroke={`rgba(94,122,150,${0.025 + i * 0.01})`}
                strokeWidth="0.5"
                fill="none"
              />
            ))}
            {SPARKLES.slice(14).map((s, i) => (
              <circle key={i} cx={s.x % 2000} cy={(s.y * 40) / 52} r={s.r * 0.8}
                fill={`rgba(196,164,96,${s.o * 0.7})`} />
            ))}
          </svg>

          {/* Route dashed course line */}
          <div style={{
            position:  "absolute",
            insetInline: 0,
            top:       "50%",
            transform: "translateY(-50%)",
            height:    "1px",
            background:
              "repeating-linear-gradient(90deg," +
              " rgba(196,164,96,0.18) 0px," +
              " rgba(196,164,96,0.18) 4px," +
              " transparent 4px," +
              " transparent 10px)",
            zIndex: 1,
          }} />

          {/* Islands */}
          {ISLANDS.map((isl, idx) => (
            <div
              key={idx}
              style={{
                position:      "absolute",
                left:          `${isl.pct}%`,
                top:           "50%",
                transform:     `translate(-50%, calc(-50% + ${isl.dy}px))`,
                pointerEvents: "none",
                zIndex:        2,
              }}
            >
              {isl.type === "atoll" ? <IslandAtoll /> : <IslandRocky />}
            </div>
          ))}

          {/* Waypoints */}
          {SECTIONS.map((s) => (
            <div
              key={s.id}
              style={{
                position:  "absolute",
                left:      `${s.pct}%`,
                top:       "50%",
                transform: "translate(-50%, -50%)",
                zIndex:    3,
              }}
            >
              <Waypoint active={activeId === s.id} href={`#${s.id}`} label={s.label} />
            </div>
          ))}

          {/* Wake ripples */}
          {ripples.map(r => (
            <div
              key={r.id}
              style={{
                position:      "absolute",
                left:          `${r.x}px`,
                top:           `calc(50% + ${r.y}px)`,
                pointerEvents: "none",
                zIndex:        3,
              }}
            >
              <div style={{
                width:        "14px",
                height:       "7px",
                borderRadius: "50%",
                border:       "1px solid rgba(255,255,255,0.4)",
                animation:    "rippleExpand 1.1s ease-out forwards",
              }} />
            </div>
          ))}

          {/* Boat */}
          <div
            style={{
              position:   "absolute",
              top:        "50%",
              left:       0,
              transform:  `translate(${boatX}px, calc(-50% + ${boatDY}px))`,
              transition: "transform 0.15s linear",
              pointerEvents: "none",
              zIndex:     5,
            }}
          >
            <NavBoat flipped={flipped} speed={speed / 10} />
          </div>
        </div>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="btn btn-outline hidden md:inline-flex"
          style={{ padding: "7px 16px", fontSize: "0.75rem" }}
        >
          Contact
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Menu"
          style={{
            background: "none",
            border:     "none",
            cursor:     "pointer",
            color:      "var(--text-2)",
            padding:    "4px",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {mobileOpen ? (
              <>
                <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="2" x2="2"  y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="2" y1="4"  x2="16" y2="4"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2" y1="9"  x2="16" y2="9"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobileOpen && (
        <div style={{
          borderTop:  "1px solid var(--border)",
          background: "rgba(4,10,20,0.98)",
        }}>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setMobileOpen(false)}
              style={{
                display:        "block",
                padding:        "13px 20px",
                fontSize:       "0.8rem",
                color:          activeId === s.id ? "var(--gold)" : "var(--text-2)",
                textDecoration: "none",
                borderBottom:   "1px solid var(--border)",
                transition:     "color 0.2s ease",
              }}
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

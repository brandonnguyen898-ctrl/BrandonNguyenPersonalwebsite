"use client";

import { useEffect, useRef, useState } from "react";

// ── Section definitions ──────────────────────────────────────────────
const SECTIONS = [
  { id: "hero",       label: "Home",           pct: 3  },
  { id: "about",      label: "About",          pct: 14 },
  { id: "work",       label: "Work",           pct: 25 },
  { id: "realestate", label: "Real Estate",    pct: 36 },
  { id: "investing",  label: "Investing",      pct: 47 },
  { id: "service",    label: "Public Service", pct: 58 },
  { id: "leadership", label: "Leadership",     pct: 69 },
  { id: "skills",     label: "Skills",         pct: 80 },
  { id: "contact",    label: "Contact",        pct: 91 },
];

// ── Tiny boat SVG ────────────────────────────────────────────────────
function MiniBoat({ flipped }: { flipped: boolean }) {
  return (
    <svg
      width="48"
      height="18"
      viewBox="0 0 50 18"
      style={{
        overflow: "visible",
        display: "block",
        transform: flipped ? "scaleX(-1)" : "none",
      }}
    >
      {/* Shadow */}
      <ellipse cx="25" cy="14.5" rx="21" ry="4.5" fill="rgba(0,0,0,0.35)" />
      {/* Hull */}
      <path
        d="M3,9 Q7,3 25,2.5 Q41,2.5 47,9 Q41,15.5 25,15.5 Q7,15 3,9 Z"
        fill="#0B1E33"
      />
      {/* Deck */}
      <path
        d="M7,9 Q10,5.5 25,5 Q39,5 43,9 Q39,13 25,13 Q10,12.5 7,9 Z"
        fill="#18334d"
      />
      {/* Gold stripe */}
      <path
        d="M7,9 C15,8.4 20,8.2 25,8.2 C30,8.2 38,8.4 43,9 C38,9.6 30,9.8 25,9.8 C20,9.8 15,9.6 7,9 Z"
        fill="#C8A96A"
        opacity="0.8"
      />
      {/* Cabin */}
      <path
        d="M18,8 Q22,5.5 28,5.5 Q32,5.5 33,8 Q32,10.5 28,10.5 Q22,10.5 18,8 Z"
        fill="#050c18"
      />
      {/* Windshield */}
      <path
        d="M19.5,8 Q22.5,6.2 27.5,6.2 Q31,6.2 32,8 Z"
        fill="#1FA6A6"
        opacity="0.35"
      />
      {/* Bow chrome */}
      <circle cx="4" cy="9" r="1.5" fill="#C8A96A" />
      {/* Engine */}
      <rect x="44" y="7" width="5" height="4" rx="1.5" fill="#0B1E33" />
      {/* Wake lines (extend behind boat) */}
      <path
        d="M3,7.8 Q-7,7.4 -18,7.8"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="3 2"
      />
      <path
        d="M3,10.2 Q-7,10.6 -18,10.2"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="0.8"
        fill="none"
        strokeDasharray="2 3"
      />
    </svg>
  );
}

// ── Island marker ────────────────────────────────────────────────────
function IslandMarker({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-1 group"
      style={{ textDecoration: "none" }}
    >
      {/* Dot */}
      <div
        style={{
          width:        active ? "9px" : "7px",
          height:       active ? "9px" : "7px",
          borderRadius: "50%",
          background:   active ? "#1FA6A6" : "rgba(200,169,106,0.45)",
          boxShadow:    active
            ? "0 0 10px rgba(31,166,166,0.9), 0 0 22px rgba(31,166,166,0.4)"
            : "none",
          transition:   "all 0.5s ease",
        }}
      />
      {/* Label */}
      <span
        className="whitespace-nowrap hidden md:block transition-colors duration-300"
        style={{
          fontSize:      "0.58rem",
          fontWeight:    600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: active
            ? "#1FA6A6"
            : "rgba(170,182,197,0.45)",
        }}
      >
        {label}
      </span>
    </a>
  );
}

// ── OceanNav ─────────────────────────────────────────────────────────
export default function OceanNav() {
  const [scrollPct, setScrollPct]     = useState(0);
  const [activeId, setActiveId]       = useState("hero");
  const [prevX, setPrevX]             = useState(0);
  const [flipped, setFlipped]         = useState(false);
  const [opaque, setOpaque]           = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const routeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      const raw    = totalH > 0 ? window.scrollY / totalH : 0;
      setScrollPct(Math.min(raw, 1));
      setOpaque(window.scrollY > 40);

      // Active section
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.55) {
          setActiveId(SECTIONS[i].id);
          break;
        }
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Compute boat X inside the route container
  const routeW = routeRef.current?.clientWidth ?? 0;
  const boatW  = 48;
  const boatX  = scrollPct * Math.max(0, routeW - boatW);

  // Detect direction change for flipping
  useEffect(() => {
    if (boatX > prevX + 1)  setFlipped(false);
    if (boatX < prevX - 1)  setFlipped(true);
    setPrevX(boatX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boatX]);

  return (
    <>
      {/* ── Fixed nav strip ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex flex-col"
        style={{
          background:     opaque ? "rgba(5,8,20,0.88)" : "rgba(5,8,20,0.55)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom:   "1px solid rgba(255,255,255,0.06)",
          transition:     "background 0.4s ease",
        }}
      >
        {/* Main row */}
        <div className="flex items-center h-14 px-5 gap-4">
          {/* Logo */}
          <a
            href="#hero"
            className="serif flex-shrink-0"
            style={{
              fontSize:      "1.05rem",
              fontWeight:    600,
              color:         "#F4F7FA",
              letterSpacing: "0.06em",
              textDecoration: "none",
            }}
          >
            BLN
            <span style={{ color: "#C8A96A" }}>.</span>
          </a>

          {/* Route container */}
          <div
            ref={routeRef}
            className="flex-1 relative h-14 flex items-center"
            style={{ overflow: "visible" }}
          >
            {/* Dashed route line */}
            <div
              className="absolute inset-x-0"
              style={{
                top:        "50%",
                transform:  "translateY(-50%)",
                height:     "1px",
                background:
                  "repeating-linear-gradient(90deg, rgba(200,169,106,0.35) 0px, rgba(200,169,106,0.35) 6px, transparent 6px, transparent 14px)",
              }}
            />

            {/* Island markers */}
            {SECTIONS.map((s) => (
              <div
                key={s.id}
                className="absolute flex flex-col items-center"
                style={{
                  left:      `${s.pct}%`,
                  top:       "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <IslandMarker
                  active={activeId === s.id}
                  href={`#${s.id}`}
                  label={s.label}
                />
              </div>
            ))}

            {/* Boat — moves with scroll */}
            <div
              className="absolute"
              style={{
                top:       "50%",
                transform: `translateY(-50%) translateX(${boatX}px)`,
                transition: "transform 0.15s linear",
                pointerEvents: "none",
              }}
            >
              <MiniBoat flipped={flipped} />
            </div>
          </div>

          {/* Desktop CTA + mobile hamburger */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <a href="#contact" className="btn-primary hidden md:inline-flex" style={{ padding: "8px 18px", fontSize: "0.78rem" }}>
              Contact
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              aria-label="Menu"
              style={{ color: "#AAB6C5" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            className="md:hidden flex flex-col"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(5,8,20,0.97)" }}
          >
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setMobileOpen(false)}
                className="px-6 py-3 text-sm transition-colors"
                style={{
                  color:       activeId === s.id ? "#1FA6A6" : "#AAB6C5",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  textDecoration: "none",
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}

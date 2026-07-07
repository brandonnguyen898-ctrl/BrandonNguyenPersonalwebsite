"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "hero",       label: "Home",          pct: 2  },
  { id: "about",      label: "About",         pct: 13 },
  { id: "work",       label: "Work",          pct: 24 },
  { id: "realestate", label: "Real Estate",   pct: 35 },
  { id: "investing",  label: "Investing",     pct: 46 },
  { id: "service",    label: "Public Service",pct: 57 },
  { id: "leadership", label: "Experience",    pct: 68 },
  { id: "skills",     label: "Skills",        pct: 79 },
  { id: "contact",    label: "Contact",       pct: 91 },
];

// Refined top-down nautical silhouette — no cartoonish cabin
function NavBoat({ flipped }: { flipped: boolean }) {
  return (
    <svg
      width="44"
      height="16"
      viewBox="0 0 44 16"
      fill="none"
      style={{ display: "block", transform: flipped ? "scaleX(-1)" : "none" }}
    >
      {/* Hull */}
      <path
        d="M2,8 C5,3 14,1.5 22,1.5 C30,1.5 39,3 42,8 C39,13 30,14.5 22,14.5 C14,14.5 5,13 2,8 Z"
        fill="#111318"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.5"
      />
      {/* Deck surface */}
      <path
        d="M6,8 C9,5 15,3.5 22,3.5 C29,3.5 35,5 38,8 C35,11 29,12.5 22,12.5 C15,12.5 9,11 6,8 Z"
        fill="#161B24"
      />
      {/* Gold waterline */}
      <path
        d="M6,7.2 C9,4.8 15,3.5 22,3.5 C29,3.5 35,4.8 38,7.2"
        stroke="rgba(196,164,96,0.55)"
        strokeWidth="0.6"
        fill="none"
      />
      <path
        d="M6,8.8 C9,11.2 15,12.5 22,12.5 C29,12.5 35,11.2 38,8.8"
        stroke="rgba(196,164,96,0.55)"
        strokeWidth="0.6"
        fill="none"
      />
      {/* Cabin (minimal rectangle) */}
      <rect x="17" y="4.5" width="12" height="7" rx="1" fill="#0C1018" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" />
      {/* Bow chrome */}
      <circle cx="2.5" cy="8" r="1.2" fill="rgba(196,164,96,0.5)" />
      {/* Wake lines — trail behind stern */}
      <path
        d="M42,6.5 C46,6.2 52,6.5 58,6"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.7"
        fill="none"
        strokeDasharray="3 2"
      />
      <path
        d="M42,9.5 C46,9.8 52,9.5 58,10"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.5"
        fill="none"
        strokeDasharray="2 3"
      />
    </svg>
  );
}

// Minimal waypoint dot
function Waypoint({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <a href={href} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none" }}>
      <div
        style={{
          width:        active ? "7px" : "5px",
          height:       active ? "7px" : "5px",
          borderRadius: "50%",
          background:   active ? "var(--gold)" : "rgba(255,255,255,0.2)",
          boxShadow:    active ? "0 0 8px rgba(196,164,96,0.6)" : "none",
          transition:   "all 0.4s ease",
        }}
      />
      <span
        className="hidden md:block"
        style={{
          fontSize:      "0.55rem",
          fontWeight:    600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         active ? "var(--gold)" : "rgba(255,255,255,0.2)",
          transition:    "color 0.4s ease",
          lineHeight:    1,
        }}
      >
        {label}
      </span>
    </a>
  );
}

export default function OceanNav() {
  const [scrollPct, setScrollPct] = useState(0);
  const [activeId,  setActiveId]  = useState("hero");
  const [prevX,     setPrevX]     = useState(0);
  const [flipped,   setFlipped]   = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const routeRef = useRef<HTMLDivElement>(null);

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
  const boatW  = 44;
  const boatX  = scrollPct * Math.max(0, routeW - boatW);

  useEffect(() => {
    if (boatX > prevX + 1)  setFlipped(false);
    if (boatX < prevX - 1)  setFlipped(true);
    setPrevX(boatX);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boatX]);

  return (
    <>
      <nav
        style={{
          position:       "fixed",
          top:            0,
          left:           0,
          right:          0,
          zIndex:         50,
          background:     scrolled ? "rgba(8,8,9,0.94)" : "rgba(8,8,9,0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom:   scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          transition:     "background 0.35s ease, border-color 0.35s ease",
        }}
      >
        {/* Main strip */}
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            height:     "52px",
            padding:    "0 20px",
            gap:        "16px",
          }}
        >
          {/* Logo */}
          <a
            href="#hero"
            style={{
              fontFamily:     "var(--font-serif)",
              fontSize:       "1rem",
              fontWeight:     500,
              color:          "var(--text-1)",
              letterSpacing:  "0.08em",
              textDecoration: "none",
              flexShrink:     0,
            }}
          >
            BLN<span style={{ color: "var(--gold)" }}>.</span>
          </a>

          {/* Route track */}
          <div
            ref={routeRef}
            style={{
              flex:     1,
              position: "relative",
              height:   "52px",
              display:  "flex",
              alignItems: "center",
              overflow: "visible",
            }}
          >
            {/* Route line */}
            <div
              style={{
                position:   "absolute",
                insetInline: 0,
                top:        "50%",
                transform:  "translateY(-50%)",
                height:     "1px",
                background: "repeating-linear-gradient(90deg, rgba(196,164,96,0.22) 0px, rgba(196,164,96,0.22) 4px, transparent 4px, transparent 10px)",
              }}
            />

            {/* Waypoints */}
            {SECTIONS.map((s) => (
              <div
                key={s.id}
                style={{
                  position:  "absolute",
                  left:      `${s.pct}%`,
                  top:       "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Waypoint active={activeId === s.id} href={`#${s.id}`} label={s.label} />
              </div>
            ))}

            {/* Boat */}
            <div
              style={{
                position:   "absolute",
                top:        "50%",
                transform:  `translateY(-50%) translateX(${boatX}px)`,
                transition: "transform 0.18s linear",
                pointerEvents: "none",
                zIndex:     2,
              }}
            >
              <NavBoat flipped={flipped} />
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
              background:  "none",
              border:      "none",
              cursor:      "pointer",
              color:       "var(--text-2)",
              padding:     "4px",
              flexShrink:  0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              {mobileOpen ? (
                <>
                  <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              background: "rgba(8,8,9,0.98)",
            }}
          >
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
    </>
  );
}

"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero",       label: "Home"           },
  { id: "about",      label: "About"          },
  { id: "work",       label: "Work"           },
  { id: "investing",  label: "Investing"      },
  { id: "service",    label: "Public Service" },
  { id: "leadership", label: "Experience"     },
  { id: "skills",     label: "Skills"         },
  { id: "contact",    label: "Contact"        },
];

export default function OceanNav() {
  const [activeId,   setActiveId]   = useState("hero");
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
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

  return (
    <nav
      style={{
        position:       "fixed",
        top: 0, left: 0, right: 0,
        zIndex:         50,
        background:     scrolled ? "rgba(8,8,9,0.97)" : "rgba(8,8,9,0.82)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom:   scrolled
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(255,255,255,0.05)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div style={{
        display:     "flex",
        alignItems:  "center",
        height:      "52px",
        padding:     "0 24px",
        maxWidth:    "1200px",
        margin:      "0 auto",
        gap:         "8px",
      }}>

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
            marginRight:    "16px",
          }}
        >
          BLN<span style={{ color: "var(--gold)" }}>.</span>
        </a>

        {/* Desktop tabs */}
        <div
          className="hidden md:flex"
          style={{ flex: 1, display: "flex", alignItems: "center", gap: "2px" }}
        >
          {SECTIONS.map((s) => {
            const active = activeId === s.id;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  padding:        "5px 12px",
                  fontSize:       "0.75rem",
                  fontWeight:     active ? 500 : 400,
                  letterSpacing:  "0.02em",
                  color:          active ? "var(--text-1)" : "var(--text-2)",
                  textDecoration: "none",
                  borderRadius:   "4px",
                  background:     active ? "rgba(255,255,255,0.06)" : "transparent",
                  borderBottom:   active ? "1px solid var(--gold)" : "1px solid transparent",
                  transition:     "all 0.2s ease",
                  whiteSpace:     "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--text-1)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "var(--text-2)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {s.label}
              </a>
            );
          })}
        </div>

        <div style={{ flex: 1 }} className="md:hidden" />

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
                <line x1="2" y1="2"  x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{
          borderTop:  "1px solid var(--border)",
          background: "rgba(8,8,9,0.98)",
        }}>
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={() => setMobileOpen(false)}
              style={{
                display:        "block",
                padding:        "13px 24px",
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

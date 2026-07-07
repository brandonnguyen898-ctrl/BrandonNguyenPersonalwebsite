"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Deterministic star positions (no Math.random for hydration safety) ──
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: (i * 73 + 11) % 100,
  y: (i * 37 + 7) % 38,
  size: i % 5 === 0 ? 2 : 1,
  opacity: ((i * 17) % 6) / 10 + 0.1,
  delay: ((i * 13) % 30) / 10,
  dur: 2 + ((i * 7) % 30) / 10,
}));

// ── SVG: Luxury Speedboat (top-down) ──
function BoatSVG({ dir = 1 }: { dir?: 1 | -1 }) {
  return (
    <svg
      viewBox="0 0 220 72"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: dir === -1 ? "scaleX(-1)" : "none", display: "block" }}
    >
      {/* Drop shadow */}
      <ellipse cx="110" cy="52" rx="95" ry="16" fill="rgba(0,0,0,0.35)" />
      {/* Hull outer – deep navy */}
      <path
        d="M6,36 Q14,18 110,15 Q184,15 214,36 Q184,57 110,57 Q14,54 6,36 Z"
        fill="#0a1628"
      />
      {/* Deck – white */}
      <path
        d="M16,36 Q26,22 110,20 Q178,20 204,36 Q178,52 110,52 Q26,50 16,36 Z"
        fill="#f0f4f8"
      />
      {/* Gold racing stripe */}
      <path
        d="M16,36 C50,33 80,32 110,32 C140,32 178,33 204,36 C178,39 140,40 110,40 C80,40 50,39 16,36 Z"
        fill="#c9a84c"
        opacity="0.85"
      />
      {/* Cabin / cockpit body */}
      <path
        d="M78,32 Q90,22 130,22 Q150,22 158,32 Q150,38 130,38 Q90,38 78,32 Z"
        fill="#1a3a5c"
        stroke="#2d5a8e"
        strokeWidth="0.5"
      />
      {/* Windshield – tinted blue glass */}
      <path
        d="M82,32 Q92,24 128,24 Q146,24 154,32 Z"
        fill="#4cc9f0"
        opacity="0.35"
      />
      <path
        d="M82,32 Q92,24 128,24 Q146,24 154,32"
        fill="none"
        stroke="#90e0ef"
        strokeWidth="0.9"
        opacity="0.8"
      />
      {/* Cabin side windows */}
      <rect x="86" y="33" width="12" height="4" rx="2" fill="#4cc9f0" opacity="0.5" />
      <rect x="102" y="33" width="12" height="4" rx="2" fill="#4cc9f0" opacity="0.5" />
      <rect x="140" y="33" width="10" height="4" rx="2" fill="#4cc9f0" opacity="0.5" />
      {/* Engine pods at stern */}
      <rect x="202" y="28" width="14" height="16" rx="4" fill="#0d1b2a" />
      <rect x="204" y="30" width="10" height="5" rx="2" fill="#2d5a8e" />
      <rect x="204" y="37" width="10" height="5" rx="2" fill="#2d5a8e" />
      {/* Bow chrome detail */}
      <circle cx="10" cy="36" r="3.5" fill="#c9a84c" />
      <circle cx="10" cy="36" r="1.5" fill="#fff8e1" />
      {/* Flag */}
      <line x1="118" y1="12" x2="118" y2="22" stroke="#c9a84c" strokeWidth="1" />
      <path d="M118,12 L128,16 L118,20 Z" fill="#00356b" />
      {/* Wake lines behind boat */}
      <path
        d="M6,33 Q-30,30 -70,32"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 4"
      />
      <path
        d="M6,39 Q-30,42 -70,40"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="5 5"
      />
      <path
        d="M6,36 Q-30,36 -70,36"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="3 7"
      />
    </svg>
  );
}

// ── SVG: Islands ──
function IslandAbout() {
  return (
    <svg viewBox="0 0 180 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="90" cy="95" rx="80" ry="24" fill="rgba(72,202,228,0.18)" />
      <ellipse cx="90" cy="90" rx="65" ry="20" fill="#f4e4c1" />
      <ellipse cx="88" cy="82" rx="50" ry="16" fill="#40916c" />
      <ellipse cx="80" cy="78" rx="9" ry="6" fill="#6d6d6d" opacity="0.6" />
      <ellipse cx="100" cy="76" rx="6" ry="4" fill="#6d6d6d" opacity="0.5" />
      {/* Palm 1 */}
      <line x1="84" y1="80" x2="77" y2="48" stroke="#6d4c41" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="72" cy="48" rx="15" ry="6" fill="#2d6a4f" transform="rotate(-28 72 48)" />
      <ellipse cx="78" cy="44" rx="13" ry="5" fill="#52b788" transform="rotate(8 78 44)" />
      <ellipse cx="73" cy="39" rx="11" ry="4" fill="#74c69d" transform="rotate(-12 73 39)" />
      {/* Palm 2 */}
      <line x1="95" y1="80" x2="103" y2="52" stroke="#5d4037" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="107" cy="52" rx="12" ry="5" fill="#2d6a4f" transform="rotate(22 107 52)" />
      <ellipse cx="101" cy="48" rx="10" ry="4" fill="#52b788" transform="rotate(-8 101 48)" />
      {/* Flowers */}
      <circle cx="87" cy="82" r="2" fill="#ffd166" />
      <circle cx="79" cy="83" r="1.5" fill="#ffd166" />
      <circle cx="94" cy="83" r="1.5" fill="#f4a261" />
      {/* Light rays */}
      <line x1="88" y1="20" x2="88" y2="35" stroke="#ffd166" strokeWidth="1.2" opacity="0.4" />
      <line x1="76" y1="23" x2="79" y2="36" stroke="#ffd166" strokeWidth="0.8" opacity="0.3" />
      <line x1="100" y1="23" x2="97" y2="36" stroke="#ffd166" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

function IslandEducation() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="112" rx="88" ry="26" fill="rgba(72,202,228,0.15)" />
      <ellipse cx="100" cy="106" rx="72" ry="22" fill="#e8d5b0" />
      <ellipse cx="100" cy="97" rx="56" ry="18" fill="#2d6a4f" />
      {/* Building – Yale */}
      <rect x="68" y="60" width="64" height="40" rx="2" fill="#00356b" />
      <path d="M60,64 L100,42 L140,64 Z" fill="#002855" />
      {/* Windows */}
      <rect x="74" y="66" width="14" height="10" rx="1" fill="#90cdf4" opacity="0.7" />
      <rect x="93" y="66" width="14" height="10" rx="1" fill="#90cdf4" opacity="0.7" />
      <rect x="112" y="66" width="14" height="10" rx="1" fill="#90cdf4" opacity="0.7" />
      {/* Door */}
      <rect x="88" y="78" width="24" height="22" rx="2" fill="#c9a84c" />
      <rect x="90" y="80" width="9" height="18" rx="1" fill="#8b6914" />
      <rect x="101" y="80" width="9" height="18" rx="1" fill="#8b6914" />
      {/* Columns */}
      {[76, 88, 100, 112, 124].map((x) => (
        <rect key={x} x={x} y="60" width="3" height="40" rx="1" fill="rgba(255,255,255,0.15)" />
      ))}
      {/* Steps */}
      <rect x="62" y="100" width="76" height="3" rx="0" fill="rgba(255,255,255,0.3)" />
      <rect x="60" y="103" width="80" height="3" rx="0" fill="rgba(255,255,255,0.2)" />
      {/* Flag */}
      <line x1="100" y1="28" x2="100" y2="43" stroke="#c9a84c" strokeWidth="1.5" />
      <path d="M100,28 L116,34 L100,40 Z" fill="#00356b" stroke="#c9a84c" strokeWidth="0.5" />
      {/* Trees */}
      <path d="M50,96 L57,76 L64,96 Z" fill="#1b4332" />
      <path d="M136,96 L143,78 L150,96 Z" fill="#1b4332" />
    </svg>
  );
}

function IslandExperience() {
  return (
    <svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="122" rx="98" ry="28" fill="rgba(72,202,228,0.15)" />
      <ellipse cx="110" cy="115" rx="80" ry="24" fill="#d4b896" />
      <ellipse cx="110" cy="105" rx="64" ry="20" fill="#374151" />
      {/* Main tower */}
      <rect x="84" y="52" width="52" height="56" rx="3" fill="#1f2937" />
      <rect x="88" y="56" width="44" height="48" rx="2" fill="#374151" />
      {/* Windows */}
      {[60, 72, 84].map((y) =>
        [93, 105, 117].map((x) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="9" height="7" rx="1" fill="#93c5fd" opacity="0.7" />
        ))
      )}
      {/* Crane / mast */}
      <line x1="110" y1="24" x2="110" y2="52" stroke="#c9a84c" strokeWidth="2" />
      <line x1="95" y1="30" x2="125" y2="30" stroke="#c9a84c" strokeWidth="1.5" />
      <line x1="110" y1="30" x2="110" y2="52" stroke="#c9a84c" strokeWidth="1.5" />
      {/* Dock */}
      <rect x="150" y="103" width="55" height="8" rx="2" fill="#78350f" />
      {[155, 165, 175, 185, 195].map((x) => (
        <line key={x} x1={x} y1="111" x2={x} y2="124" stroke="#92400e" strokeWidth="2.5" />
      ))}
      {/* Small boat at dock */}
      <path d="M152,108 Q165,104 178,104 Q183,104 183,108 Q165,112 152,108 Z" fill="#1e3a5f" />
      <line x1="165" y1="96" x2="165" y2="104" stroke="#c9a84c" strokeWidth="1" />
      {/* Lamp post */}
      <line x1="30" y1="72" x2="30" y2="105" stroke="#9ca3af" strokeWidth="2" />
      <circle cx="30" cy="68" r="6" fill="#ffd166" opacity="0.8" />
      <ellipse cx="30" cy="75" rx="12" ry="5" fill="#ffd166" opacity="0.12" />
    </svg>
  );
}

function IslandLeadership() {
  return (
    <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="115" rx="88" ry="26" fill="rgba(72,202,228,0.15)" />
      <ellipse cx="100" cy="108" rx="70" ry="22" fill="#c8b59a" />
      <ellipse cx="100" cy="99" rx="56" ry="18" fill="#166534" />
      {/* Mountain */}
      <path d="M62,99 L100,44 L138,99 Z" fill="#1a3a5c" />
      <path d="M74,99 L100,58 L126,99 Z" fill="#1e40af" />
      {/* Snow cap */}
      <path d="M88,62 L100,44 L112,62 Q100,57 88,62 Z" fill="white" opacity="0.9" />
      {/* Sun glow behind mountain */}
      <circle cx="100" cy="40" r="18" fill="#ffd166" opacity="0.15" />
      <circle cx="100" cy="40" r="10" fill="#ffd166" opacity="0.25" />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={100 + 13 * Math.cos((angle * Math.PI) / 180)}
          y1={40 + 13 * Math.sin((angle * Math.PI) / 180)}
          x2={100 + 20 * Math.cos((angle * Math.PI) / 180)}
          y2={40 + 20 * Math.sin((angle * Math.PI) / 180)}
          stroke="#ffd166"
          strokeWidth="1.2"
          opacity="0.4"
        />
      ))}
      {/* Trees */}
      <path d="M44,98 L52,76 L60,98 Z" fill="#14532d" />
      <path d="M140,98 L148,78 L156,98 Z" fill="#14532d" />
      <path d="M52,98 L58,84 L64,98 Z" fill="#166534" />
      <path d="M136,98 L142,86 L148,98 Z" fill="#166534" />
    </svg>
  );
}

function IslandContact() {
  return (
    <svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="sunsetG" cx="50%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#ffd166" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="110" cy="50" rx="90" ry="48" fill="url(#sunsetG)" />
      <ellipse cx="110" cy="122" rx="98" ry="28" fill="rgba(72,202,228,0.2)" />
      <ellipse cx="110" cy="115" rx="80" ry="24" fill="#f0d9a8" />
      <ellipse cx="110" cy="106" rx="64" ry="20" fill="#2d7a4f" />
      {/* Main dock */}
      <rect x="50" y="103" width="120" height="10" rx="3" fill="#92400e" />
      {[56, 68, 80, 92, 104, 116, 128, 140, 152, 162].map((x) => (
        <line key={x} x1={x} y1="113" x2={x} y2="128" stroke="#78350f" strokeWidth="2.5" />
      ))}
      {/* Dock planks */}
      {[55, 65, 75, 85, 95, 105, 115, 125, 135, 145, 155, 163].map((x) => (
        <line key={x} x1={x} y1="104" x2={x} y2="112" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      ))}
      {/* Lamp post */}
      <line x1="88" y1="68" x2="88" y2="103" stroke="#b45309" strokeWidth="2.5" />
      <path d="M82,68 Q88,60 94,68" fill="#b45309" />
      <ellipse cx="88" cy="66" rx="6" ry="5" fill="#ffd166" opacity="0.9" />
      <ellipse cx="88" cy="73" rx="14" ry="5" fill="#ffd166" opacity="0.1" />
      {/* Second lamp */}
      <line x1="132" y1="74" x2="132" y2="103" stroke="#b45309" strokeWidth="2" />
      <ellipse cx="132" cy="72" rx="5" ry="4" fill="#ffd166" opacity="0.8" />
      {/* Sun reflection trail on water */}
      <ellipse cx="110" cy="130" rx="30" ry="6" fill="rgba(255,209,102,0.18)" />
      {/* Small moored boat */}
      <path d="M54,110 Q72,106 90,106 Q96,106 96,110 Q72,114 54,110 Z" fill="#1e3a5f" />
      <line x1="72" y1="96" x2="72" y2="106" stroke="#c9a84c" strokeWidth="1" />
      <path d="M72,96 L82,100 L72,104 Z" fill="#00356b" />
    </svg>
  );
}

// ── Ocean background (fixed layer) ──
function OceanBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0, pointerEvents: "none" }}>
      {/* Base deep ocean gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(185deg, #020b16 0%, #040e1a 8%, #071e3d 20%, #0a2a52 32%, #0d3b6e 46%, #0077b6 62%, #0096c7 74%, #00b4d8 84%, #48cae4 93%, #90e0ef 100%)",
        }}
      />

      {/* Horizon glow */}
      <div
        className="absolute"
        style={{
          top: "18%",
          left: 0,
          right: 0,
          height: "120px",
          background:
            "linear-gradient(180deg, transparent, rgba(201,168,76,0.06), transparent)",
        }}
      />

      {/* Stars */}
      <div className="absolute top-0 left-0 right-0" style={{ height: "28%" }}>
        {STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animation: `twinkle ${s.dur}s ease-in-out infinite`,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div
        className="absolute rounded-full"
        style={{
          top: "6%",
          right: "12%",
          width: "42px",
          height: "42px",
          background: "radial-gradient(circle at 35% 35%, #fffde7, #ffd54f)",
          boxShadow: "0 0 30px rgba(255,213,79,0.25), 0 0 60px rgba(255,213,79,0.1)",
        }}
      />

      {/* Wave lines */}
      {[
        { top: "34%", dur: "11s", delay: "0s", opacity: 0.07 },
        { top: "42%", dur: "8s",  delay: "2s", opacity: 0.09 },
        { top: "50%", dur: "13s", delay: "1s", opacity: 0.06 },
        { top: "58%", dur: "9s",  delay: "3s", opacity: 0.08 },
        { top: "66%", dur: "7s",  delay: "0.5s", opacity: 0.1 },
        { top: "74%", dur: "12s", delay: "2.5s", opacity: 0.07 },
        { top: "82%", dur: "6s",  delay: "1.5s", opacity: 0.09 },
      ].map((w, i) => (
        <div
          key={i}
          className="absolute w-full"
          style={{
            top: w.top,
            height: "2px",
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${w.opacity}) 20%, rgba(255,255,255,${w.opacity * 1.3}) 50%, rgba(255,255,255,${w.opacity}) 80%, transparent 100%)`,
            animation: `waveMove ${w.dur} ease-in-out infinite${i % 2 === 0 ? " reverse" : ""}`,
            animationDelay: w.delay,
          }}
        />
      ))}

      {/* Water shimmer pools */}
      <div
        className="absolute rounded-full animate-shimmer"
        style={{
          top: "38%",
          left: "8%",
          width: "280px",
          height: "160px",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full animate-shimmer-alt"
        style={{
          top: "55%",
          right: "10%",
          width: "360px",
          height: "200px",
          background:
            "radial-gradient(ellipse, rgba(0,180,216,0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute rounded-full animate-shimmer"
        style={{
          top: "70%",
          left: "40%",
          width: "320px",
          height: "180px",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%)",
          animationDelay: "6s",
        }}
      />

      {/* Nautical route SVG line */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.06 }}
        preserveAspectRatio="none"
      >
        <path
          d="M -5% 36% Q 25% 33% 55% 38% Q 75% 42% 105% 36%"
          fill="none"
          stroke="rgba(201,168,76,1)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
        />
      </svg>
    </div>
  );
}

// ── Fixed Nav ──
function Nav({ scrollY }: { scrollY: number }) {
  const [open, setOpen] = useState(false);
  const opaque = scrollY > 60;

  const links = [
    { label: "About",      href: "#about" },
    { label: "Education",  href: "#education" },
    { label: "Experience", href: "#experience" },
    { label: "Leadership", href: "#leadership" },
    { label: "Skills",     href: "#skills" },
    { label: "Contact",    href: "#contact" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: opaque
          ? "rgba(4,13,26,0.85)"
          : "transparent",
        backdropFilter: opaque ? "blur(16px)" : "none",
        borderBottom: opaque ? "1px solid rgba(144,224,239,0.1)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#about"
          className="flex items-center gap-2.5 text-white font-bold text-lg tracking-wide"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #e8c96a)",
              color: "#040d1a",
            }}
          >
            BN
          </div>
          <span style={{ color: "#e2e8f0", letterSpacing: "0.05em" }}>
            Brandon<span style={{ color: "#c9a84c" }}>.</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "rgba(226,232,240,0.7)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "#c9a84c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(226,232,240,0.7)")
              }
            >
              {l.label}
            </a>
          ))}
          <a href="mailto:B.nguyen@yale.edu" className="btn-ocean text-sm">
            Contact
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
          aria-label="menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="md:hidden px-6 pb-5 flex flex-col gap-4"
          style={{ background: "rgba(4,13,26,0.95)", backdropFilter: "blur(16px)" }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm"
              style={{ color: "rgba(226,232,240,0.8)" }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Section header ──
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-12">
      <div className="w-8 h-0.5" style={{ background: "#c9a84c" }} />
      <h2
        className="text-xs font-bold uppercase tracking-[0.25em]"
        style={{ color: "#c9a84c" }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px" style={{ background: "rgba(144,224,239,0.15)" }} />
    </div>
  );
}

// ── Badge ──
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-xs font-medium px-2.5 py-1 rounded-full"
      style={{
        background: "rgba(0,180,216,0.12)",
        border: "1px solid rgba(0,180,216,0.25)",
        color: "#90e0ef",
      }}
    >
      {children}
    </span>
  );
}

// ── Bullet point ──
function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed" style={{ color: "rgba(203,213,225,0.85)" }}>
      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#c9a84c" }} />
      {children}
    </li>
  );
}

// ═══════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════
export default function Home() {
  const boatRef   = useRef<HTMLDivElement>(null);
  const heroRef   = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [boatDir, setBoatDir] = useState<1 | -1>(1);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const boat = boatRef.current;
    if (!boat) return;

    // Boat journey across the page
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
    });

    tl.to(boat, { x: "78vw", duration: 3, ease: "none",
        onUpdate() { setBoatDir(1); } })
      .to(boat, { x: "5vw",  duration: 2.5, ease: "none",
        onUpdate() { setBoatDir(-1); } })
      .to(boat, { x: "85vw", duration: 3, ease: "none",
        onUpdate() { setBoatDir(1); } })
      .to(boat, { x: "30vw", duration: 2, ease: "none",
        onUpdate() { setBoatDir(-1); } });

    // Subtle Y drift for realism
    gsap.to(boat, {
      y: "+=6",
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Section reveal on scroll
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => el.classList.add("visible"),
      });
    });

    // Scroll Y tracker
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="relative" style={{ color: "#e2e8f0" }}>
      {/* ── Fixed ocean background ── */}
      <OceanBackground />

      {/* ── Fixed boat layer ── */}
      <div
        className="fixed z-10 pointer-events-none"
        style={{ top: "32%", left: "2vw", width: "180px" }}
      >
        <div ref={boatRef} className="relative animate-boat-bob">
          <BoatSVG dir={boatDir} />
          {/* Foam wake ring under boat */}
          <div
            className="absolute rounded-full"
            style={{
              width: "200px",
              height: "28px",
              bottom: "-8px",
              left: "-12px",
              background:
                "radial-gradient(ellipse, rgba(255,255,255,0.14) 0%, transparent 70%)",
              filter: "blur(4px)",
            }}
          />
        </div>
      </div>

      {/* ── Scroll content ── */}
      <div className="relative" style={{ zIndex: 5 }}>

        {/* ══════════════════════════════
            HERO
        ══════════════════════════════ */}
        <Nav scrollY={scrollY} />

        <section
          id="about"
          ref={heroRef}
          className="relative min-h-screen flex items-center"
          style={{ paddingTop: "80px" }}
        >
          {/* Island decoration */}
          <div
            className="absolute right-8 bottom-16 opacity-60 hidden lg:block animate-float"
            style={{ width: "160px", animationDelay: "1s" }}
          >
            <IslandAbout />
          </div>

          <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
            {/* Text */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-px flex-shrink-0"
                  style={{ width: "32px", background: "#c9a84c" }}
                />
                <span
                  className="text-xs font-semibold uppercase tracking-[0.22em]"
                  style={{ color: "#c9a84c" }}
                >
                  Yale University · Class of 2029
                </span>
              </div>

              <h1
                className="font-bold leading-tight mb-6"
                style={{
                  fontSize: "clamp(3rem,6vw,5.5rem)",
                  color: "#f8fafc",
                  textShadow: "0 4px 24px rgba(0,0,0,0.5)",
                }}
              >
                Brandon
                <br />
                <span style={{ color: "#c9a84c" }}>Luu Nguyen</span>
              </h1>

              <p
                className="text-lg leading-relaxed mb-8 max-w-xl"
                style={{ color: "rgba(203,213,225,0.85)" }}
              >
                Investor, researcher, and founder — navigating the intersection of
                economics, science, and community impact. Valedictorian turned Yale
                analyst, driven by precision and purpose.
              </p>

              {/* Contact chips */}
              <div className="flex flex-wrap gap-3 mb-10 text-sm" style={{ color: "rgba(203,213,225,0.7)" }}>
                {[
                  { icon: "📍", text: "Tacoma, WA" },
                  { icon: "✉️", text: "B.nguyen@yale.edu" },
                  { icon: "📱", text: "(253) 240-5196" },
                ].map((c) => (
                  <span
                    key={c.text}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span>{c.icon}</span>
                    {c.text}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.linkedin.com/in/brandon-nguyen-246tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ocean flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="#education"
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300"
                  style={{
                    border: "1px solid rgba(144,224,239,0.3)",
                    color: "#90e0ef",
                    background: "rgba(0,180,216,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(0,180,216,0.15)";
                    e.currentTarget.style.borderColor = "rgba(144,224,239,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,180,216,0.06)";
                    e.currentTarget.style.borderColor = "rgba(144,224,239,0.3)";
                  }}
                >
                  Explore Journey ↓
                </a>
              </div>
            </div>

            {/* Photo + stats */}
            <div className="flex flex-col items-center gap-6">
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  width: "280px",
                  height: "340px",
                  border: "1px solid rgba(144,224,239,0.2)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
                }}
              >
                <Image
                  src="/profile.jpg"
                  alt="Brandon Luu Nguyen"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="280px"
                />
                {/* Glass overlay at bottom */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(4,13,26,0.9) 0%, transparent 100%)",
                  }}
                >
                  <p className="text-sm font-semibold text-white">Brandon Luu Nguyen</p>
                  <p className="text-xs" style={{ color: "#c9a84c" }}>
                    Yale · Economics &amp; Chemistry
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {[
                  { v: "3.93", l: "Yale GPA" },
                  { v: "#1", l: "Valedictorian" },
                  { v: "4.00", l: "TCC GPA" },
                  { v: "$20K", l: "Milton Fisher" },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="glass-card rounded-xl p-3 text-center wave-hover"
                  >
                    <div
                      className="text-2xl font-black"
                      style={{ color: "#c9a84c" }}
                    >
                      {s.v}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(203,213,225,0.7)" }}>
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float"
            style={{ color: "rgba(144,224,239,0.5)" }}
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div
              className="w-px h-10 rounded-full"
              style={{ background: "linear-gradient(180deg, rgba(144,224,239,0.5), transparent)" }}
            />
          </div>
        </section>

        {/* ══════════════════════════════
            EDUCATION
        ══════════════════════════════ */}
        <section id="education" className="relative py-32">
          <div
            className="absolute right-4 top-8 opacity-50 hidden lg:block animate-float"
            style={{ width: "180px", animationDelay: "0.5s" }}
          >
            <IslandEducation />
          </div>

          <div className="max-w-4xl mx-auto px-6 reveal">
            <SectionTitle>Education</SectionTitle>

            <div className="flex flex-col gap-5">
              {[
                {
                  school: "Yale University",
                  loc: "New Haven, CT",
                  degree: "BA Economics, BS Chemistry",
                  gpa: "3.93 / 4.00",
                  date: "Expected May 2029",
                  badges: ["UP Fund Investing", "Spkyman Foreign Policy Fellow", "Yale Small Claims", "Yale Real Estate Club"],
                  highlight: true,
                },
                {
                  school: "Tacoma Community College",
                  loc: "Tacoma, WA",
                  degree: "Associates of Arts — Biology",
                  gpa: "4.00 / 4.00",
                  date: "May 2025",
                  badges: ["Dean's List 2023–25", "Student Senator", "Founder, Weightlifting Club"],
                  highlight: false,
                },
                {
                  school: "Curtis Senior High School",
                  loc: "University Place, WA",
                  degree: "Valedictorian — Ranked 1 of 460",
                  gpa: "4.00 / 4.00",
                  date: "May 2025",
                  badges: [],
                  highlight: false,
                },
              ].map((e) => (
                <div
                  key={e.school}
                  className="glass-card rounded-2xl p-6 wave-hover"
                  style={
                    e.highlight
                      ? { borderColor: "rgba(201,168,76,0.35)" }
                      : {}
                  }
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: e.highlight ? "#c9a84c" : "#f1f5f9" }}
                      >
                        {e.school}
                      </h3>
                      <p className="text-sm" style={{ color: "#90e0ef" }}>
                        {e.loc}
                      </p>
                    </div>
                    <span className="text-xs whitespace-nowrap mt-1" style={{ color: "rgba(203,213,225,0.5)" }}>
                      {e.date}
                    </span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: "rgba(203,213,225,0.8)" }}>
                    {e.degree} —{" "}
                    <span className="font-semibold" style={{ color: "#e2e8f0" }}>
                      GPA {e.gpa}
                    </span>
                  </p>
                  {e.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {e.badges.map((b) => (
                        <Badge key={b}>{b}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            WORK EXPERIENCE
        ══════════════════════════════ */}
        <section id="experience" className="relative py-32">
          <div
            className="absolute left-4 top-12 opacity-45 hidden lg:block animate-float"
            style={{ width: "200px", animationDelay: "2s" }}
          >
            <IslandExperience />
          </div>

          <div className="max-w-4xl mx-auto px-6 reveal">
            <SectionTitle>Work Experience</SectionTitle>

            <div className="flex flex-col gap-5">
              <div className="glass-card rounded-2xl p-6 wave-hover" style={{ borderColor: "rgba(201,168,76,0.3)" }}>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-1">
                  <h3 className="text-lg font-bold" style={{ color: "#c9a84c" }}>
                    Nordic Partners Investments
                  </h3>
                  <span className="text-xs" style={{ color: "rgba(203,213,225,0.5)" }}>
                    May – July 2026
                  </span>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: "#90e0ef" }}>
                  Incoming Syndication Asset Management Intern · Seattle, WA
                </p>
                <ul className="mt-3 space-y-2">
                  <Bullet>Underwrote value-add multifamily acquisitions, modeling debt structures, DSCR, exit cap scenarios, and GP fee structures on deals up to $20M.</Bullet>
                  <Bullet>Ran acquisition pricing scenarios and rent comp analyses across the Seattle submarket, validating ROI assumptions against light-renovation value-add theses.</Bullet>
                  <Bullet>Built an AI-enabled tool that parses property financials, generates 30/60/90-day action plans, and stores data for performance visualization.</Bullet>
                </ul>
              </div>

              <div className="glass-card rounded-2xl p-6 wave-hover">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 mb-1">
                  <h3 className="text-lg font-bold" style={{ color: "#f1f5f9" }}>
                    P. Fluorescence Genome Research
                  </h3>
                  <span className="text-xs" style={{ color: "rgba(203,213,225,0.5)" }}>
                    Jan – May 2025
                  </span>
                </div>
                <p className="text-sm font-medium mb-1" style={{ color: "#90e0ef" }}>
                  Research Assistant · Tacoma, WA
                </p>
                <ul className="mt-3 space-y-2">
                  <Bullet>Leveraged CRISPR to investigate P. Fluorescence, identifying DNA sequences that suppress a wheat-killing fungus.</Bullet>
                  <Bullet>Identified genes increasing production of the DAPG suppressant, contributing to crop protection research.</Bullet>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            LEADERSHIP
        ══════════════════════════════ */}
        <section id="leadership" className="relative py-32">
          <div
            className="absolute right-6 top-16 opacity-45 hidden lg:block animate-float"
            style={{ width: "180px", animationDelay: "1.5s" }}
          >
            <IslandLeadership />
          </div>

          <div className="max-w-5xl mx-auto px-6 reveal">
            <SectionTitle>Leadership &amp; Community</SectionTitle>

            <div className="grid md:grid-cols-2 gap-5">
              {[
                {
                  org: "Urban Philanthropic Fund",
                  role: "Analyst",
                  loc: "New Haven, CT",
                  dates: "Sept 2025 – Present",
                  bullets: [
                    "Conducted valuations of UnitedHealth Group (UNH) to support investment decisions.",
                    "Built DCF and Comparable Analysis models to assess market opportunities.",
                    "Redistributed returns as grants to the New Haven community.",
                  ],
                },
                {
                  org: "Urban Philanthropic Consulting",
                  role: "Head of Consulting",
                  loc: "New Haven, CT",
                  dates: "Sept 2025 – Present",
                  bullets: [
                    "Led creation of a financial model projecting future cash flow for decision-making.",
                    "Identified 20% revenue growth opportunities through marketing & cost optimization.",
                    "Presented to business executives; appointed to follow through in FY 2026.",
                  ],
                },
                {
                  org: "Yale Small Claims Assistance",
                  role: "Treasurer",
                  loc: "New Haven, CT",
                  dates: "Dec 2025 – Present",
                  bullets: [
                    "Aided CT residents with claims assistance, reducing legal information asymmetry.",
                    "Mastered Connecticut small claims law and procedures.",
                  ],
                },
                {
                  org: "Math Masters",
                  role: "Founder & President",
                  loc: "University Place, WA",
                  dates: "Aug 2023 – 2025",
                  bullets: [
                    "Founded a gamified algebra course and led a 12-person team.",
                    "Engaged 500+ students across 4 high schools and 1 community college.",
                    "Awarded $20,000 Milton Fisher Scholarship for Innovation.",
                  ],
                },
              ].map((item) => (
                <div key={item.org} className="glass-card rounded-2xl p-5 wave-hover flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-base" style={{ color: "#f1f5f9" }}>
                      {item.org}
                    </h3>
                    <span className="text-xs flex-shrink-0" style={{ color: "rgba(203,213,225,0.45)" }}>
                      {item.dates}
                    </span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: "#90e0ef" }}>
                    {item.role} · {item.loc}
                  </p>
                  <ul className="space-y-1.5 flex-1">
                    {item.bullets.map((b) => (
                      <Bullet key={b}>{b}</Bullet>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            SKILLS
        ══════════════════════════════ */}
        <section id="skills" className="relative py-32">
          <div className="max-w-4xl mx-auto px-6 reveal">
            <SectionTitle>Skills &amp; Interests</SectionTitle>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(144,224,239,0.6)" }}>
                  Core Skills
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "Advanced Excel",
                    "Financial Modeling",
                    "DCF Analysis",
                    "Comparable Analysis",
                    "Data Analysis",
                    "Risk Assessment",
                    "Financial Reporting",
                    "Client Relationship Management",
                    "Market Research",
                    "CRISPR / Genomics",
                    "AI Tool Development",
                    "Real Estate Underwriting",
                  ].map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-default"
                      style={{
                        background: "rgba(13,27,42,0.8)",
                        border: "1px solid rgba(144,224,239,0.18)",
                        color: "#cbd5e1",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)";
                        e.currentTarget.style.color = "#c9a84c";
                        e.currentTarget.style.background = "rgba(201,168,76,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(144,224,239,0.18)";
                        e.currentTarget.style.color = "#cbd5e1";
                        e.currentTarget.style.background = "rgba(13,27,42,0.8)";
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(144,224,239,0.6)" }}>
                  Societies &amp; Memberships
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { name: "The Horological Society of New York", icon: "⌚" },
                    { name: "UP Fund Investing and Consulting", icon: "📈" },
                    { name: "Yale Real Estate Club", icon: "🏛" },
                    { name: "Spkyman Foreign Policy Fellowship", icon: "🌐" },
                  ].map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                      style={{
                        background: "rgba(13,27,42,0.6)",
                        border: "1px solid rgba(144,224,239,0.15)",
                      }}
                    >
                      <span className="text-lg">{s.icon}</span>
                      <span className="text-sm" style={{ color: "#cbd5e1" }}>
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            CONTACT
        ══════════════════════════════ */}
        <section id="contact" className="relative py-32 pb-48">
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-12 opacity-50 hidden lg:block animate-float"
            style={{ width: "200px", animationDelay: "0.8s" }}
          >
            <IslandContact />
          </div>

          <div className="max-w-2xl mx-auto px-6 reveal">
            <SectionTitle>Contact</SectionTitle>

            <div className="glass-card rounded-3xl p-8 text-center mb-8">
              <h2
                className="text-3xl font-bold mb-3"
                style={{ color: "#f1f5f9" }}
              >
                Let&rsquo;s Connect
              </h2>
              <p className="mb-8" style={{ color: "rgba(203,213,225,0.7)" }}>
                Open to investment opportunities, research collaborations, and
                interesting conversations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:B.nguyen@yale.edu"
                  className="btn-ocean flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Email
                </a>
                <a
                  href="https://www.linkedin.com/in/brandon-nguyen-246tr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold"
                  style={{
                    border: "1px solid rgba(144,224,239,0.3)",
                    color: "#90e0ef",
                    background: "rgba(0,180,216,0.06)",
                  }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Contact info tiles */}
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              {[
                { label: "Email", value: "B.nguyen@yale.edu", href: "mailto:B.nguyen@yale.edu" },
                { label: "Phone", value: "(253) 240-5196", href: "tel:2532405196" },
                { label: "Location", value: "Tacoma, WA", href: "#" },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="glass-light rounded-xl py-3 px-2"
                  style={{ color: "rgba(203,213,225,0.7)" }}
                >
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "rgba(144,224,239,0.5)" }}>
                    {c.label}
                  </div>
                  <div className="text-xs font-medium truncate">{c.value}</div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="relative z-10 py-8 text-center text-xs"
          style={{
            color: "rgba(203,213,225,0.35)",
            borderTop: "1px solid rgba(144,224,239,0.08)",
            background: "rgba(2,11,22,0.6)",
          }}
        >
          &copy; 2026 Brandon Luu Nguyen. Navigating ambition, one wave at a time.
        </footer>
      </div>
    </div>
  );
}

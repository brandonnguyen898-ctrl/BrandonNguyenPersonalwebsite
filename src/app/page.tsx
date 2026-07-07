"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import OceanNav from "@/components/OceanNav";

// ── Hero ocean scene ─────────────────────────────────────────────────

// Deterministic grid points for water depth variation
const DEPTH_MARKS = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 83 + 17) % 100,
  y: (i * 47 + 31) % 100,
  s: ((i * 19) % 3) + 1,
  o: ((i * 13) % 4) / 10 + 0.03,
}));

// Hero boat — larger, side-profile cinematic silhouette
function HeroBoat() {
  return (
    <svg viewBox="0 0 240 72" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Water reflection */}
      <ellipse cx="120" cy="64" rx="100" ry="6" fill="rgba(196,164,96,0.04)" />
      {/* Hull shadow */}
      <ellipse cx="120" cy="58" rx="96" ry="10" fill="rgba(0,0,0,0.5)" />
      {/* Main hull */}
      <path
        d="M8,36 C18,18 50,8 120,6 C190,8 222,18 234,36 C222,54 190,64 120,64 C50,64 18,54 8,36 Z"
        fill="#0D1318"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.8"
      />
      {/* Deck */}
      <path
        d="M20,36 C32,22 60,14 120,12 C180,14 208,22 220,36 C208,50 180,58 120,58 C60,58 32,50 20,36 Z"
        fill="#131B26"
      />
      {/* Gold stripe — waterline */}
      <path
        d="M20,33 C32,20 60,13 120,11 C180,13 208,20 220,33"
        stroke="rgba(196,164,96,0.45)"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M20,39 C32,52 60,59 120,61 C180,59 208,52 220,39"
        stroke="rgba(196,164,96,0.45)"
        strokeWidth="0.8"
        fill="none"
      />
      {/* Superstructure / cabin block */}
      <rect x="88" y="16" width="60" height="28" rx="3" fill="#0A111A" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
      {/* Windshield */}
      <path d="M92,20 L142,20 L146,28 L88,28 Z" fill="rgba(94,122,150,0.15)" />
      {/* Nav light — bow */}
      <circle cx="10" cy="36" r="3" fill="rgba(196,164,96,0.35)" />
      <circle cx="10" cy="36" r="1.5" fill="rgba(196,164,96,0.7)" />
      {/* Stern engine block */}
      <rect x="228" y="29" width="10" height="14" rx="2" fill="#0A111A" stroke="rgba(255,255,255,0.06)" strokeWidth="0.4" />
      {/* Wake lines */}
      <path d="M234,31 C244,30 256,31 268,30" stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeDasharray="5 4" fill="none" />
      <path d="M234,41 C244,42 256,41 268,42" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7" strokeDasharray="4 5" fill="none" />
      <path d="M234,36 C248,36 260,36.5 272,36" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="3 6" fill="none" />
    </svg>
  );
}

// Island silhouettes — architectural, not tropical
function IslandSilhouette({ type }: { type: "city" | "grid" | "beacon" }) {
  if (type === "city") return (
    <svg viewBox="0 0 120 60" fill="none" style={{ width: "100%", height: "100%" }}>
      <rect x="10" y="30" width="14" height="30" fill="rgba(255,255,255,0.06)" />
      <rect x="28" y="18" width="18" height="42" fill="rgba(255,255,255,0.07)" />
      <rect x="50" y="8"  width="22" height="52" fill="rgba(255,255,255,0.08)" />
      <rect x="76" y="22" width="16" height="38" fill="rgba(255,255,255,0.06)" />
      <rect x="96" y="34" width="12" height="26" fill="rgba(255,255,255,0.05)" />
      {/* Windows */}
      <rect x="53" y="14" width="3" height="3" fill="rgba(196,164,96,0.12)" />
      <rect x="60" y="14" width="3" height="3" fill="rgba(196,164,96,0.08)" />
      <rect x="53" y="22" width="3" height="3" fill="rgba(196,164,96,0.14)" />
      <rect x="60" y="22" width="3" height="3" fill="rgba(196,164,96,0.06)" />
      {/* Base / water line */}
      <rect x="0" y="59" width="120" height="1" fill="rgba(255,255,255,0.04)" />
    </svg>
  );

  if (type === "grid") return (
    <svg viewBox="0 0 100 50" fill="none" style={{ width: "100%", height: "100%" }}>
      {/* Abstract data/finance structure */}
      <line x1="10" y1="40" x2="90" y2="40" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      <line x1="10" y1="25" x2="90" y2="25" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      <path d="M10,40 L22,28 L34,33 L46,18 L58,24 L70,10 L82,20 L90,14" stroke="rgba(196,164,96,0.2)" strokeWidth="0.8" fill="none" />
      <circle cx="70" cy="10" r="2" fill="rgba(196,164,96,0.25)" />
      {[10,22,34,46,58,70,82,90].map((x,i)=> (
        <circle key={i} cx={x} cy={[40,28,33,18,24,10,20,14][i]} r="1.5" fill="rgba(255,255,255,0.1)" />
      ))}
    </svg>
  );

  // beacon
  return (
    <svg viewBox="0 0 60 80" fill="none" style={{ width: "100%", height: "100%" }}>
      <line x1="30" y1="10" x2="30" y2="70" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="30" cy="10" r="5" fill="rgba(196,164,96,0.15)" stroke="rgba(196,164,96,0.3)" strokeWidth="0.5" />
      <circle cx="30" cy="10" r="2" fill="rgba(196,164,96,0.5)" />
      <path d="M10,70 L50,70" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <path d="M18,70 L22,50 L38,50 L42,70" fill="rgba(255,255,255,0.04)" />
    </svg>
  );
}

// ── Case study data ──────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "dashboard",
    title: "Seattle Student Housing AM Dashboard",
    category: "Asset Management",
    status: "Confidential",
    file: "/projects/seattle-housing-dashboard.pdf",
    summary: "Two co-managed Seattle multifamily properties lacked unified dashboards to track operating KPIs and identify performance leakage.",
    bullets: [
      "Built KPI bridges from current to signed-lease to stabilized 95% occupancy for 111 combined units",
      "Identified $20.6K in annual RUBs utility leakage through GL reconciliation and billing analysis",
      "Delivered 30/60/90-day implementation tracker across 8 operational categories",
    ],
    metrics: [
      { v: "111",   l: "Units"          },
      { v: "~49%",  l: "Exp. Ratio"     },
      { v: "$20.6K",l: "RUBs Leakage"  },
    ],
    tags: ["Asset Management","NOI Analysis","Excel","RUBs","Expense Benchmarking"],
  },
  {
    id: "munson",
    title: "110 Munson St. — New Haven Development Pitch",
    category: "Development Underwriting",
    status: "Public",
    file: "/projects/110-munson-st.pdf",
    summary: "2.04-acre RH-2 infill site in New Haven, CT priced at $2M. Evaluated mixed-use development feasibility and produced a full investment memo.",
    bullets: [
      "Analyzed zoning by right and designed 185-unit mixed-use program (studios, 1BR, 2BR + 15% NNN commercial)",
      "Pro forma reached 7.52% yield on cost with 2.02% development spread over 5.50% exit cap",
      "Modeled ~$18.8M projected sale profit after stabilization",
    ],
    metrics: [
      { v: "7.52%",  l: "YOC"           },
      { v: "$18.8M", l: "Proj. Profit"  },
      { v: "185",    l: "Units"         },
    ],
    tags: ["Development Underwriting","Zoning Analysis","Pro Forma","Yield on Cost","Rent Comps"],
  },
  {
    id: "wesco",
    title: "WESCO International — Public Equity Thesis",
    category: "Equity Research",
    status: "Public",
    file: "/projects/wesco-thesis.pdf",
    summary: "WESCO (WCC) traded at a discount to industrial distribution peers. Evaluated thesis against three structural tailwinds and the Ascent acquisition.",
    bullets: [
      "Issued BUY — thesis anchored to AI/data center buildout, electrification, and infrastructure spending",
      "Segmentation analysis across EES, Communications & Security, and Utility & Broadband",
      "P/E discount to peers identified as mispricing driven by Ascent integration overhang",
    ],
    metrics: [
      { v: "BUY",  l: "Rating"         },
      { v: "3",    l: "Segments"       },
      { v: "P/E↓", l: "vs. Peers"     },
    ],
    tags: ["Equity Research","DCF","Comparable Analysis","Catalyst Framework","Industry Structure"],
  },
  {
    id: "annex",
    title: "New Haven Annex Club — Revenue Strategy",
    category: "Consulting",
    status: "Public",
    file: "/projects/annex-club-strategy.pdf",
    summary: "Club over-reliant on rental revenue (~65% of total), with stagnating membership and rising costs. Engagement produced a restructuring roadmap.",
    bullets: [
      "Diagnosed rental revenue concentration and proposed diversification to 30–50% membership-driven mix",
      "Recommended agent network expansion, digital launch, community programming, and guest-pass program",
      "2026 implementation roadmap approved by club executives",
    ],
    metrics: [
      { v: "~65%",   l: "Rental Dep."  },
      { v: "+20%",   l: "Rev. Target"  },
      { v: "FY2026", l: "Roadmap"      },
    ],
    tags: ["Consulting","Revenue Analysis","Marketing Strategy","Nonprofit","Implementation"],
  },
  {
    id: "legal",
    title: "Legal Aid Society — Homeless Rights Project",
    category: "Legal Advocacy",
    status: "Public",
    file: "/projects/legal-aid.pdf",
    summary: "Worked directly with homeless clients in NYC navigating shelter access, housing eligibility, and public benefits systems.",
    bullets: [
      "Supported 5+ clients through housing navigation and case documentation",
      "Researched NYC shelter policy, housing eligibility, and public benefits law",
      "Drafted advocacy letters to housing providers, shelters, and city agencies",
    ],
    metrics: null,
    tags: ["Legal Advocacy","Housing Navigation","Case Documentation","Policy Research"],
  },
  {
    id: "math",
    title: "Math Masters — Founder",
    category: "EdTech / Social Impact",
    status: "Public",
    file: "/projects/math-masters.pdf",
    summary: "Founded a gamified Algebra I platform in Pierce County to improve engagement and outcomes for high school students.",
    bullets: [
      "Built curriculum, recruited 12-person team, scaled to 500+ students across 5 schools",
      "Networked programming into 4 high schools and 1 community college",
      "Awarded $20,000 Milton Fisher Scholarship for Innovation",
    ],
    metrics: [
      { v: "500+", l: "Students"       },
      { v: "$20K", l: "Milton Fisher"  },
      { v: "5",    l: "Schools"        },
    ],
    tags: ["Founder","Curriculum Design","Team Leadership","Outreach","EdTech"],
  },
];

// ── Experience ───────────────────────────────────────────────────────
const EXPERIENCE = [
  {
    org:    "Nordic Partners Investments",
    role:   "Syndication Asset Management Intern",
    loc:    "Seattle, WA",
    date:   "May – July 2026",
    bullets: [
      "Underwrote value-add multifamily acquisitions — debt structuring, DSCR, exit cap scenarios, GP fee structures on deals up to $20M.",
      "Built an AI-enabled tool parsing property financials into 30/60/90-day action plans and performance dashboards.",
      "Developed Seattle Student Housing AM Dashboard for two co-managed properties, identifying $20.6K in annual RUBs leakage.",
    ],
  },
  {
    org:    "Urban Philanthropic Fund",
    role:   "Analyst",
    loc:    "New Haven, CT",
    date:   "Sept 2025 – Present",
    bullets: [
      "Equity valuations including UNH — DCF and comparable analysis models for the investment committee.",
      "Researched public company fundamentals and sector dynamics across the portfolio.",
      "Returns redistributed as grants to New Haven — financial performance tied to community benefit.",
    ],
  },
  {
    org:    "Urban Philanthropic Consulting",
    role:   "Head of Consulting",
    loc:    "New Haven, CT",
    date:   "Sept 2025 – Present",
    bullets: [
      "Led New Haven Annex Club engagement: revenue analysis, cost benchmarking, marketing strategy, and FY2026 roadmap presentation.",
      "Financial model identified 20% revenue growth opportunity through membership and programming diversification.",
    ],
  },
  {
    org:    "Legal Aid Society — Homeless Rights Project",
    role:   "Legal Advocacy Intern",
    loc:    "New York, NY",
    date:   "2025 – 2026",
    bullets: [
      "Supported 5+ clients through housing navigation, advocacy letters, and case documentation in NYC's shelter system.",
      "Researched shelter access law, housing eligibility, and public benefits policy alongside supervising attorneys.",
    ],
  },
  {
    org:    "Yale Small Claims Assistance",
    role:   "Treasurer",
    loc:    "New Haven, CT",
    date:   "Dec 2025 – Present",
    bullets: [
      "Aid Connecticut residents navigating small claims court — reducing information asymmetry for unrepresented litigants.",
      "Manage organizational finances and coordinate member resources for client intake.",
    ],
  },
  {
    org:    "Math Masters",
    role:   "Founder & President",
    loc:    "University Place, WA",
    date:   "Aug 2023 – 2025",
    bullets: [
      "Founded gamified Algebra I platform — 12-person team, 500+ students, 5 schools across Pierce County.",
      "Awarded $20,000 Milton Fisher Scholarship for Innovation.",
    ],
  },
  {
    org:    "P. Fluorescens Genome Research",
    role:   "Research Assistant",
    loc:    "Tacoma, WA",
    date:   "Jan – May 2025",
    bullets: [
      "CRISPR-based investigation of Pseudomonas fluorescens — identified DNA sequences suppressing a wheat fungal pathogen.",
      "Gene-level analysis targeting DAPG suppressant production for biological crop protection.",
    ],
  },
];

// ── Skills ───────────────────────────────────────────────────────────
const SKILLS = [
  {
    title: "Finance",
    items: ["Financial Modeling","DCF Analysis","Comparable Analysis","Public Equity Research","DSCR Modeling","GP Fee Structures","Cap Rate Analysis","Valuation","Risk Assessment"],
  },
  {
    title: "Real Estate",
    items: ["Multifamily Underwriting","Value-Add Strategy","Asset Management","Development Pro Formas","Zoning Analysis","Unit Mix Optimization","RUBs Analysis","Expense Benchmarking","Rent Comps","Stabilization Modeling"],
  },
  {
    title: "Technical",
    items: ["Advanced Excel","Dashboard Design","KPI Tracking","GL Reconciliation","Data Analysis","AI-Enabled Tooling","Financial Reporting","Process Documentation"],
  },
  {
    title: "Legal & Advocacy",
    items: ["Housing Navigation","Advocacy Writing","Case Documentation","Small Claims Law","Public Benefits Research","Legal Research"],
  },
  {
    title: "Consulting & Strategy",
    items: ["Revenue Analysis","Cost Benchmarking","Market Research","Implementation Planning","Marketing Strategy","Executive Presentations"],
  },
];

// ── Page ─────────────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const [heroScroll, setHeroScroll] = useState(0);

  // Parallax for hero boat
  useEffect(() => {
    function onScroll() {
      if (!heroRef.current) return;
      const h = heroRef.current.offsetHeight;
      const pct = Math.min(window.scrollY / h, 1);
      setHeroScroll(pct);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal animation
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } }),
      { threshold: 0.07 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <OceanNav />

      {/* ═══ HERO ═══════════════════════════════════════════════════ */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position:    "relative",
          minHeight:   "100vh",
          display:     "flex",
          alignItems:  "center",
          overflow:    "hidden",
          paddingTop:  "52px",
        }}
      >
        {/* Ocean background */}
        <div
          style={{
            position: "absolute",
            inset:    0,
            background: "radial-gradient(ellipse 120% 60% at 50% 80%, #0A1624 0%, #060810 50%, var(--bg) 100%)",
          }}
        />

        {/* Map grid overlay */}
        <div
          style={{
            position:   "absolute",
            inset:      0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            animation: "fadeDepth 12s ease-in-out infinite",
          }}
        />

        {/* Depth marks */}
        {DEPTH_MARKS.map((d, i) => (
          <div
            key={i}
            style={{
              position:     "absolute",
              left:         `${d.x}%`,
              top:          `${d.y}%`,
              width:        `${d.s}px`,
              height:       `${d.s}px`,
              borderRadius: "50%",
              background:   "rgba(255,255,255,1)",
              opacity:      d.o,
            }}
          />
        ))}

        {/* Island silhouettes */}
        <div
          style={{
            position:  "absolute",
            right:     "3%",
            bottom:    "12%",
            width:     "160px",
            opacity:   Math.max(0, 0.35 - heroScroll * 0.6),
            transform: `translateX(${heroScroll * 40}px)`,
            transition: "opacity 0.1s, transform 0.1s",
          }}
        >
          <IslandSilhouette type="city" />
        </div>
        <div
          style={{
            position:  "absolute",
            right:     "18%",
            bottom:    "18%",
            width:     "90px",
            opacity:   Math.max(0, 0.2 - heroScroll * 0.5),
          }}
        >
          <IslandSilhouette type="beacon" />
        </div>

        {/* Hero boat — parallax right side */}
        <div
          style={{
            position:  "absolute",
            right:     `calc(8% - ${heroScroll * 80}px)`,
            top:       "50%",
            transform: `translateY(-50%) translateY(${heroScroll * -30}px)`,
            width:     "clamp(240px, 32vw, 420px)",
            opacity:   Math.max(0, 1 - heroScroll * 2.2),
            animation: "boatIdle 5s ease-in-out infinite",
            transition: "opacity 0.05s",
          }}
        >
          <HeroBoat />
        </div>

        {/* Fog gradient — right side */}
        <div
          style={{
            position:   "absolute",
            right:      0,
            top:        0,
            bottom:     0,
            width:      "40%",
            background: "linear-gradient(270deg, rgba(8,8,9,0.55) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            position:  "relative",
            zIndex:    2,
            maxWidth:  "1200px",
            margin:    "0 auto",
            padding:   "80px 40px",
            width:     "100%",
          }}
        >
          <div style={{ maxWidth: "560px" }}>
            {/* Eyebrow */}
            <div
              style={{
                display:       "flex",
                alignItems:    "center",
                gap:           "10px",
                marginBottom:  "2rem",
              }}
            >
              <div style={{ width: "18px", height: "1px", background: "var(--gold)" }} />
              <span
                style={{
                  fontSize:      "0.6875rem",
                  fontWeight:    600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color:         "var(--gold)",
                }}
              >
                Yale University · Class of 2029
              </span>
            </div>

            {/* Name */}
            <h1
              style={{
                fontFamily:    "var(--font-serif)",
                fontSize:      "clamp(2.6rem, 5.5vw, 4.8rem)",
                fontWeight:    400,
                lineHeight:    1.05,
                letterSpacing: "-0.01em",
                color:         "var(--text-1)",
                marginBottom:  "1.25rem",
              }}
            >
              Brandon Luu Nguyen
            </h1>

            {/* Positioning */}
            <p
              style={{
                fontSize:     "1.0625rem",
                fontWeight:   400,
                color:        "var(--text-2)",
                marginBottom: "0.75rem",
                lineHeight:   1.6,
              }}
            >
              Yale student focused on real estate, investing, and operating systems.
            </p>
            <p
              style={{
                fontSize:     "0.9rem",
                color:        "var(--text-3)",
                lineHeight:   1.7,
                marginBottom: "2.5rem",
                maxWidth:     "480px",
              }}
            >
              I underwrite multifamily acquisitions, build asset management tools,
              research public equities, and work on housing access.
            </p>

            {/* Meta chips */}
            <div
              style={{
                display:       "flex",
                flexWrap:      "wrap",
                gap:           "8px",
                marginBottom:  "2.5rem",
              }}
            >
              {["Tacoma, WA", "B.nguyen@yale.edu", "GPA 3.93"].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize:   "0.75rem",
                    color:      "var(--text-3)",
                    padding:    "4px 10px",
                    border:     "1px solid var(--border)",
                    borderRadius: "3px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              <a href="#work" className="btn btn-outline">View Work</a>
              <a href="/resume.pdf" download="Brandon_Nguyen_Resume.pdf" className="btn btn-outline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Resume
              </a>
              <a href="#contact" className="btn btn-ghost">Contact</a>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          style={{
            position:   "absolute",
            bottom:     0,
            left:       0,
            right:      0,
            height:     "120px",
            background: "linear-gradient(0deg, var(--bg) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ═══ ABOUT ══════════════════════════════════════════════════ */}
      <section id="about" style={{ padding: "96px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal">
          <div className="label"><span>About</span></div>
        </div>

        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "1fr 1fr",
            gap:                 "64px",
            alignItems:          "start",
          }}
          className="reveal"
        >
          {/* Photo + education */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                position:     "relative",
                width:        "100%",
                maxWidth:     "360px",
                aspectRatio:  "3 / 4",
                borderRadius: "4px",
                overflow:     "hidden",
                border:       "1px solid var(--border)",
              }}
            >
              <Image
                src="/profile.jpg"
                alt="Brandon Luu Nguyen"
                fill
                className="object-cover object-top"
                priority
                sizes="360px"
              />
              <div
                style={{
                  position:   "absolute",
                  bottom:     0,
                  left:       0,
                  right:      0,
                  height:     "60px",
                  background: "linear-gradient(0deg, rgba(8,8,9,0.8) 0%, transparent 100%)",
                }}
              />
            </div>

            {/* Education cards */}
            {[
              { school: "Yale University",           detail: "BA Economics, BS Chemistry", sub: "GPA 3.93 · Expected May 2029",    accent: true  },
              { school: "Tacoma Community College",  detail: "Associates of Arts — Biology",sub: "GPA 4.00 · Dean's List 2023–25", accent: false },
              { school: "Curtis Senior High School", detail: "Valedictorian, ranked 1/460", sub: "GPA 4.00",                       accent: false },
            ].map((e) => (
              <div
                key={e.school}
                className="card"
                style={{
                  padding:    "14px 16px",
                  borderLeft: e.accent ? `2px solid var(--gold)` : undefined,
                  borderRadius: e.accent ? "0 4px 4px 0" : "4px",
                  maxWidth:   "360px",
                }}
              >
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-1)", marginBottom: "3px" }}>{e.school}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-2)", marginBottom: "2px" }}>{e.detail}</p>
                <p style={{ fontSize: "0.7rem", color: "var(--text-3)" }}>{e.sub}</p>
              </div>
            ))}
          </div>

          {/* Bio */}
          <div>
            <h2
              style={{
                fontFamily:   "var(--font-serif)",
                fontSize:     "clamp(1.6rem, 2.5vw, 2.4rem)",
                fontWeight:   400,
                color:        "var(--text-1)",
                lineHeight:   1.2,
                marginBottom: "1.75rem",
                letterSpacing: "-0.01em",
              }}
            >
              I grew up in Tacoma, Washington — a port city where capital and real estate shape neighborhoods.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", color: "var(--text-2)", lineHeight: 1.8 }}>
              <p>
                That background shaped how I think about deals: not as abstractions, but as buildings,
                tenants, land, and the systems that connect them. A rent roll is a management report.
                A cap rate reflects real risk and real operating assumptions.
              </p>
              <p>
                At Yale I study Economics and Chemistry — a pairing that reflects how I approach analysis.
                I build financial models the way researchers run experiments: with explicit assumptions,
                structured tests, and conclusions I can defend under scrutiny.
              </p>
              <p>
                My work spans acquisition underwriting, asset management dashboards, public equity research,
                and legal advocacy for housing access. The common thread is structured analysis applied
                to real stakeholder problems.
              </p>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <p
                style={{
                  fontSize:      "0.6875rem",
                  fontWeight:    600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color:         "var(--text-3)",
                  marginBottom:  "12px",
                }}
              >
                Yale Activities
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {[
                  "Urban Philanthropic Fund — Analyst",
                  "Urban Philanthropic Consulting — Head of Consulting",
                  "Spykman Foreign Policy Fellow",
                  "Yale Small Claims Assistance — Treasurer",
                  "Yale Real Estate Club",
                  "Horological Society of New York",
                ].map((a) => (
                  <div
                    key={a}
                    style={{
                      padding:      "8px 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize:     "0.8125rem",
                      color:        "var(--text-2)",
                    }}
                  >
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SELECTED WORK ══════════════════════════════════════════ */}
      <section id="work" style={{ padding: "96px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal">
          <div className="label"><span>Selected Work</span></div>
          <h2
            style={{
              fontFamily:   "var(--font-serif)",
              fontSize:     "clamp(1.5rem, 2.2vw, 2rem)",
              fontWeight:   400,
              color:        "var(--text-1)",
              marginBottom: "0.75rem",
              maxWidth:     "520px",
            }}
          >
            Projects completed for real stakeholders.
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-2)", marginBottom: "3rem", maxWidth: "440px" }}>
            Investment committees, club executives, legal clients, and communities.
          </p>
        </div>

        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
            gap:                 "1px",
            background:          "var(--border)",
            border:              "1px solid var(--border)",
            borderRadius:        "6px",
            overflow:            "hidden",
          }}
        >
          {PROJECTS.map((p, i) => (
            <div
              key={p.id}
              className="reveal"
              style={{
                background:       "var(--surface)",
                padding:          "28px",
                transitionDelay:  `${i * 0.06}s`,
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <h3
                    style={{
                      fontFamily:   "var(--font-serif)",
                      fontSize:     "1.0625rem",
                      fontWeight:   400,
                      color:        "var(--text-1)",
                      marginBottom: "6px",
                      lineHeight:   1.3,
                    }}
                  >
                    {p.title}
                  </h3>
                  <span
                    style={{
                      fontSize:      "0.6875rem",
                      fontWeight:    600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color:         "var(--text-3)",
                    }}
                  >
                    {p.category}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize:     "0.6875rem",
                      padding:      "3px 8px",
                      borderRadius: "3px",
                      border:       p.status === "Confidential" ? "1px solid var(--border)" : "1px solid rgba(196,164,96,0.25)",
                      color:        p.status === "Confidential" ? "var(--text-3)" : "var(--gold)",
                      background:   p.status === "Confidential" ? "transparent" : "var(--gold-dim)",
                    }}
                  >
                    {p.status}
                  </span>
                  <a
                    href={p.file}
                    download
                    style={{
                      display:        "inline-flex",
                      alignItems:     "center",
                      gap:            "5px",
                      fontSize:       "0.6875rem",
                      color:          "var(--text-3)",
                      textDecoration: "none",
                      padding:        "3px 8px",
                      border:         "1px solid var(--border)",
                      borderRadius:   "3px",
                      transition:     "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => { const el = e.currentTarget; el.style.color = "var(--text-1)"; el.style.borderColor = "var(--border-md)"; }}
                    onMouseLeave={(e) => { const el = e.currentTarget; el.style.color = "var(--text-3)"; el.style.borderColor = "var(--border)"; }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    PDF
                  </a>
                </div>
              </div>

              {/* Summary */}
              <p
                style={{
                  fontSize:     "0.8125rem",
                  color:        "var(--text-2)",
                  lineHeight:   1.7,
                  marginBottom: "16px",
                  paddingBottom: "16px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {p.summary}
              </p>

              {/* Bullets */}
              <ul style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "7px" }}>
                {p.bullets.map((b) => (
                  <li
                    key={b}
                    style={{
                      display:  "flex",
                      gap:      "10px",
                      fontSize: "0.8125rem",
                      color:    "var(--text-2)",
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ flexShrink: 0, marginTop: "8px", width: "3px", height: "3px", borderRadius: "50%", background: "var(--gold)", display: "block" }} />
                    {b}
                  </li>
                ))}
              </ul>

              {/* Metrics */}
              {p.metrics && (
                <div
                  style={{
                    display:             "grid",
                    gridTemplateColumns: `repeat(${p.metrics.length}, 1fr)`,
                    gap:                 "1px",
                    background:          "var(--border)",
                    marginBottom:        "14px",
                    borderRadius:        "4px",
                    overflow:            "hidden",
                  }}
                >
                  {p.metrics.map((m) => (
                    <div
                      key={m.l}
                      style={{
                        background: "var(--surface-2)",
                        padding:    "12px 10px",
                        textAlign:  "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize:   "1.125rem",
                          fontWeight: 400,
                          color:      "var(--gold)",
                          lineHeight: 1,
                          marginBottom: "4px",
                        }}
                      >
                        {m.v}
                      </div>
                      <div
                        style={{
                          fontSize:      "0.6rem",
                          fontWeight:    600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color:         "var(--text-3)",
                        }}
                      >
                        {m.l}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {p.tags.map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ REAL ESTATE ════════════════════════════════════════════ */}
      <section id="realestate" style={{ padding: "96px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal">
          <div className="label"><span>Real Estate</span></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }}>
          <div className="reveal">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)", fontWeight: 400, color: "var(--text-1)", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              Acquisitions, asset management, and development analysis.
            </h2>
            <div style={{ color: "var(--text-2)", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <p>
                My work at Nordic Partners covered the full acquisition and asset management cycle:
                underwriting value-add multifamily deals, modeling debt structures and DSCR,
                benchmarking operating performance, and building dashboards that translate property data
                into actionable decisions.
              </p>
              <p>
                The 110 Munson St. development analysis added site-level work — zoning, unit mix
                optimization, pro formas, yield on cost, and development spread.
              </p>
              <p>
                Real estate also connects directly to housing access and community outcomes.
                That dimension matters to how I evaluate deals.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }} className="reveal">
            {[
              { cap: "Acquisition Underwriting",      detail: "Debt structuring, DSCR, exit cap scenarios, GP fee structures, pricing up to $20M."              },
              { cap: "Asset Management",              detail: "KPI dashboards, GL reconciliation, expense ratio bridges, implementation tracking."                },
              { cap: "RUBs & Expense Analysis",       detail: "Utility leakage identification, expense benchmarking, GL coding reconciliation."                  },
              { cap: "Development Pro Formas",        detail: "Site analysis, zoning review, unit mix optimization, yield on cost, development spread."          },
              { cap: "Market & Rent Comps",           detail: "Submarket analysis, comparable transactions, light-renovation value-add benchmarking."           },
            ].map((c, i) => (
              <div
                key={c.cap}
                style={{
                  padding:       "16px 0",
                  borderBottom:  "1px solid var(--border)",
                  display:       "grid",
                  gridTemplateColumns: "180px 1fr",
                  gap:           "20px",
                  alignItems:    "start",
                }}
              >
                <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-1)" }}>{c.cap}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-2)", lineHeight: 1.65 }}>{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INVESTING ══════════════════════════════════════════════ */}
      <section id="investing" style={{ padding: "96px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal">
          <div className="label"><span>Investing</span></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }}>
          <div className="reveal">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)", fontWeight: 400, color: "var(--text-1)", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              Thesis-driven public equity research.
            </h2>
            <div style={{ color: "var(--text-2)", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <p>
                At Urban Philanthropic Fund, I research public equities using the same analytical framework
                I apply to real estate: understand the business model, map the revenue drivers, identify
                mispricing, and build a thesis around defensible catalysts and quantified risks.
              </p>
              <p>
                WESCO International (WCC) is my flagship example — electrical distribution company
                at the intersection of AI infrastructure buildout, electrification, and grid modernization.
                Ascent acquisition overhang created a P/E discount to peers I viewed as temporary.
              </p>
              <p>
                I'm drawn to industrials, real estate, and infrastructure-adjacent equities where
                operational improvement and capital allocation create mispriced situations.
              </p>
            </div>
          </div>

          {/* WESCO card */}
          <div className="reveal">
            <div
              className="card-gold"
              style={{ padding: "24px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <p style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "8px" }}>
                    Flagship Pitch
                  </p>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 400, color: "var(--text-1)", marginBottom: "4px" }}>
                    WESCO International
                  </h3>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>WCC &nbsp;·&nbsp; Electrical Distribution</p>
                </div>
                <span
                  style={{
                    fontSize:   "0.8125rem",
                    fontWeight: 600,
                    padding:    "5px 14px",
                    border:     "1px solid rgba(94,122,150,0.4)",
                    borderRadius: "3px",
                    color:      "var(--steel)",
                    background: "rgba(94,122,150,0.08)",
                    flexShrink: 0,
                  }}
                >
                  BUY
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { k: "Thesis",    v: "AI/data center buildout + electrification + infrastructure spending" },
                  { k: "Catalyst",  v: "Ascent acquisition leverage unwinding — margin recovery path" },
                  { k: "Valuation", v: "P/E discount to industrial distribution peers — temporary overhang" },
                  { k: "Key Risk",  v: "Tariff exposure, debt levels, cybersecurity vulnerability" },
                ].map((r) => (
                  <div
                    key={r.k}
                    style={{
                      display:      "flex",
                      gap:          "16px",
                      padding:      "11px 0",
                      borderBottom: "1px solid var(--border)",
                      alignItems:   "flex-start",
                    }}
                  >
                    <span style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", minWidth: "70px", flexShrink: 0, paddingTop: "1px" }}>
                      {r.k}
                    </span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.6 }}>{r.v}</span>
                  </div>
                ))}
              </div>

              <a
                href="/projects/wesco-thesis.pdf"
                download
                className="btn btn-ghost"
                style={{ marginTop: "18px", width: "100%", justifyContent: "center", fontSize: "0.75rem" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Full Thesis
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PUBLIC SERVICE ═════════════════════════════════════════ */}
      <section id="service" style={{ padding: "96px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal">
          <div className="label"><span>Public Service</span></div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", fontWeight: 400, color: "var(--text-1)", marginBottom: "0.75rem", maxWidth: "480px" }}>
            Housing access, legal advocacy, and community investment.
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-2)", marginBottom: "3rem", maxWidth: "440px" }}>
            The same systems I analyze financially have direct consequences for people.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
          {[
            {
              org:    "Legal Aid Society",
              role:   "Homeless Rights Intern",
              desc:   "Supported 5+ NYC clients through shelter navigation, advocacy correspondence, and case documentation. Researched shelter access law and public benefits eligibility.",
              link:   "/projects/legal-aid.pdf",
            },
            {
              org:    "Yale Small Claims Assistance",
              role:   "Treasurer",
              desc:   "Aid CT residents navigating small claims court. Mastered procedure, eligibility thresholds, and judgment enforcement to reduce information asymmetry.",
              link:   null,
            },
            {
              org:    "Urban Philanthropic Fund",
              role:   "Analyst",
              desc:   "Investment returns redistributed as community grants to New Haven. Financial performance and public benefit in a direct loop.",
              link:   null,
            },
            {
              org:    "Urban Philanthropic Consulting",
              role:   "Head of Consulting",
              desc:   "Delivered strategy for New Haven Annex Club — revenue restructuring and 2026 implementation roadmap. Community institution strengthened through structured analysis.",
              link:   "/projects/annex-club-strategy.pdf",
            },
          ].map((s, i) => (
            <div
              key={s.org}
              className="reveal"
              style={{
                background:      "var(--surface)",
                padding:         "24px",
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-1)", marginBottom: "3px" }}>{s.org}</p>
              <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "12px" }}>{s.role}</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-2)", lineHeight: 1.7, marginBottom: s.link ? "14px" : 0 }}>{s.desc}</p>
              {s.link && (
                <a
                  href={s.link}
                  download
                  style={{ fontSize: "0.7rem", color: "var(--text-3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download PDF
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══ EXPERIENCE ═════════════════════════════════════════════ */}
      <section id="leadership" style={{ padding: "96px 40px", maxWidth: "900px", margin: "0 auto" }}>
        <div className="reveal">
          <div className="label"><span>Experience</span></div>
        </div>
        <div style={{ position: "relative", paddingLeft: "24px" }}>
          <div className="tl-line" />
          {EXPERIENCE.map((e, i) => (
            <div
              key={e.org}
              className="reveal"
              style={{ position: "relative", marginBottom: i < EXPERIENCE.length - 1 ? "36px" : 0, transitionDelay: `${i * 0.05}s` }}
            >
              <div className="tl-dot" />
              <div
                className="card"
                style={{ padding: "20px 22px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                  <div>
                    <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-1)", marginBottom: "3px" }}>{e.org}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--gold)", fontWeight: 500, marginBottom: "2px" }}>{e.role}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{e.loc}</p>
                  </div>
                  <span
                    style={{
                      fontSize:     "0.6875rem",
                      color:        "var(--text-3)",
                      padding:      "3px 8px",
                      border:       "1px solid var(--border)",
                      borderRadius: "3px",
                      flexShrink:   0,
                      whiteSpace:   "nowrap",
                    }}
                  >
                    {e.date}
                  </span>
                </div>
                <ul style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {e.bullets.map((b) => (
                    <li key={b} style={{ display: "flex", gap: "10px", fontSize: "0.8rem", color: "var(--text-2)", lineHeight: 1.65 }}>
                      <span style={{ flexShrink: 0, marginTop: "8px", width: "3px", height: "3px", borderRadius: "50%", background: "rgba(196,164,96,0.5)", display: "block" }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SKILLS ═════════════════════════════════════════════════ */}
      <section id="skills" style={{ padding: "96px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal">
          <div className="label"><span>Skills</span></div>
        </div>
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap:                 "1px",
            background:          "var(--border)",
            border:              "1px solid var(--border)",
            borderRadius:        "6px",
            overflow:            "hidden",
          }}
        >
          {SKILLS.map((cat, i) => (
            <div
              key={cat.title}
              className="reveal"
              style={{
                background:      "var(--surface)",
                padding:         "22px",
                transitionDelay: `${i * 0.06}s`,
              }}
            >
              <p
                style={{
                  fontSize:      "0.6875rem",
                  fontWeight:    600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color:         "var(--gold)",
                  marginBottom:  "14px",
                }}
              >
                {cat.title}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {cat.items.map((s) => <span className="tag" key={s}>{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CONTACT ════════════════════════════════════════════════ */}
      <section id="contact" style={{ padding: "96px 40px 120px", maxWidth: "900px", margin: "0 auto" }}>
        <div className="reveal" style={{ borderTop: "1px solid var(--border)", paddingTop: "64px" }}>
          <div className="label"><span>Contact</span></div>
          <h2
            style={{
              fontFamily:   "var(--font-serif)",
              fontSize:     "clamp(1.8rem, 3.5vw, 3rem)",
              fontWeight:   400,
              color:        "var(--text-1)",
              lineHeight:   1.15,
              marginBottom: "1rem",
            }}
          >
            Open to real estate, investing,<br />and serious conversations.
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.75, maxWidth: "420px", marginBottom: "2.5rem" }}>
            If you're building something in real estate PE, running a fund, or working on a problem
            that requires sharp analysis — reach out.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "3rem" }}>
            <a href="mailto:B.nguyen@yale.edu" className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Send Email
            </a>
            <a
              href="https://www.linkedin.com/in/brandon-nguyen-246tr"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              LinkedIn
            </a>
            <a href="/resume.pdf" download="Brandon_Nguyen_Resume.pdf" className="btn btn-outline">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Resume
            </a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", gap: "40px", width: "fit-content" }}>
            {[
              { k: "Email",    v: "B.nguyen@yale.edu", href: "mailto:B.nguyen@yale.edu" },
              { k: "Phone",    v: "(253) 240-5196",     href: "tel:+12532405196"          },
              { k: "Location", v: "Tacoma, WA",         href: null                        },
            ].map((c) => (
              <div key={c.k}>
                <p style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "4px" }}>{c.k}</p>
                {c.href ? (
                  <a href={c.href} style={{ fontSize: "0.875rem", color: "var(--text-2)", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-1)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
                  >{c.v}</a>
                ) : (
                  <p style={{ fontSize: "0.875rem", color: "var(--text-2)" }}>{c.v}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "20px 40px", textAlign: "center" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
          &copy; 2026 Brandon Luu Nguyen &nbsp;&middot;&nbsp; Tacoma, WA
        </p>
      </footer>
    </div>
  );
}

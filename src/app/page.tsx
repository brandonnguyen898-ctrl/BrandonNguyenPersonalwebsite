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
    title: "Nordic Partners Investments Asset Management Dashboard",
    category: "Asset Management · Operations",
    status: "Confidential",
    file: null,
    link: "https://nordic-partners-dashboard.vercel.app/login",
    summary: "Two co-managed student housing properties in Seattle needed a clearer way to track performance, identify issues, and make operating decisions.",
    bullets: [
      "Built KPI bridges from current occupancy to signed-lease and stabilized occupancy",
      "Reviewed GL data, billing practices, and operating expenses",
      "Identified $20.6K in annual RUBs utility leakage",
      "Created a 30/60/90-day implementation tracker across eight operating categories",
    ],
    metrics: [
      { v: "111",    l: "Units"         },
      { v: "$20.6K", l: "RUBs Leakage" },
      { v: "8",      l: "Focus Areas"  },
    ],
    tags: ["Asset Management","Dashboard Design","Excel Modeling","RUBs","Expense Benchmarking"],
  },
  {
    id: "munson",
    title: "110 Munson St. — New Haven Development Pitch",
    category: "Development Analysis · Investment Memo",
    status: "Public",
    file: "/projects/110-munson-st.pdf",
    summary: "Evaluated a 2.04-acre infill development site in New Haven and built a full investment memo around zoning, unit mix, rents, costs, and exit assumptions.",
    bullets: [
      "Analyzed zoning and development feasibility",
      "Designed a 185-unit mixed-use program",
      "Built a pro forma with yield-on-cost and exit valuation analysis",
      "Modeled projected sale profit after stabilization",
    ],
    metrics: [
      { v: "7.52%",  l: "Yield on Cost" },
      { v: "185",    l: "Proposed Units" },
      { v: "$18.8M", l: "Proj. Profit"  },
    ],
    tags: ["Zoning Analysis","Development Underwriting","Pro Forma","Yield on Cost","Rent Comps"],
  },
  {
    id: "wesco",
    title: "WESCO International — Public Equity Thesis",
    category: "Public Equity Research",
    status: "Public",
    file: "/projects/wesco-thesis.pdf",
    summary: "Researched WESCO International, an electrical distribution company exposed to data center growth, electrification, infrastructure spending, and grid modernization.",
    bullets: [
      "Built a thesis around segment-level growth drivers",
      "Compared valuation against industrial distribution peers",
      "Evaluated the Ascent acquisition, margin recovery, tariffs, debt, and cybersecurity risk",
      "Presented a BUY recommendation",
    ],
    metrics: [
      { v: "BUY",  l: "Rating"    },
      { v: "3",    l: "Segments"  },
      { v: "P/E↓", l: "vs. Peers" },
    ],
    tags: ["DCF","Comparable Company Analysis","Catalyst Framework","Risk Framework","Industry Structure"],
  },
  {
    id: "annex",
    title: "New Haven Annex Club — Revenue Strategy",
    category: "Consulting · Nonprofit Strategy",
    status: "Public",
    file: "/projects/annex-club-strategy.pdf",
    summary: "Worked with the New Haven Annex Club on membership, revenue, and operating strategy as the organization faced rising costs and reliance on rental income.",
    bullets: [
      "Analyzed revenue concentration and cost structure",
      "Recommended membership, programming, and marketing changes",
      "Built a 2026 implementation roadmap",
      "Presented recommendations to club leadership",
    ],
    metrics: [
      { v: "+20%",   l: "Rev. Target" },
      { v: "FY2026", l: "Roadmap"     },
      { v: "4",      l: "Focus Areas" },
    ],
    tags: ["Revenue Analysis","Membership Strategy","Implementation Planning","Nonprofit","Consulting"],
  },
  {
    id: "legal",
    title: "Legal Aid Society — Homeless Rights Project",
    category: "Legal Advocacy · Housing Access",
    status: "Public",
    file: null,
    summary: "Worked with homeless clients in New York City navigating shelter access, housing eligibility, public benefits, and documentation barriers.",
    bullets: [
      "Supported clients through housing navigation and case documentation",
      "Researched shelter access, housing eligibility, and public benefits rules",
      "Drafted advocacy letters to providers, shelters, and city agencies",
    ],
    metrics: null,
    tags: ["Client Advocacy","Legal Research","Housing Navigation","Case Documentation"],
  },
  {
    id: "math",
    title: "Math Masters",
    category: "Founder · Education Technology",
    status: "Public",
    file: "/projects/math-masters.pdf",
    summary: "Founded a gamified Algebra I program in Pierce County to make math practice more engaging and accessible for students.",
    bullets: [
      "Built the curriculum and learning structure",
      "Recruited and led a 12-person team",
      "Expanded programming to five schools and reached 500+ students",
      "Awarded the $20,000 Milton Fisher Scholarship for Innovation",
    ],
    metrics: [
      { v: "500+", l: "Students"      },
      { v: "$20K", l: "Scholarship"   },
      { v: "5",    l: "Schools"       },
    ],
    tags: ["Founder","Curriculum Design","Team Leadership","Community Outreach","EdTech"],
  },
  {
    id: "fluorescens",
    title: "P. fluorescens Genome Research",
    category: "Research Assistant · Biology",
    status: "Public",
    file: null,
    summary: "Worked on research involving Pseudomonas fluorescens and its ability to suppress a wheat-killing fungal pathogen.",
    bullets: [
      "Used CRISPR-based research techniques",
      "Studied gene sequences related to antifungal compound production",
      "Contributed technical documentation for ongoing lab research",
    ],
    metrics: null,
    tags: ["Genomics","CRISPR Research","Scientific Writing","Biological Systems"],
  },
];

// ── Experience ───────────────────────────────────────────────────────
const EXPERIENCE = [
  {
    org:    "Nordic Partners Investments",
    role:   "Syndication Asset Management Intern",
    loc:    "Seattle, WA",
    date:   "May 2026 – July 2026",
    bullets: [
      "Underwrote value-add multifamily acquisitions, including debt structure, DSCR, exit cap, and return scenarios.",
      "Built tools for organizing property financials, action plans, and performance reporting.",
      "Developed an asset management dashboard for two Seattle student housing properties.",
      "Identified $20.6K in annual RUBs utility leakage through billing and GL analysis.",
    ],
  },
  {
    org:    "Urban Philanthropic Fund",
    role:   "Analyst",
    loc:    "New Haven, CT",
    date:   "September 2025 – Present",
    bullets: [
      "Research public companies and prepare investment materials for committee review.",
      "Build DCF and comparable company analysis models.",
      "Study company fundamentals, industry structure, and portfolio positioning.",
      "Contribute to a student-run fund whose returns support New Haven grants.",
    ],
  },
  {
    org:    "Urban Philanthropic Consulting",
    role:   "Head of Consulting",
    loc:    "New Haven, CT",
    date:   "September 2025 – Present",
    bullets: [
      "Led the New Haven Annex Club consulting engagement.",
      "Built financial analysis around revenue mix, costs, membership, and programming.",
      "Presented a 2026 implementation roadmap to club leadership.",
      "Identified a potential 20% revenue growth opportunity.",
    ],
  },
  {
    org:    "Legal Aid Society — Homeless Rights Project",
    role:   "Legal Advocacy Intern",
    loc:    "New York, NY",
    date:   "2025 – 2026",
    bullets: [
      "Supported homeless clients navigating New York City's shelter and housing systems.",
      "Researched shelter access law, housing eligibility, and public benefits policy.",
      "Drafted advocacy letters and organized case documentation.",
    ],
  },
  {
    org:    "Yale Small Claims Assistance",
    role:   "Treasurer",
    loc:    "New Haven, CT",
    date:   "December 2025 – Present",
    bullets: [
      "Help Connecticut residents understand small claims court procedures.",
      "Manage organizational finances and member resources.",
      "Support client intake and procedural research.",
    ],
  },
  {
    org:    "Math Masters",
    role:   "Founder & President",
    loc:    "University Place, WA",
    date:   "August 2023 – 2025",
    bullets: [
      "Founded a gamified Algebra I learning platform.",
      "Built a 12-person team and reached 500+ students across Pierce County.",
      "Expanded programming to four high schools and one community college.",
      "Received the $20,000 Milton Fisher Scholarship for Innovation.",
    ],
  },
  {
    org:    "P. fluorescens Genome Research",
    role:   "Research Assistant",
    loc:    "Tacoma, WA",
    date:   "January 2025 – May 2025",
    bullets: [
      "Conducted CRISPR-based research on Pseudomonas fluorescens.",
      "Studied DNA sequences linked to suppression of a wheat fungal pathogen.",
      "Produced technical documentation for ongoing lab research.",
    ],
  },
];

// ── Skills ───────────────────────────────────────────────────────────
const SKILLS = [
  {
    title: "Finance",
    items: ["Financial Modeling","DCF Analysis","Comparable Company Analysis","Public Equity Research","Valuation","Risk Assessment","Debt Modeling","Investment Writing"],
  },
  {
    title: "Real Estate",
    items: ["Multifamily Underwriting","Development Analysis","Rent Comps","Expense Benchmarking","Asset Management","RUBs Analysis","NOI Analysis","Cap Rate Analysis","DSCR Modeling"],
  },
  {
    title: "Technical",
    items: ["Advanced Excel","Dashboard Design","Data Analysis","KPI Tracking","GL Reconciliation","Financial Reporting","AI-Enabled Tooling","Process Documentation"],
  },
  {
    title: "Legal & Public Service",
    items: ["Housing Navigation","Advocacy Writing","Case Documentation","Small Claims Procedure","Public Benefits Research","Legal Research","Client Intake"],
  },
  {
    title: "Consulting & Leadership",
    items: ["Revenue Analysis","Cost Benchmarking","Market Research","Implementation Planning","Executive Presentations","Team Leadership","Curriculum Design","Community Outreach"],
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
            background: "radial-gradient(ellipse 160% 65% at 50% 100%, #1866B8 0%, #0C3A6E 40%, #071D40 100%)",
          }}
        />

        {/* Map grid overlay */}
        <div
          style={{
            position:   "absolute",
            inset:      0,
            backgroundImage: `
              linear-gradient(rgba(94,150,200,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(94,150,200,0.025) 1px, transparent 1px)
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
              background:   "rgba(140,200,255,1)",
              opacity:      d.o * 0.75,
            }}
          />
        ))}

        {/* Water surface — animated wave lines */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          {/* Layer 1: slow drift */}
          <svg style={{ position: "absolute", bottom: 0, left: 0, width: "200%", height: "55%", animation: "navWaterScroll 18s linear infinite", opacity: Math.min(0.75, 0.38 + heroScroll * 0.5) }} viewBox="0 0 2000 440" preserveAspectRatio="none">
            {[40,80,118,156,196,236,276,318,360,400].map((y,i) => (
              <path key={i}
                d={`M0,${y} Q250,${y-6} 500,${y} Q750,${y+6} 1000,${y} Q1250,${y-6} 1500,${y} Q1750,${y+6} 2000,${y}`}
                stroke={`rgba(90,170,240,${0.055+i*0.009})`} strokeWidth="0.9" fill="none"
              />
            ))}
          </svg>
          {/* Layer 2: faster counter-drift */}
          <svg style={{ position: "absolute", bottom: 0, left: 0, width: "200%", height: "40%", animation: "navWaterScroll2 12s linear infinite", opacity: Math.min(0.6, 0.25 + heroScroll * 0.4) }} viewBox="0 0 2000 320" preserveAspectRatio="none">
            {[30,72,114,158,202,248,292].map((y,i) => (
              <path key={i}
                d={`M0,${y} Q300,${y+8} 600,${y} Q900,${y-8} 1200,${y} Q1500,${y+8} 1800,${y} Q2000,${y-4} 2000,${y}`}
                stroke={`rgba(140,210,255,${0.04+i*0.01})`} strokeWidth="0.7" fill="none"
              />
            ))}
          </svg>
          {/* Ripple rings at boat waterline — expand continuously */}
          {[0,1,2].map(i => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "66%",
                top: "65%",
                width: "70px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid rgba(130,210,255,0.45)",
                animation: "rippleExpand 2.8s ease-out infinite",
                animationDelay: `${i * 0.93}s`,
                pointerEvents: "none",
              }}
            />
          ))}
        </div>

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

        {/* Headshot — parallax right side */}
        <div
          style={{
            position:  "absolute",
            right:     `calc(6% - ${heroScroll * 60}px)`,
            top:       "50%",
            transform: `translateY(-50%) translateY(${heroScroll * -20}px)`,
            opacity:   Math.max(0, 1 - heroScroll * 2.2),
            transition: "opacity 0.05s",
          }}
        >
          <Image
            src="/profile.jpg"
            alt="Brandon Nguyen"
            width={320}
            height={400}
            priority
            style={{
              width:        "clamp(180px, 22vw, 320px)",
              height:       "auto",
              borderRadius: "4px",
              display:      "block",
              objectFit:    "cover",
              filter:       "brightness(0.92) contrast(1.04)",
            }}
          />
        </div>

        {/* Fog gradient — right side */}
        <div
          style={{
            position:   "absolute",
            right:      0,
            top:        0,
            bottom:     0,
            width:      "40%",
            background: "linear-gradient(270deg, rgba(7,22,55,0.55) 0%, transparent 100%)",
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
              I&apos;m a Yale student interested in investing, public service, research, and building tools that make complicated work easier to understand.
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
              My work has included financial modeling, public equity research, legal advocacy, nonprofit consulting, education technology, and science research.
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
              { school: "Tacoma Community College",  detail: "Associate of Arts — Biology",  sub: "GPA 4.00 · Dean's List 2023–2025", accent: false },
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
              I grew up in Tacoma, Washington, and came to Yale after starting at Tacoma Community College.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", color: "var(--text-2)", lineHeight: 1.8 }}>
              <p>
                I&apos;m interested in the kinds of problems that require both careful analysis and practical
                follow-through: evaluating an investment, helping someone navigate a legal system,
                building a dashboard, or turning an idea into something people can actually use.
              </p>
              <p>
                At Yale, I study Economics and Chemistry. I like the mix because it keeps me close to both
                markets and research. Economics pushes me to think about incentives, institutions, and
                decision-making. Chemistry trains me to be precise, test assumptions, and respect evidence.
              </p>
              <p>
                Most of my work falls into a few areas: investing, real estate analysis, public service,
                education, and technical projects. I&apos;m drawn to work where the stakes are real and the
                output has to be useful — not just interesting on paper.
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
          <p style={{ fontSize: "0.85rem", color: "var(--text-2)", marginBottom: "3rem", maxWidth: "480px" }}>
            A mix of finance, consulting, advocacy, education, and research projects.
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
                gridColumn:       i === PROJECTS.length - 1 && PROJECTS.length % 2 === 1 ? "1 / -1" : "auto",
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
                  {"link" in p && p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
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
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    View
                  </a>
                  )}
                  {p.file && (
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
                  )}
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

      {/* ═══ INVESTING ══════════════════════════════════════════════ */}
      <section id="investing" style={{ padding: "96px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal">
          <div className="label"><span>Investing</span></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", alignItems: "start" }}>
          <div className="reveal">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.2vw, 2.2rem)", fontWeight: 400, color: "var(--text-1)", lineHeight: 1.2, marginBottom: "1.5rem" }}>
              I&apos;m interested in investing because it rewards clear thinking.
            </h2>
            <div style={{ color: "var(--text-2)", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <p>
                A good thesis has to explain what the market is missing, why that gap exists, and what
                could cause it to close.
              </p>
              <p>
                At Urban Philanthropic Fund, I research public companies, build valuation models, and
                present investment ideas to the committee. My work has included DCFs, comparable company
                analysis, segment research, industry mapping, and risk review.
              </p>
              <p>
                My WESCO thesis focused on electrical distribution, data center growth, electrification,
                infrastructure spending, and the company&apos;s Ascent acquisition. The question was simple:
                was the discount to peers justified, or was the market over-penalizing temporary
                integration risk?
              </p>
            </div>
            <div style={{ marginTop: "2rem" }}>
              <p style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "12px" }}>
                Areas of Interest
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {["Public Equities","Industrials","Infrastructure","Real Estate-Adjacent","Capital Allocation","Market Structure","Valuation"].map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>
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
                  { k: "Thesis",    v: "AI/data center buildout, electrification, and infrastructure spending" },
                  { k: "Catalyst",  v: "Ascent acquisition leverage unwinding — clear margin recovery path" },
                  { k: "Valuation", v: "P/E discount to industrial distribution peers — temporary integration overhang" },
                  { k: "Key Risk",  v: "Tariff exposure, debt levels, and cybersecurity vulnerability" },
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
          <p style={{ fontSize: "0.85rem", color: "var(--text-2)", marginBottom: "3rem", maxWidth: "500px" }}>
            A lot of important systems are hard to navigate unless someone explains them clearly.
            That is what drew me to legal advocacy, small claims assistance, and community-focused investing.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", background: "var(--border)", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
          {[
            {
              org:    "Legal Aid Society — Homeless Rights Project",
              role:   "Legal Advocacy Intern",
              desc:   "Supported homeless clients in New York City with housing navigation, advocacy letters, shelter access research, and case documentation.",
              link:   null,
            },
            {
              org:    "Yale Small Claims Assistance",
              role:   "Treasurer",
              desc:   "Help Connecticut residents understand small claims procedure, filing rules, eligibility thresholds, and judgment enforcement.",
              link:   null,
            },
            {
              org:    "Urban Philanthropic Fund",
              role:   "Analyst",
              desc:   "Research investments for a fund where returns are redistributed as grants to New Haven organizations.",
              link:   null,
            },
            {
              org:    "Urban Philanthropic Consulting",
              role:   "Head of Consulting",
              desc:   "Led a consulting engagement for the New Haven Annex Club, helping the organization improve revenue strategy, membership growth, and long-term planning.",
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
            Open to conversations about investing, public service,<br />research, and building useful things.
          </h2>
          <p style={{ fontSize: "0.9rem", color: "var(--text-2)", lineHeight: 1.75, maxWidth: "420px", marginBottom: "2.5rem" }}>
            Reach out any time.
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

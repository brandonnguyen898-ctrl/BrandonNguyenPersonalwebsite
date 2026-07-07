"use client";

import { useEffect } from "react";
import Image from "next/image";
import OceanNav from "@/components/OceanNav";

// ── Deterministic stars (no Math.random — avoids hydration mismatch) ──
const STARS = Array.from({ length: 65 }, (_, i) => ({
  id: i,
  x: (i * 73 + 11) % 100,
  y: (i * 37 + 7) % 48,
  size: i % 6 === 0 ? 2 : 1,
  opacity: ((i * 17) % 5) / 10 + 0.05,
  delay: ((i * 13) % 30) / 10,
  dur: 2.5 + ((i * 7) % 25) / 10,
}));

const WAVE_LINES = [
  { top: "38%", dur: "11s", delay: "0s",   opacity: 0.09, rev: false },
  { top: "46%", dur: "8s",  delay: "2.2s", opacity: 0.12, rev: true  },
  { top: "54%", dur: "14s", delay: "0.8s", opacity: 0.07, rev: false },
  { top: "61%", dur: "9s",  delay: "3.5s", opacity: 0.1,  rev: true  },
  { top: "69%", dur: "7s",  delay: "1.2s", opacity: 0.11, rev: false },
  { top: "76%", dur: "12s", delay: "0.4s", opacity: 0.08, rev: true  },
  { top: "83%", dur: "6.5s",delay: "2s",   opacity: 0.09, rev: false },
];

// ── Case study data ──────────────────────────────────────────────────
const CASE_STUDIES = [
  {
    id: "dashboard",
    title: "Seattle Student Housing\nAsset Management Dashboard",
    type: "Asset Management · Operations",
    status: "Confidential",
    problem:
      "Two co-managed Seattle multifamily properties — combined 111 units — lacked unified operating dashboards to track KPIs, identify leakage, and support asset management decisions.",
    outputs: [
      "KPI bridges from current → signed-lease adjusted → stabilized 95% occupancy across both properties",
      "RUBs utility leakage analysis identifying $20.6K+ in annual unrecovered utility costs",
      "Expense ratio benchmarking, GL coding reconciliation, and advertising lead attribution",
      "30/60/90-day implementation tracker across 8 operational categories",
    ],
    metrics: [
      { v: "111",   l: "Combined Units"   },
      { v: "~49%",  l: "Current Exp. Ratio" },
      { v: "~35%",  l: "Normalized Ratio" },
      { v: "$20.6K",l: "RUBs Leakage"    },
    ],
    skills: ["Asset Management","NOI Analysis","Excel Modeling","Expense Benchmarking","RUBs Analysis","Dashboard Design"],
  },
  {
    id: "munson",
    title: "110 Munson St.\nNew Haven Development Pitch",
    type: "Development Underwriting · Investment Memo",
    status: "Public",
    problem:
      "A 2.04-acre infill site in New Haven, CT — RH-2 zoned and priced at $2M — presented a potential mixed-use development opportunity directly across from Winchester Lofts, near Yale.",
    outputs: [
      "Zoning analysis (RH-2 development by right), maximum buildable FAR, and site program design",
      "Recommended 185-unit mixed-use structure: 85 studios, 90 one-bedrooms, 10 two-bedrooms + 15% NNN commercial",
      "Full pro forma reaching 7.52% yield on cost — 2.02% spread over 5.50% exit cap",
      "Projected ~$18.8M sale profit after stabilization at market rents",
    ],
    metrics: [
      { v: "7.52%",  l: "Yield on Cost"    },
      { v: "2.02%",  l: "Dev. Spread"      },
      { v: "$18.8M", l: "Projected Profit" },
      { v: "185",    l: "Proposed Units"   },
    ],
    skills: ["Development Underwriting","Zoning Analysis","Pro Forma Modeling","Rent Comps","Unit Mix Strategy","Yield on Cost"],
  },
  {
    id: "wesco",
    title: "WESCO International\nPublic Equity Investment Thesis",
    type: "Public Equity Research · Investment Pitch",
    status: "Public",
    problem:
      "WESCO International (WCC) — a $22B electrical distribution company — traded at a discount to industrial peers despite structural tailwinds across three revenue segments and a transformative acquisition.",
    outputs: [
      "BUY recommendation driven by AI/data center buildout, electrification, and infrastructure spending tailwinds",
      "Revenue segmentation analysis across EES, Communications & Security, and Utility & Broadband lines",
      "Comparable company analysis identifying meaningful P/E discount vs. industrial distribution peers",
      "Catalyst and risk framework: Ascent integration leverage, tariff exposure, debt structure, and cybersecurity",
    ],
    metrics: [
      { v: "BUY",  l: "Recommendation"  },
      { v: "3",    l: "Revenue Segments"},
      { v: "$22B", l: "Market Context"  },
      { v: "P/E↓", l: "Discount Thesis" },
    ],
    skills: ["Equity Research","DCF Analysis","Comparable Analysis","Industry Analysis","Investment Writing","Catalyst Identification"],
  },
  {
    id: "annex",
    title: "New Haven Annex Club\nMembership & Revenue Strategy",
    type: "Nonprofit Consulting · Revenue Analysis",
    status: "Public",
    problem:
      "The New Haven Annex Club faced stagnating membership, rising operating costs, and structural over-reliance on rental revenue — creating long-term fragility in its operating model.",
    outputs: [
      "Revenue composition breakdown identifying rental revenue as ~60–70% of total — a single-source fragility",
      "Recommended diversification toward 30–50% membership-driven revenue mix",
      "Proposed agent network expansion, brand refresh, Instagram launch, community events, and guest-pass program",
      "2026 quarterly implementation roadmap presented to and approved by club executives",
    ],
    metrics: [
      { v: "20%",     l: "Revenue Growth Target" },
      { v: "30–50%",  l: "Membership Mix Goal"   },
      { v: "FY2026",  l: "Roadmap Approved"       },
      { v: "6",       l: "Revenue Streams Mapped" },
    ],
    skills: ["Nonprofit Consulting","Revenue Analysis","Cost Analysis","Marketing Strategy","Executive Presentation","Implementation Planning"],
  },
  {
    id: "legal",
    title: "Legal Aid Society\nHomeless Rights Project",
    type: "Legal Advocacy · Housing Justice",
    status: "Public",
    problem:
      "Homeless clients in New York City face compounding barriers — fragmented shelter records, unclear eligibility standards, and agency communication failures — that block stable housing access.",
    outputs: [
      "Supported 5+ clients through housing navigation, advocacy correspondence, and case documentation",
      "Researched NYC shelter access protocols, housing eligibility criteria, and public benefits law",
      "Drafted advocacy letters to housing providers, shelters, and government agencies on behalf of clients",
      "Coordinated intake and documented housing needs for clients facing domestic instability and urgent placement",
    ],
    metrics: null,
    skills: ["Client Advocacy","Legal Research","Case Documentation","Housing Navigation","Policy Research","Advocacy Writing"],
  },
  {
    id: "mathmasers",
    title: "Math Masters\nFounder & Platform Builder",
    type: "EdTech · Founder · Social Impact",
    status: "Public",
    problem:
      "Algebra I failure rates in Pierce County schools were driven partly by disengagement — students lacked structured, motivating resources outside the classroom.",
    outputs: [
      "Built a gamified Algebra I curriculum that turned abstract concepts into structured, competitive challenges",
      "Led a 12-person team and scaled outreach to 4 high schools and 1 community college",
      "Engaged 500+ students across Pierce County in active math programming",
      "Awarded $20,000 Milton Fisher Scholarship for Innovation — validating community impact and model viability",
    ],
    metrics: [
      { v: "500+", l: "Students Reached"  },
      { v: "12",   l: "Team Members"      },
      { v: "$20K", l: "Milton Fisher Award"},
      { v: "5",    l: "Schools Reached"   },
    ],
    skills: ["Founder","Team Leadership","Curriculum Design","Outreach","Product Thinking","Education Technology"],
  },
];

// ── Experience data ──────────────────────────────────────────────────
const EXPERIENCE = [
  {
    org:    "Nordic Partners Investments",
    role:   "Syndication Asset Management Intern",
    loc:    "Seattle, WA",
    date:   "May – July 2026",
    bullets: [
      "Underwrote value-add multifamily acquisitions — modeling debt structures, DSCR, exit cap scenarios, and GP fee structures to support offer pricing on deals up to $20M.",
      "Ran acquisition pricing scenarios and rent comp analyses across the Seattle submarket, benchmarking against light-renovation theses to validate ROI assumptions.",
      "Built an AI-enabled tool that parses property financials, generates 30/60/90-day action plans, and stores data for performance visualization — streamlining quarterly asset management reporting.",
      "Developed the Seattle Student Housing AM Dashboard for two co-managed properties, mapping KPIs, reconciling GL data, and identifying $20.6K in annual RUBs leakage.",
    ],
  },
  {
    org:    "Urban Philanthropic Fund",
    role:   "Analyst",
    loc:    "New Haven, CT",
    date:   "Sept 2025 – Present",
    bullets: [
      "Conducted equity valuations including UnitedHealth Group (UNH), building DCF and comparable analysis models to support investment committee decisions.",
      "Researched public company fundamentals, market positioning, and sector dynamics across UPF's portfolio.",
      "Helped deploy capital where investment returns are redistributed as grants back to the New Haven community — aligning financial performance with public benefit.",
    ],
  },
  {
    org:    "Urban Philanthropic Consulting",
    role:   "Head of Consulting",
    loc:    "New Haven, CT",
    date:   "Sept 2025 – Present",
    bullets: [
      "Led the New Haven Annex Club engagement: revenue analysis, cost benchmarking, marketing strategy, and executive presentation resulting in an approved FY 2026 implementation roadmap.",
      "Built a financial model projecting client cash flows to enhance decision-making and identify a 20% revenue growth opportunity.",
      "Conducted market research and proposed improvements across advertising, membership, and programming that were adopted for implementation.",
    ],
  },
  {
    org:    "Legal Aid Society — Homeless Rights Project",
    role:   "Legal Advocacy Intern",
    loc:    "New York, NY",
    date:   "2025 – 2026",
    bullets: [
      "Supported 5+ homeless clients through housing navigation, advocacy correspondence, and case documentation.",
      "Researched NYC shelter access, housing eligibility, public benefits law, and homelessness policy to assist supervising attorneys.",
      "Drafted advocacy letters to housing providers, shelters, and government agencies to address barriers blocking stable housing.",
    ],
  },
  {
    org:    "Yale Student Association for Small Claims Assistance",
    role:   "Treasurer",
    loc:    "New Haven, CT",
    date:   "Dec 2025 – Present",
    bullets: [
      "Aid Connecticut residents navigating small claims court — reducing the legal information asymmetry that disadvantages unrepresented litigants.",
      "Mastered CT small claims procedure, eligibility thresholds, filing requirements, and judgment enforcement.",
      "Manage organizational finances and coordinate member resources for client intake sessions.",
    ],
  },
  {
    org:    "Math Masters",
    role:   "Founder & President",
    loc:    "University Place, WA",
    date:   "Aug 2023 – 2025",
    bullets: [
      "Founded and built a gamified Algebra I learning platform — identified the problem, designed the curriculum, recruited a 12-person team, and scaled to 500+ students.",
      "Networked across 4 high schools and 1 community college in Pierce County to build sustained programming.",
      "Awarded $20,000 Milton Fisher Scholarship for Innovation, validating the model's design and community impact.",
    ],
  },
  {
    org:    "P. Fluorescens Genome Research",
    role:   "Research Assistant",
    loc:    "Tacoma, WA",
    date:   "Jan – May 2025",
    bullets: [
      "Leveraged CRISPR-based techniques to investigate Pseudomonas fluorescens, identifying DNA sequences that suppress a wheat-killing fungal pathogen.",
      "Conducted gene-level analysis to identify sequences increasing DAPG suppressant production — a key antifungal compound with crop protection applications.",
      "Developed technical documentation and contributed findings to ongoing lab research on biological crop protection.",
    ],
  },
];

// ── Skills data ──────────────────────────────────────────────────────
const SKILL_CATEGORIES = [
  {
    title: "Finance & Investing",
    skills: ["Financial Modeling","DCF Analysis","Comparable Analysis","Public Equity Research","Underwriting","Yield on Cost","Development Spread","Cap Rate Analysis","NOI Analysis","DSCR Modeling","GP Fee Structures","Valuation","Risk Assessment"],
  },
  {
    title: "Real Estate",
    skills: ["Multifamily Acquisitions","Value-Add Strategy","Asset Management","Development Underwriting","Zoning Analysis","Unit Mix Strategy","RUBs Analysis","Expense Benchmarking","Rent Comps","Pro Forma Modeling","Acquisition Pricing","Stabilization Projections"],
  },
  {
    title: "Technical & Analytical",
    skills: ["Advanced Excel","Dashboard Design","KPI Tracking","GL Reconciliation","Data Analysis","AI-Enabled Tools","Performance Visualization","Source Mapping","Financial Reporting","Process Development"],
  },
  {
    title: "Legal & Advocacy",
    skills: ["Housing Navigation","Client Intake","Advocacy Writing","Case Documentation","Small Claims Law","NYC Shelter Policy","Public Benefits Research","Legal Research","Access-to-Justice Work"],
  },
  {
    title: "Consulting & Strategy",
    skills: ["Revenue Analysis","Cost Analysis","Market Research","Implementation Roadmaps","Marketing Strategy","Nonprofit Consulting","Executive Presentations","Membership Strategy"],
  },
  {
    title: "Research & Science",
    skills: ["CRISPR Research","Genomics","Biological Systems Analysis","Technical Documentation","Scientific Writing","Lab Technique"],
  },
];

// ── Fixed ocean background ───────────────────────────────────────────
function OceanBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, overflow: "hidden" }}
    >
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(185deg, #020610 0%, #04091a 10%, #070f22 22%, #0B1E33 42%, #0d2740 58%, #0a1e32 76%, #06111f 90%, #030810 100%)",
        }}
      />
      {/* Horizon glow */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "22%",
          height: "140px",
          background:
            "radial-gradient(ellipse 80% 100% at 50% 50%, rgba(31,166,166,0.04) 0%, transparent 100%)",
        }}
      />
      {/* Stars */}
      <div className="absolute top-0 left-0 right-0" style={{ height: "50%" }}>
        {STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              left:             `${s.x}%`,
              top:              `${s.y}%`,
              width:            `${s.size}px`,
              height:           `${s.size}px`,
              opacity:          s.opacity,
              animation:        `twinkle ${s.dur}s ease-in-out infinite`,
              animationDelay:   `${s.delay}s`,
            }}
          />
        ))}
      </div>
      {/* Moon */}
      <div
        className="absolute rounded-full"
        style={{
          top:        "5%",
          right:      "8%",
          width:      "38px",
          height:     "38px",
          background: "radial-gradient(circle at 38% 38%, #fffde7, #ffd54f 60%, #ffb300)",
          boxShadow:  "0 0 30px rgba(255,213,79,0.2), 0 0 70px rgba(255,213,79,0.08)",
        }}
      />
      {/* Wave lines */}
      {WAVE_LINES.map((w, i) => (
        <div
          key={i}
          className="wave-line"
          style={{
            top:       w.top,
            "--dur":   w.dur,
            "--delay": w.delay,
            opacity:   w.opacity,
            animationDirection: w.rev ? "reverse" : "normal",
          } as React.CSSProperties}
        />
      ))}
      {/* Water shimmer pools */}
      <div
        className="absolute rounded-full"
        style={{
          top:        "42%",
          left:       "5%",
          width:      "320px",
          height:     "180px",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 70%)",
          animation:  "gentleFloat 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top:        "60%",
          right:      "8%",
          width:      "400px",
          height:     "220px",
          background: "radial-gradient(ellipse, rgba(31,166,166,0.04) 0%, transparent 70%)",
          animation:  "gentleFloat 24s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}

// ── Utility section helpers ──────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-label">
      <span>{children as string}</span>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
      <span
        className="mt-2 flex-shrink-0 w-1 h-1 rounded-full"
        style={{ background: "var(--gold)" }}
      />
      {children}
    </li>
  );
}

// ═══════════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════════
export default function Home() {
  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <OceanBackground />
      <OceanNav />

      <main style={{ position: "relative", zIndex: 5, paddingTop: "56px" }}>

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <section
          id="hero"
          style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
        >
          <div
            className="max-w-7xl mx-auto px-6 w-full"
            style={{ paddingTop: "80px", paddingBottom: "80px" }}
          >
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Text */}
              <div>
                <div
                  className="flex items-center gap-3 mb-8"
                  style={{ opacity: 0.8 }}
                >
                  <div
                    style={{ width: "28px", height: "1.5px", background: "var(--gold)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize:      "0.68rem",
                      fontWeight:    700,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color:         "var(--gold)",
                    }}
                  >
                    Yale University · Class of 2029
                  </span>
                </div>

                <h1
                  className="serif"
                  style={{
                    fontSize:    "clamp(2.8rem, 5.5vw, 5rem)",
                    fontWeight:  600,
                    lineHeight:  1.1,
                    color:       "var(--text-1)",
                    marginBottom: "1.5rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Building at the intersection of{" "}
                  <em style={{ color: "var(--gold)", fontStyle: "italic" }}>
                    real estate,
                  </em>{" "}
                  <em style={{ color: "var(--teal)", fontStyle: "italic" }}>
                    capital,
                  </em>{" "}
                  and systems.
                </h1>

                <p
                  style={{
                    fontSize:     "1.05rem",
                    lineHeight:   1.8,
                    color:        "var(--text-2)",
                    maxWidth:     "520px",
                    marginBottom: "2rem",
                  }}
                >
                  Yale student from Tacoma — underwriting multifamily acquisitions,
                  building asset management dashboards, researching public equities,
                  advocating for housing access, and turning complex systems into
                  clear decisions.
                </p>

                <div
                  className="flex flex-wrap gap-3 mb-10"
                  style={{ fontSize: "0.82rem", color: "var(--text-3)" }}
                >
                  {[
                    { icon: "📍", t: "Tacoma, WA",        href: null              },
                    { icon: "✉",  t: "B.nguyen@yale.edu", href: "mailto:B.nguyen@yale.edu" },
                    { icon: "🎓", t: "GPA 3.93 / 4.00",   href: null              },
                  ].map((c) => {
                    const Tag = c.href ? "a" : "span";
                    return (
                      <Tag
                        key={c.t}
                        {...(c.href ? { href: c.href } : {})}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                        style={{
                          background:     "rgba(255,255,255,0.04)",
                          border:         "1px solid rgba(255,255,255,0.08)",
                          textDecoration: "none",
                          color:          "inherit",
                        }}
                      >
                        {c.icon} {c.t}
                      </Tag>
                    );
                  })}
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href="#work" className="btn-primary">View Work</a>
                  <a href="#contact" className="btn-ghost">Contact Me</a>
                  <a
                    href="https://www.linkedin.com/in/brandon-nguyen-246tr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ gap: "6px" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>

              {/* Photo + stat cards */}
              <div className="flex flex-col items-center gap-5">
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    width:      "260px",
                    height:     "320px",
                    border:     "1px solid rgba(255,255,255,0.09)",
                    boxShadow:  "0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(200,169,106,0.1)",
                  }}
                >
                  <Image
                    src="/profile.jpg"
                    alt="Brandon Luu Nguyen"
                    fill
                    className="object-cover object-top"
                    priority
                    sizes="260px"
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 px-4 py-3"
                    style={{
                      background:
                        "linear-gradient(0deg, rgba(5,8,20,0.92) 0%, transparent 100%)",
                    }}
                  >
                    <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-1)" }}>
                      Brandon Luu Nguyen
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "var(--gold)" }}>
                      Yale · Economics &amp; Chemistry
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                  {[
                    { v: "3.93", l: "Yale GPA"       },
                    { v: "#1",   l: "Valedictorian"   },
                    { v: "4.00", l: "TCC GPA"         },
                    { v: "$20K", l: "Milton Fisher"   },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="glass rounded-xl shimmer lift"
                      style={{ textAlign: "center", padding: "14px 10px" }}
                    >
                      <div className="metric-value" style={{ fontSize: "1.5rem" }}>
                        {s.v}
                      </div>
                      <div className="metric-label">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll hint */}
            <div
              className="flex flex-col items-center gap-2 mt-16"
              style={{
                color:     "rgba(170,182,197,0.35)",
                animation: "gentleFloat 3s ease-in-out infinite",
              }}
            >
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                Scroll
              </span>
              <div
                style={{
                  width:      "1px",
                  height:     "36px",
                  background: "linear-gradient(180deg, rgba(200,169,106,0.4), transparent)",
                  borderRadius: "1px",
                }}
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            ABOUT
        ══════════════════════════════════════════ */}
        <section id="about" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="reveal">
              <SectionLabel>About</SectionLabel>
            </div>

            <div className="grid lg:grid-cols-5 gap-16 items-start">
              {/* Story — spans 3 cols */}
              <div className="lg:col-span-3 reveal">
                <h2
                  className="serif"
                  style={{
                    fontSize:     "clamp(1.8rem, 3vw, 2.6rem)",
                    fontWeight:   500,
                    lineHeight:   1.25,
                    color:        "var(--text-1)",
                    marginBottom: "1.75rem",
                  }}
                >
                  I grew up in{" "}
                  <span style={{ color: "var(--teal)" }}>Tacoma, Washington</span> —
                  a port city where capital, real estate, and municipal systems shape
                  everyday life.
                </h2>

                <div
                  style={{
                    display:       "flex",
                    flexDirection: "column",
                    gap:           "1.25rem",
                    fontSize:      "1rem",
                    lineHeight:    1.9,
                    color:         "var(--text-2)",
                  }}
                >
                  <p>
                    That environment shaped how I think about real estate and investing:
                    not as financial abstractions, but as systems that determine what
                    neighborhoods exist, who can afford housing, and how cities function.
                    The numbers in a rent roll correspond to real buildings and real
                    tenants. The yield on a development pro forma reflects real land,
                    real labor, and real risk.
                  </p>
                  <p>
                    At Yale, I study Economics and Chemistry — a combination that mirrors
                    my approach to problems. I build financial models the way scientists
                    run experiments: with clear hypotheses, explicit assumptions,
                    structured tests, and conclusions you can defend. I&rsquo;m drawn to
                    complexity that can be mapped, measured, and improved.
                  </p>
                  <p>
                    Real estate pulls me in because it sits at the intersection of
                    valuation, leverage, operations, and human behavior. Investing demands
                    disciplined thinking under uncertainty — you cannot be vague when
                    capital is at stake. Legal advocacy taught me something different:
                    that systems determine outcomes, and that technical knowledge deployed
                    for people — not just transactions — is the highest-leverage use of
                    analytical skill.
                  </p>
                  <p>
                    My edge is integration. I can read a rent roll, underwrite a
                    development site, draft a client advocacy letter, and build an
                    Excel dashboard — because I&rsquo;ve had to do all of these things
                    for real stakeholders, under real constraints.
                  </p>
                </div>
              </div>

              {/* Quick facts — spans 2 cols */}
              <div className="lg:col-span-2 flex flex-col gap-4 reveal">
                {[
                  {
                    label: "Yale University",
                    detail: "BA Economics, BS Chemistry · GPA 3.93",
                    note: "Expected May 2029",
                    accent: "gold",
                  },
                  {
                    label: "Tacoma Community College",
                    detail: "Associates of Arts — Biology · GPA 4.00",
                    note: "Dean's List 2023–2025",
                    accent: "teal",
                  },
                  {
                    label: "Curtis Senior High School",
                    detail: "Valedictorian — Ranked 1 of 460",
                    note: "GPA 4.00",
                    accent: "sand",
                  },
                ].map((e) => (
                  <div
                    key={e.label}
                    className="glass rounded-xl shimmer lift"
                    style={{
                      padding:   "18px 20px",
                      borderLeft: `2px solid ${
                        e.accent === "gold"
                          ? "rgba(200,169,106,0.6)"
                          : e.accent === "teal"
                          ? "rgba(31,166,166,0.5)"
                          : "rgba(216,199,163,0.4)"
                      }`,
                    }}
                  >
                    <p style={{ fontWeight: 600, color: "var(--text-1)", marginBottom: "4px", fontSize: "0.9rem" }}>
                      {e.label}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-2)", marginBottom: "4px" }}>
                      {e.detail}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>{e.note}</p>
                  </div>
                ))}

                <div
                  className="glass rounded-xl"
                  style={{ padding: "18px 20px" }}
                >
                  <p
                    style={{
                      fontSize:      "0.68rem",
                      fontWeight:    700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color:         "var(--text-3)",
                      marginBottom:  "12px",
                    }}
                  >
                    Activities at Yale
                  </p>
                  {[
                    "UP Fund Investing & Consulting",
                    "Spykman Foreign Policy Fellow",
                    "Yale Assoc. for Small Claims",
                    "Yale Real Estate Club",
                    "Horological Society of New York",
                  ].map((a) => (
                    <p
                      key={a}
                      style={{
                        fontSize:    "0.78rem",
                        color:       "var(--text-2)",
                        padding:     "5px 0",
                        borderBottom: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      {a}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SELECTED WORK
        ══════════════════════════════════════════ */}
        <section id="work" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="reveal">
              <SectionLabel>Selected Work</SectionLabel>
              <div style={{ maxWidth: "560px", marginBottom: "3rem" }}>
                <h2
                  className="serif"
                  style={{ fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)", fontWeight: 500, color: "var(--text-1)", marginBottom: "0.75rem" }}
                >
                  Proof of work across real estate, finance, advocacy, and systems.
                </h2>
                <p style={{ fontSize: "0.9rem", lineHeight: 1.75, color: "var(--text-2)" }}>
                  Each project below was completed for real stakeholders — investment committees,
                  clients, clubs, or community members. Nothing here is hypothetical.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {CASE_STUDIES.map((cs, idx) => (
                <div
                  key={cs.id}
                  className="glass cs-card shimmer lift reveal"
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  {/* Header */}
                  <div
                    className="flex items-start justify-between gap-3 mb-4"
                    style={{ flexWrap: "wrap" }}
                  >
                    <div>
                      <h3
                        className="serif"
                        style={{
                          fontSize:     "1.15rem",
                          fontWeight:   600,
                          color:        "var(--text-1)",
                          lineHeight:   1.3,
                          whiteSpace:   "pre-line",
                          marginBottom: "6px",
                        }}
                      >
                        {cs.title}
                      </h3>
                      <span className="badge">{cs.type}</span>
                    </div>
                    <span
                      className={cs.status === "Confidential" ? "badge-dim badge" : "badge-gold badge"}
                    >
                      {cs.status}
                    </span>
                  </div>

                  {/* Problem */}
                  <p
                    style={{
                      fontSize:     "0.83rem",
                      lineHeight:   1.75,
                      color:        "var(--text-2)",
                      marginBottom: "16px",
                      paddingBottom: "16px",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <span style={{ color: "var(--text-3)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                      Problem
                    </span>
                    {cs.problem}
                  </p>

                  {/* Outputs */}
                  <ul style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                    {cs.outputs.map((o) => (
                      <Bullet key={o}>{o}</Bullet>
                    ))}
                  </ul>

                  {/* Metrics */}
                  {cs.metrics && (
                    <div
                      className="grid grid-cols-4 gap-2 rounded-lg"
                      style={{
                        background: "rgba(11,30,51,0.5)",
                        padding:    "12px",
                        marginBottom: "16px",
                      }}
                    >
                      {cs.metrics.map((m) => (
                        <div key={m.l} style={{ textAlign: "center" }}>
                          <div className="metric-value" style={{ fontSize: "1rem" }}>
                            {m.v}
                          </div>
                          <div className="metric-label" style={{ fontSize: "0.55rem" }}>
                            {m.l}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {cs.skills.map((s) => (
                      <span className="skill-tag" key={s} style={{ fontSize: "0.7rem", padding: "3px 8px" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            REAL ESTATE
        ══════════════════════════════════════════ */}
        <section id="realestate" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="reveal">
              <SectionLabel>Real Estate</SectionLabel>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="reveal">
                <h2
                  className="serif"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 500, color: "var(--text-1)", lineHeight: 1.25, marginBottom: "1.5rem" }}
                >
                  Real estate is where{" "}
                  <em style={{ color: "var(--gold)", fontStyle: "italic" }}>valuation</em>,{" "}
                  <em style={{ color: "var(--teal)", fontStyle: "italic" }}>leverage</em>, and{" "}
                  <em style={{ color: "var(--sand)", fontStyle: "italic" }}>operations</em>{" "}
                  converge.
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.95rem", lineHeight: 1.85, color: "var(--text-2)" }}>
                  <p>
                    I came to real estate through numbers first — rent rolls, cap
                    rates, DSCR models, expense ratios — and quickly realized the
                    technical work only makes sense when you understand the asset.
                    A 50% expense ratio isn&rsquo;t just a ratio. It means operating
                    costs are eating into potential NOI, which compresses returns,
                    which changes the deal thesis.
                  </p>
                  <p>
                    My experience at Nordic Partners and through my own analysis
                    covers the full acquisition and asset management cycle:
                    underwriting deals, modeling debt structures, running rent comps,
                    benchmarking operating performance, identifying leakage, and
                    building dashboards that translate raw property data into
                    actionable decisions.
                  </p>
                  <p>
                    Real estate also connects to public interest. Every acquisition
                    analysis I run involves real buildings and real tenants. Zoning
                    codes, housing supply, and asset ownership patterns shape
                    communities. That intersection is where I want to build expertise.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 reveal">
                <h3
                  style={{
                    fontSize:      "0.68rem",
                    fontWeight:    700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color:         "var(--text-3)",
                    marginBottom:  "4px",
                  }}
                >
                  Core RE Capabilities
                </h3>
                {[
                  {
                    cap: "Acquisition Underwriting",
                    desc: "Debt structuring, DSCR, exit cap scenarios, GP fee structures, pricing on deals up to $20M.",
                  },
                  {
                    cap: "Asset Management & Operations",
                    desc: "KPI dashboards, GL reconciliation, expense ratio bridges, RUBs leakage analysis, implementation tracking.",
                  },
                  {
                    cap: "Development Analysis",
                    desc: "Site analysis, zoning review, unit mix optimization, pro formas, yield on cost, development spread.",
                  },
                  {
                    cap: "Market Research",
                    desc: "Rent comps, submarket analysis, comparable transactions, light-renovation value-add benchmarking.",
                  },
                ].map((c) => (
                  <div
                    key={c.cap}
                    className="glass rounded-xl lift"
                    style={{ padding: "16px 20px", borderLeft: "2px solid rgba(200,169,106,0.4)" }}
                  >
                    <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-1)", marginBottom: "4px" }}>
                      {c.cap}
                    </p>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                      {c.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            INVESTING
        ══════════════════════════════════════════ */}
        <section id="investing" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="reveal">
              <SectionLabel>Investing</SectionLabel>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="reveal">
                <h2
                  className="serif"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 500, color: "var(--text-1)", lineHeight: 1.25, marginBottom: "1.5rem" }}
                >
                  Investing rewards clarity.{" "}
                  <em style={{ color: "var(--teal)", fontStyle: "italic" }}>
                    Vague thinking gets priced out.
                  </em>
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.95rem", lineHeight: 1.85, color: "var(--text-2)" }}>
                  <p>
                    At the Urban Philanthropic Fund, I approach public equity
                    research the same way I approach real estate underwriting:
                    understand the business model, map the revenue drivers, identify
                    where the market is mispricing something, and build a defensible
                    thesis around catalysts and risks.
                  </p>
                  <p>
                    My WESCO analysis is a working example. WESCO distributes
                    electrical equipment and supply chain solutions across three
                    segments. The market was pricing the stock at a discount to
                    peers — but the Ascent acquisition, combined with AI infrastructure
                    buildout, electrification tailwinds, and margin recovery, pointed
                    toward significant upside. The thesis required understanding
                    industry structure, not just reading the income statement.
                  </p>
                  <p>
                    I&rsquo;m interested in companies where operational improvements,
                    market structure dynamics, and capital allocation create mispriced
                    opportunities — particularly in industrials, real estate, and
                    infrastructure-adjacent sectors.
                  </p>
                </div>
              </div>

              {/* WESCO card */}
              <div className="reveal">
                <div
                  className="glass glass-gold rounded-2xl shimmer"
                  style={{ padding: "28px" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "6px" }}>
                        Flagship Pitch
                      </p>
                      <h3 className="serif" style={{ fontSize: "1.3rem", fontWeight: 600, color: "var(--text-1)" }}>
                        WESCO International
                      </h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>WCC · Electrical Distribution & Supply Chain</p>
                    </div>
                    <div
                      className="rounded-lg"
                      style={{
                        padding:    "6px 14px",
                        background: "rgba(31,166,166,0.15)",
                        border:     "1px solid rgba(31,166,166,0.4)",
                        color:      "var(--teal)",
                        fontWeight: 700,
                        fontSize:   "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      BUY
                    </div>
                  </div>

                  <div
                    style={{
                      display:      "flex",
                      flexDirection: "column",
                      gap:          "8px",
                      marginBottom: "20px",
                    }}
                  >
                    {[
                      { label: "Core Thesis",   val: "AI/data center buildout + electrification + infrastructure spending" },
                      { label: "Key Catalyst",  val: "Ascent acquisition creating operational leverage and margin recovery" },
                      { label: "Valuation",     val: "P/E discount to industrial distribution peers — mispricing opportunity" },
                      { label: "Primary Risk",  val: "Tariff exposure, debt levels, and cybersecurity vulnerability" },
                    ].map((r) => (
                      <div
                        key={r.label}
                        style={{
                          display:       "flex",
                          gap:           "12px",
                          padding:       "10px 0",
                          borderBottom:  "1px solid rgba(255,255,255,0.05)",
                          alignItems:    "flex-start",
                        }}
                      >
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", flexShrink: 0, minWidth: "80px", paddingTop: "2px" }}>
                          {r.label}
                        </span>
                        <span style={{ fontSize: "0.82rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                          {r.val}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {["Electrical Distribution","3 Revenue Segments","Comparable Analysis","DCF","Catalyst Framework","$22B Market"].map((t) => (
                      <span className="skill-tag" key={t} style={{ fontSize: "0.7rem", padding: "3px 8px" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PUBLIC SERVICE
        ══════════════════════════════════════════ */}
        <section id="service" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="reveal">
              <SectionLabel>Public Service</SectionLabel>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="reveal">
                <h2
                  className="serif"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 500, color: "var(--text-1)", lineHeight: 1.25, marginBottom: "1.5rem" }}
                >
                  Real estate is not only an asset class.{" "}
                  <em style={{ color: "var(--teal)", fontStyle: "italic" }}>
                    It&rsquo;s housing, neighborhoods, and people&rsquo;s lives.
                  </em>
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.95rem", lineHeight: 1.85, color: "var(--text-2)" }}>
                  <p>
                    My legal and public service work started with a simple
                    observation: complex systems disadvantage people who don&rsquo;t
                    have access to technical knowledge. Shelter access rules, small
                    claims procedures, public benefits eligibility — these systems
                    have real stakes and are not well-explained to the people most
                    affected by them.
                  </p>
                  <p>
                    At Legal Aid Society, I worked directly with homeless clients
                    navigating NYC&rsquo;s shelter system. At Yale&rsquo;s Small Claims
                    Assistance program, I help Connecticut residents understand
                    court procedures that legal professionals take for granted.
                    At Urban Philanthropic Fund, investment returns are redistributed
                    as grants to New Haven — a direct loop between financial
                    performance and community benefit.
                  </p>
                  <p>
                    These experiences shaped how I think about real estate development
                    and investment. Buildings create neighborhoods. Neighborhoods
                    determine access to schools, employment, and stability. The
                    financial analysis is inseparable from those outcomes.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 reveal">
                {[
                  {
                    org:     "Legal Aid Society — Homeless Rights Project",
                    role:    "Legal Advocacy Intern",
                    impact:  "Supported 5+ clients through housing navigation, advocacy letters, and case documentation across NYC shelter and housing systems.",
                    accent:  "#1FA6A6",
                  },
                  {
                    org:     "Yale Student Association for Small Claims Assistance",
                    role:    "Treasurer",
                    impact:  "Aids CT residents navigating small claims court — reducing information asymmetry for unrepresented litigants.",
                    accent:  "#C8A96A",
                  },
                  {
                    org:     "Urban Philanthropic Fund",
                    role:    "Analyst",
                    impact:  "Investment returns redistributed as community grants to New Haven — aligning financial performance with public benefit.",
                    accent:  "#1FA6A6",
                  },
                  {
                    org:     "Urban Philanthropic Consulting",
                    role:    "Head of Consulting",
                    impact:  "Delivered the New Haven Annex Club strategy — a community institution strengthened through revenue analysis and 2026 implementation plan.",
                    accent:  "#C8A96A",
                  },
                ].map((s) => (
                  <div
                    key={s.org}
                    className="glass rounded-xl lift"
                    style={{ padding: "18px 20px", borderLeft: `2px solid ${s.accent}60` }}
                  >
                    <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text-1)", marginBottom: "2px" }}>
                      {s.org}
                    </p>
                    <p style={{ fontSize: "0.72rem", color: s.accent, fontWeight: 600, marginBottom: "8px" }}>
                      {s.role}
                    </p>
                    <p style={{ fontSize: "0.8rem", lineHeight: 1.65, color: "var(--text-2)" }}>
                      {s.impact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            EXPERIENCE
        ══════════════════════════════════════════ */}
        <section id="leadership" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="reveal">
              <SectionLabel>Experience &amp; Leadership</SectionLabel>
            </div>

            <div style={{ position: "relative", paddingLeft: "28px" }}>
              <div className="timeline-line" />
              {EXPERIENCE.map((e, i) => (
                <div
                  key={e.org}
                  className="reveal"
                  style={{ position: "relative", marginBottom: i < EXPERIENCE.length - 1 ? "40px" : 0 }}
                >
                  <div className="timeline-dot" />
                  <div className="glass cs-card shimmer lift" style={{ borderLeft: "none" }}>
                    <div
                      className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3"
                    >
                      <div>
                        <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-1)", marginBottom: "2px" }}>
                          {e.org}
                        </h3>
                        <p style={{ fontSize: "0.82rem", color: "var(--teal)", fontWeight: 600 }}>
                          {e.role}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{e.loc}</p>
                      </div>
                      <span
                        className="badge-dim badge flex-shrink-0 mt-1"
                        style={{ alignSelf: "flex-start" }}
                      >
                        {e.date}
                      </span>
                    </div>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {e.bullets.map((b) => (
                        <Bullet key={b}>{b}</Bullet>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SKILLS
        ══════════════════════════════════════════ */}
        <section id="skills" style={{ paddingTop: "96px", paddingBottom: "96px" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="reveal">
              <SectionLabel>Skills</SectionLabel>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SKILL_CATEGORIES.map((cat, i) => (
                <div
                  key={cat.title}
                  className="glass rounded-xl reveal lift"
                  style={{ padding: "22px", transitionDelay: `${i * 0.07}s` }}
                >
                  <p
                    style={{
                      fontSize:      "0.66rem",
                      fontWeight:    700,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color:         "var(--gold)",
                      marginBottom:  "14px",
                    }}
                  >
                    {cat.title}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s) => (
                      <span className="skill-tag" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Interests row */}
            <div
              className="reveal mt-6 glass rounded-xl"
              style={{ padding: "20px 24px" }}
            >
              <p
                style={{
                  fontSize:      "0.66rem",
                  fontWeight:    700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color:         "var(--text-3)",
                  marginBottom:  "12px",
                }}
              >
                Outside the Work
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: "⌚", t: "Horology" },
                  { icon: "🏗", t: "Real Estate" },
                  { icon: "📈", t: "Markets" },
                  { icon: "⚙️", t: "Systems & Mechanics" },
                  { icon: "🏋", t: "Fitness" },
                  { icon: "⛵", t: "Boating" },
                  { icon: "⛳", t: "Golf" },
                  { icon: "🔧", t: "Building Things" },
                ].map((it) => (
                  <span
                    key={it.t}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border:     "1px solid rgba(255,255,255,0.07)",
                      fontSize:   "0.8rem",
                      color:      "var(--text-2)",
                    }}
                  >
                    {it.icon} {it.t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CONTACT
        ══════════════════════════════════════════ */}
        <section id="contact" style={{ paddingTop: "96px", paddingBottom: "120px" }}>
          <div className="max-w-3xl mx-auto px-6 text-center reveal">
            <div style={{ marginBottom: "1rem" }}>
              <div
                style={{
                  display:       "inline-flex",
                  alignItems:    "center",
                  gap:           "12px",
                  marginBottom:  "1.5rem",
                }}
              >
                <div style={{ width: "28px", height: "1.5px", background: "var(--gold)" }} />
                <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--gold)" }}>
                  Contact
                </span>
                <div style={{ width: "28px", height: "1.5px", background: "var(--gold)" }} />
              </div>
            </div>

            <h2
              className="serif"
              style={{
                fontSize:     "clamp(2rem, 4vw, 3.2rem)",
                fontWeight:   500,
                color:        "var(--text-1)",
                lineHeight:   1.2,
                marginBottom: "1.25rem",
              }}
            >
              Open to real estate, investing,
              <br />
              and meaningful conversations.
            </h2>
            <p
              style={{
                fontSize:     "1rem",
                lineHeight:   1.8,
                color:        "var(--text-2)",
                maxWidth:     "480px",
                margin:       "0 auto 2.5rem",
              }}
            >
              Whether you&rsquo;re building something interesting in real estate
              PE, running an investment fund, or working on a problem that requires
              sharp analysis and follow-through — let&rsquo;s talk.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <a href="mailto:B.nguyen@yale.edu" className="btn-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </a>
              <a
                href="https://www.linkedin.com/in/brandon-nguyen-246tr"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </div>

            <div
              className="glass rounded-2xl"
              style={{ padding: "24px", display: "inline-grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", width: "100%", maxWidth: "480px" }}
            >
              {[
                { label: "Email",    value: "B.nguyen@yale.edu",  href: "mailto:B.nguyen@yale.edu" },
                { label: "Phone",    value: "(253) 240-5196",     href: "tel:+12532405196"          },
                { label: "Location", value: "Tacoma, WA",         href: null                        },
              ].map((c) => {
                const Tag = c.href ? "a" : "div";
                return (
                  <Tag
                    key={c.label}
                    {...(c.href ? { href: c.href } : {})}
                    style={{
                      textAlign:      "center",
                      textDecoration: "none",
                      padding:        "8px 4px",
                      transition:     "opacity 0.2s",
                      cursor:         c.href ? "pointer" : "default",
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLElement>) => { if (c.href) (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                    onMouseLeave={(e: React.MouseEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "4px" }}>
                      {c.label}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>{c.value}</div>
                  </Tag>
                );
              })}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            padding:      "24px",
            textAlign:    "center",
            fontSize:     "0.72rem",
            color:        "var(--text-3)",
            borderTop:    "1px solid rgba(255,255,255,0.05)",
            background:   "rgba(3,6,16,0.4)",
          }}
        >
          &copy; 2026 Brandon Luu Nguyen &nbsp;·&nbsp; Tacoma, WA &nbsp;·&nbsp;
          Built with precision and purpose.
        </footer>
      </main>
    </div>
  );
}

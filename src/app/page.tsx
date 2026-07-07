"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Leadership", href: "#leadership" },
  { label: "Skills", href: "#skills" },
];

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#about"
          className="text-lg font-semibold tracking-tight"
          style={{ color: "#00356b" }}
        >
          BLN
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-[#00356b] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="mailto:B.nguyen@yale.edu"
            className="text-sm font-medium px-4 py-2 rounded-full text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: "#00356b" }}
          >
            Contact
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 hover:text-[#00356b]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <span
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "#00356b" }}
      >
        {children}
      </span>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-[#00356b] border border-blue-100">
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />

      {/* Hero */}
      <section
        id="about"
        className="min-h-screen flex items-center pt-20"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f0f9ff 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-center">
          {/* Text + Stats */}
          <div>
            <div className="mb-4">
              <Badge>Open to Opportunities</Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight mb-4">
              Brandon
              <br />
              <span style={{ color: "#00356b" }}>Luu Nguyen</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-6 max-w-lg">
              Yale University student studying Economics &amp; Chemistry. Investor, researcher,
              and founder — driven by financial modeling, scientific inquiry, and community impact.
            </p>

            <div className="flex flex-wrap gap-3 mb-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Tacoma, WA
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                B.nguyen@yale.edu
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (253) 240-5196
              </span>
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
              <a
                href="https://www.linkedin.com/in/brandon-nguyen-246tr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#00356b" }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
              <a
                href="mailto:B.nguyen@yale.edu"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 text-sm font-medium transition-colors hover:border-[#00356b] hover:text-[#00356b]"
              >
                Get in Touch
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "3.93", label: "Yale GPA", sub: "Economics & Chemistry" },
                { value: "4.00", label: "TCC GPA", sub: "Perfect Score" },
                { value: "#1", label: "Valedictorian", sub: "Class of 460" },
                { value: "$20K", label: "Scholarship", sub: "Milton Fisher Award" },
              ].map((stat) => (
                <Card key={stat.label} className="text-center">
                  <div className="text-3xl font-bold mb-1" style={{ color: "#00356b" }}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-800">{stat.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.sub}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Photo */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-80 h-96 md:w-96 md:h-[480px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/profile.jpg"
                alt="Brandon Luu Nguyen"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 768px) 320px, 384px"
              />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-black/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section id="education" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>Education</SectionLabel>
          <div className="flex flex-col gap-6">

            <Card>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Yale University</h3>
                  <p className="text-[#00356b] font-medium">New Haven, CT</p>
                </div>
                <span className="text-sm text-slate-500 whitespace-nowrap">Expected May 2029</span>
              </div>
              <p className="text-slate-700 mb-3">
                BA in Economics, BS in Chemistry &mdash;{" "}
                <span className="font-semibold text-slate-900">GPA 3.93 / 4.00</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "UP Fund Investing and Consulting",
                  "Spkyman Foreign Policy Fellow",
                  "Yale Association for Small Claims",
                  "Yale Real Estate Club",
                ].map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Tacoma Community College</h3>
                  <p className="text-[#00356b] font-medium">Tacoma, WA</p>
                </div>
                <span className="text-sm text-slate-500 whitespace-nowrap">May 2025</span>
              </div>
              <p className="text-slate-700 mb-3">
                Associates of Arts, Specification in Biology &mdash;{" "}
                <span className="font-semibold text-slate-900">GPA 4.00 / 4.00</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {["Dean's List 2023–2025", "Student Senator", "Founder, Weightlifting & Fitness Club"].map((a) => (
                  <Badge key={a}>{a}</Badge>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Curtis Senior High School</h3>
                  <p className="text-[#00356b] font-medium">University Place, WA</p>
                </div>
                <span className="text-sm text-slate-500 whitespace-nowrap">May 2025</span>
              </div>
              <p className="text-slate-700">
                <span className="font-semibold text-slate-900">Valedictorian</span> — Ranked 1 of 460 students &mdash; GPA 4.00 / 4.00
              </p>
            </Card>

          </div>
        </div>
      </section>

      {/* Work Experience */}
      <section id="experience" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>Work Experience</SectionLabel>
          <div className="flex flex-col gap-6">

            <Card>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Nordic Partners Investments</h3>
                  <p className="text-[#00356b] font-medium">Incoming Syndication Asset Management Intern</p>
                  <p className="text-sm text-slate-500">Seattle, WA</p>
                </div>
                <span className="text-sm text-slate-500 whitespace-nowrap">May – July 2026</span>
              </div>
              <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#00356b" }} />
                  Underwrote value-add multifamily acquisitions, modeling debt structures, DSCR, exit cap scenarios, and GP fee structures to support offer pricing on deals up to $20M.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#00356b" }} />
                  Ran acquisition pricing scenarios and rent comp analyses across the Seattle submarket, benchmarking against light-renovation value-add theses to validate ROI assumptions.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#00356b" }} />
                  Built an AI-enabled tool that parses property financials, generates 30/60/90-day action plans, and stores data for performance visualization, streamlining quarterly reporting.
                </li>
              </ul>
            </Card>

            <Card>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">P. Fluorescence Genome Research</h3>
                  <p className="text-[#00356b] font-medium">Research Assistant</p>
                  <p className="text-sm text-slate-500">Tacoma, WA</p>
                </div>
                <span className="text-sm text-slate-500 whitespace-nowrap">Jan – May 2025</span>
              </div>
              <ul className="space-y-2 text-slate-700 text-sm leading-relaxed">
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#00356b" }} />
                  Leveraged CRISPR to investigate P. Fluorescence, identifying DNA sequences that suppress a wheat-killing fungus.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#00356b" }} />
                  Conducted research on these sequences, identifying genes that increase production of the DAPG suppressant.
                </li>
              </ul>
            </Card>

          </div>
        </div>
      </section>

      {/* Leadership */}
      <section id="leadership" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>Leadership &amp; Community Involvement</SectionLabel>
          <div className="grid md:grid-cols-2 gap-6">

            <Card>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-slate-900">Urban Philanthropic Fund</h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">Sept 2025–Present</span>
              </div>
              <p className="text-sm text-[#00356b] font-medium mb-3">Analyst · New Haven, CT</p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Conducted valuations of UnitedHealth Group (UNH) to support investment decisions.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Built DCF and Comparable Analysis models to assess market opportunities.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Redistributed returns as grants back to the New Haven community.
                </li>
              </ul>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-slate-900">Urban Philanthropic Consulting</h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">Sept 2025–Present</span>
              </div>
              <p className="text-sm text-[#00356b] font-medium mb-3">Head of Consulting · New Haven, CT</p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Led creation of a financial model projecting future cash flow to enhance decision-making.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Identified 20% revenue growth opportunities through marketing and cost optimization.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Presented to business executives and appointed to follow through in FY 2026.
                </li>
              </ul>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-slate-900">Yale Small Claims Assistance</h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">Dec 2025–Present</span>
              </div>
              <p className="text-sm text-[#00356b] font-medium mb-3">Treasurer · New Haven, CT</p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Aided CT residents with claims assistance, reducing legal information asymmetry.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Mastered Connecticut small claims law and procedures.
                </li>
              </ul>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-slate-900">Math Masters</h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">Aug 2023–2025</span>
              </div>
              <p className="text-sm text-[#00356b] font-medium mb-3">Founder &amp; President · University Place, WA</p>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Founded a gamified algebra course and led a 12-person team.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Engaged 500+ students across 4 high schools and 1 community college.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0 bg-slate-400" />
                  Awarded <span className="font-semibold text-slate-800">$20,000 Milton Fisher Scholarship</span> for Innovation.
                </li>
              </ul>
            </Card>

          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel>Skills &amp; Interests</SectionLabel>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Core Skills
              </h3>
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
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Societies &amp; Memberships
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {[
                  "The Horological Society of New York",
                  "UP Fund Investing and Consulting",
                  "Yale Real Estate Club",
                  "Spkyman Foreign Policy Fellowship",
                ].map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 shadow-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; 2026 Brandon Luu Nguyen. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="mailto:B.nguyen@yale.edu"
              className="text-sm text-slate-500 hover:text-[#00356b] transition-colors"
            >
              B.nguyen@yale.edu
            </a>
            <a
              href="https://www.linkedin.com/in/brandon-nguyen-246tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-500 hover:text-[#00356b] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="tel:2532405196"
              className="text-sm text-slate-500 hover:text-[#00356b] transition-colors"
            >
              (253) 240-5196
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

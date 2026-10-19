import React from 'react';
import Link from 'next/link';
import { LeadForm } from '@/components/LeadForm';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Site Header */}
      <header className="sticky top-0 z-50 bg-deep text-[#EEF4EE] border-b border-white/10 h-[88px] flex items-center">
        <div className="w-[min(1240px,calc(100%-92px))] mx-auto flex items-center justify-between">
          <Link href="#top" className="flex items-center gap-2.5 font-display font-extrabold text-xl tracking-tight">
            <span className="w-[35px] height-[35px] bg-lime text-deep rounded-[9px] grid place-items-center p-1 font-bold">
              ⚡
            </span>
            <span>
              GTM<span className="font-normal text-[#A7CABA]">in</span>Motion<span className="text-lime">.</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-9 text-xs font-semibold text-[#BFCAC7]">
            <a href="#capabilities" className="hover:text-white transition-colors">Expertise</a>
            <a href="#operating-model" className="hover:text-white transition-colors">Our approach</a>
            <a href="#who-we-help" className="hover:text-white transition-colors">Who we help</a>
            <a href="#faq" className="hover:text-white transition-colors">Questions</a>
          </nav>
          <a
            href="#contact"
            className="border border-lime/60 text-lime px-4 py-2.5 rounded text-xs font-bold hover:bg-lime hover:text-deep transition-all"
          >
            Let&apos;s talk growth ↗
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-deep text-[#F6F8F3] py-20 relative overflow-hidden">
        <div className="w-[min(1240px,calc(100%-92px))] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[11px] font-extrabold tracking-[2.5px] text-[#D4E9BB] flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-lime shadow-[0_0_0_4px_rgba(213,238,131,0.15)]" />
              THE NEXT ERA OF GO-TO-MARKET
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
              Make growth<br />
              <em className="not-italic text-lime">a system.</em><br />
              <span className="text-transparent [-webkit-text-stroke:1.2px_#b7c3bc]">Not a scramble.</span>
            </h1>
            <p className="text-base text-[#BCC9C4] leading-relaxed max-w-[505px] mb-8">
              We design and operationalise intelligent go-to-market engines that connect your data, teams and workflows, so enterprise growth moves with precision.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <a
                href="#contact"
                className="inline-flex items-center gap-3 px-6 py-4 rounded bg-lime hover:bg-lime-hover text-ink font-extrabold text-xs transition-transform duration-200 hover:-translate-y-0.5"
              >
                Architect your GTM engine ↗
              </a>
              <a href="#operating-model" className="text-xs font-bold text-[#EBF3ED] hover:text-lime transition-colors">
                See how we work ↗
              </a>
            </div>
          </div>

          <div className="bg-deep-2 border border-[#405650] rounded-xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center text-[9px] font-bold tracking-widest text-[#9CAEAA] mb-4">
              <span>GTM INTELLIGENCE LAYER</span>
              <span className="text-[#A7D69B]">● Connected workflow</span>
            </div>
            <div className="h-64 rounded-lg border border-white/5 bg-deep/50 flex flex-col items-center justify-center p-4 text-center">
              <div className="p-4 bg-[#233333] border border-[#496059] rounded-lg mb-4">
                <span className="text-xs font-bold text-lime block mb-1">AI GTM ORCHESTRATION</span>
                <span className="text-[11px] text-[#A8B9B0]">Connecting Intent + Intelligence to Revenue Execution</span>
              </div>
              <span className="text-[10px] text-[#8DA098]">HUMAN-GOVERNED AI BLUEPRINT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="bg-cream py-24 border-t border-line">
        <div className="w-[min(1240px,calc(100%-92px))] mx-auto">
          <div className="mb-14 max-w-xl">
            <span className="text-[11px] font-extrabold tracking-[2.5px] text-[#5D7166] block mb-2">02 / WHAT WE DO</span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-ink">
              Built for the <em className="not-italic text-sage">complexity</em> of scale.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { num: '01', title: 'GTM strategy & systems architecture', desc: 'Align your growth model, customer journey and technology stack around a clear, measurable operating strategy.', primary: true },
              { num: '02', title: 'AI agents & intelligent automation', desc: 'Turn high-friction manual processes into governed, AI-enabled workflows that extend the capacity of your team.' },
              { num: '03', title: 'Account-based growth systems', desc: 'Identify the right accounts, connect buying signals and coordinate relevant engagement across your revenue teams.' },
              { num: '04', title: 'Revenue operations & integration', desc: 'Connect CRM, marketing and sales workflows to create reliable data flows, operational clarity and a better handoff.' },
            ].map(c => (
              <div
                key={c.num}
                className={`p-6 rounded-lg border transition-all duration-200 hover:-translate-y-1 ${
                  c.primary ? 'bg-lime border-lime' : 'bg-white border-[#E0E5DC]'
                }`}
              >
                <span className="font-extrabold text-xs">{c.num}</span>
                <h3 className="font-display font-extrabold text-xl mt-8 mb-4">{c.title}</h3>
                <p className="text-xs leading-relaxed text-[#677770]">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with Interactive Lead Form */}
      <section id="contact" className="bg-deep text-[#F6F8F3] py-24 relative">
        <div className="w-[min(1240px,calc(100%-92px))] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-[11px] font-extrabold tracking-[2.5px] text-[#B5D4A1] block mb-3">08 / START A CONVERSATION</span>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
              Let&apos;s put your<br />
              GTM <em className="not-italic text-lime">in motion.</em>
            </h2>
            <p className="text-sm text-[#B1C0B7] leading-relaxed max-w-md mb-8">
              Tell us what you&apos;re building, where the friction lives and what better looks like. We&apos;ll start with a focused conversation, not a generic sales pitch.
            </p>
          </div>
          <div>
            <LeadForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0C1415] text-[#EAF0E6] py-12 border-t border-[#293B31]">
        <div className="w-[min(1240px,calc(100%-92px))] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-[#839389]">
          <span>© {new Date().getFullYear()} GTM in Motion. All rights reserved.</span>
          <span>Intelligent B2B Go-To-Market Engineering.</span>
        </div>
      </footer>
    </main>
  );
}


'use client';

import React, { useState, useEffect } from 'react';

const CONSUMER_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'icloud.com', 'aol.com', 'proton.me', 'protonmail.com', 'mail.com'
];

export function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    interest: '',
    message: '',
    _gotcha: '',
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
    referrer: '',
  });

  const [emailHint, setEmailHint] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setFormData(prev => ({
        ...prev,
        utm_source: params.get('utm_source') || '',
        utm_medium: params.get('utm_medium') || '',
        utm_campaign: params.get('utm_campaign') || '',
        utm_term: params.get('utm_term') || '',
        utm_content: params.get('utm_content') || '',
        referrer: document.referrer || 'direct',
      }));
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim().toLowerCase();
    setFormData(prev => ({ ...prev, email: e.target.value }));
    const domain = val.split('@')[1];
    if (domain && CONSUMER_DOMAINS.includes(domain)) {
      setEmailHint('Tip: Please consider using your business email for enterprise priority review.');
    } else {
      setEmailHint('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company || !formData.interest) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        interest: '',
        message: '',
        _gotcha: '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        utm_term: '',
        utm_content: '',
        referrer: '',
      });
      setEmailHint('');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(
        'Submission failed due to a network connection issue. Click the button below to email hello@gtminmotion.com directly.'
      );
    }
  };

  return (
    <div className="bg-[#F5F7F0] text-ink p-8 rounded-xl shadow-lg border border-line">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-display font-extrabold text-2xl tracking-tight text-ink">
          Start the conversation
        </h3>
        <span className="text-xl">↗</span>
      </div>
      <p className="text-xs text-muted mb-7 leading-relaxed">
        Share a few details and we&apos;ll help frame the right next step.
      </p>

      {status === 'success' ? (
        <div className="p-5 bg-[#EDF7ED] border border-[#79C6AD] rounded-lg text-[#173825] text-sm animate-fade-in">
          <p className="font-display font-bold text-base mb-1 text-[#112D1C]">
            ✓ Enquiry received with priority status.
          </p>
          <p>
            Thank you. Our GTM systems architects will review your requirements and reach out within 24 business hours.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-4 text-xs font-bold text-ink underline"
          >
            Submit another enquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot field for bot suppression */}
          <div className="sr-only" aria-hidden="true">
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              value={formData._gotcha}
              onChange={e => setFormData(prev => ({ ...prev, _gotcha: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#41564A] mb-1">
                Full name <span className="text-[#B45942]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2.5 text-xs bg-white text-ink border border-[#D4DED4] rounded focus:outline-none focus:ring-2 focus:ring-[#699D78]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#41564A] mb-1">
                Work email <span className="text-[#B45942]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2.5 text-xs bg-white text-ink border border-[#D4DED4] rounded focus:outline-none focus:ring-2 focus:ring-[#699D78]"
              />
              {emailHint && (
                <span className="block text-[10px] text-[#9B4E18] font-semibold mt-1">
                  {emailHint}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#41564A] mb-1">
              Company <span className="text-[#B45942]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Organisation name"
              value={formData.company}
              onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-3 py-2.5 text-xs bg-white text-ink border border-[#D4DED4] rounded focus:outline-none focus:ring-2 focus:ring-[#699D78]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#41564A] mb-1">
              What would you like to improve? <span className="text-[#B45942]">*</span>
            </label>
            <select
              required
              value={formData.interest}
              onChange={e => setFormData(prev => ({ ...prev, interest: e.target.value }))}
              className="w-full px-3 py-2.5 text-xs bg-white text-ink border border-[#D4DED4] rounded focus:outline-none focus:ring-2 focus:ring-[#699D78]"
            >
              <option value="" disabled>Select a priority</option>
              <option value="AI agents & automation">AI agents &amp; automation</option>
              <option value="GTM strategy & architecture">GTM strategy &amp; architecture</option>
              <option value="Account-based growth">Account-based growth</option>
              <option value="Revenue operations & CRM">Revenue operations &amp; CRM</option>
              <option value="Exploring a wider transformation">Exploring a wider transformation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#41564A] mb-1">
              Tell us about your challenge
            </label>
            <textarea
              rows={3}
              placeholder="What does your GTM team need to solve?"
              value={formData.message}
              onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2.5 text-xs bg-white text-ink border border-[#D4DED4] rounded focus:outline-none focus:ring-2 focus:ring-[#699D78] resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full flex items-center justify-between px-5 py-4 bg-lime text-[#162020] hover:bg-lime-hover font-extrabold text-xs tracking-wide rounded transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>
              {status === 'submitting' ? 'Transmitting enquiry...' : 'Architect your GTM engine'}
            </span>
            <span>↗</span>
          </button>

          {status === 'error' && (
            <div className="p-3 bg-[#FDF2F0] border border-[#E0988A] rounded text-[#5C1F14] text-xs">
              <p>{errorMessage}</p>
              <a
                href={`mailto:hello@gtminmotion.com?subject=GTM in Motion enquiry&body=${encodeURIComponent(
                  `Name: ${formData.name}\nCompany: ${formData.company}\nInterest: ${formData.interest}\nMessage: ${formData.message}`
                )}`}
                className="font-bold underline text-[#A43C24] block mt-1"
              >
                Click here to email hello@gtminmotion.com directly
              </a>
            </div>
          )}

          <p className="text-[10px] text-muted leading-relaxed">
            Direct submission to the GTM in Motion architecture team. Confidentiality and rapid NDA observed.
          </p>
        </form>
      )}
    </div>
  );
}


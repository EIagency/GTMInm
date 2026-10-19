// GTM in Motion — Client-side Navigation & Enterprise Lead Capture System

// 1. Mobile Navigation
const toggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

function closeNav() {
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.setAttribute('aria-label', 'Open navigation');
  if (mobileNav) mobileNav.hidden = true;
}

toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (mobileNav) mobileNav.hidden = !open;
});

mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
window.addEventListener('resize', () => { if (innerWidth > 920) closeNav(); });

// 2. Dynamic Copyright Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// 3. Attribution & UTM Tracking Capture
(function initAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    
    // Store in sessionStorage to persist across page browsing
    utmFields.forEach(field => {
      const val = params.get(field);
      if (val) {
        sessionStorage.setItem(field, val);
      }
      const inputEl = document.getElementById(field);
      if (inputEl) {
        inputEl.value = sessionStorage.getItem(field) || '';
      }
    });

    const refEl = document.getElementById('referrer');
    if (refEl) {
      refEl.value = document.referrer || 'direct';
    }
  } catch (e) {
    // Graceful degradation for restricted browser environments
  }
})();

// 4. Work Email Heuristic Helper
const emailInput = document.getElementById('email');
const emailHint = document.getElementById('email-hint');
const CONSUMER_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
  'icloud.com', 'aol.com', 'proton.me', 'protonmail.com', 'mail.com'
];

emailInput?.addEventListener('input', () => {
  if (!emailHint) return;
  const val = emailInput.value.trim().toLowerCase();
  const domain = val.split('@')[1];
  if (domain && CONSUMER_DOMAINS.includes(domain)) {
    emailHint.textContent = 'Tip: Please consider using your business email for enterprise priority review.';
  } else {
    emailHint.textContent = '';
  }
});

// 5. Enterprise Lead Form Submission Engine
const leadForm = document.getElementById('lead-form');
const submitBtn = document.getElementById('form-submit-btn');
const feedbackEl = document.getElementById('form-feedback');

// Configuration: works with local server (/api/enquiry), Vercel/Netlify functions, or static endpoints (e.g. Formspree/Web3Forms)
const FORM_CONFIG = {
  // Primary endpoint: local server or serverless API route
  endpoint: '/api/enquiry',
  // Optional static fallback endpoint (e.g. 'https://formspree.io/f/your-id' or 'https://api.web3forms.com/submit')
  staticProviderEndpoint: '',
  teamEmail: 'hello@gtminmotion.com'
};

leadForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  if (!leadForm.checkValidity()) {
    leadForm.reportValidity();
    return;
  }

  const formData = new FormData(leadForm);

  // Bot honeypot protection: silently swallow spam bot submissions
  if (formData.get('_gotcha')) {
    feedbackEl.className = 'form-feedback is-success';
    feedbackEl.innerHTML = '<strong>Enquiry received.</strong> Thank you for your interest.';
    leadForm.reset();
    return;
  }

  const payload = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    company: String(formData.get('company') || '').trim(),
    interest: String(formData.get('interest') || '').trim(),
    message: String(formData.get('message') || '').trim(),
    utm_source: String(formData.get('utm_source') || ''),
    utm_medium: String(formData.get('utm_medium') || ''),
    utm_campaign: String(formData.get('utm_campaign') || ''),
    utm_term: String(formData.get('utm_term') || ''),
    utm_content: String(formData.get('utm_content') || ''),
    referrer: String(formData.get('referrer') || document.referrer || 'direct'),
    submitted_at: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  };

  // UI state: Submitting
  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Transmitting enquiry... <span class="spinner-icon" aria-hidden="true"></span>';
  feedbackEl.className = 'form-feedback';
  feedbackEl.textContent = '';

  const endpointToUse = FORM_CONFIG.staticProviderEndpoint || FORM_CONFIG.endpoint;

  try {
    const response = await fetch(endpointToUse, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));

    // UI state: Success
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;
    feedbackEl.className = 'form-feedback is-success';
    feedbackEl.innerHTML = `<strong>✓ Enquiry received with priority status.</strong>
      Thank you, ${escapeHTML(payload.name)}. Our GTM systems architects have received your enquiry for <em>${escapeHTML(payload.company)}</em> and will review your <strong>${escapeHTML(payload.interest)}</strong> requirements within 24 business hours.`;
    
    // Clear inputs
    leadForm.reset();
    if (emailHint) emailHint.textContent = '';

    // Fire standard custom event for analytics integrations (GA4, Segment, Meta, etc.)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'form',
        event_label: payload.interest,
        value: 1
      });
    }
  } catch (err) {
    // UI state: Network or Server Error with intelligent zero-loss fallback
    console.warn('Form transmission failed, rendering direct fallback:', err);
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;

    const subject = `GTM in Motion enquiry — ${payload.company}`;
    const body = `Name: ${payload.name}\nWork email: ${payload.email}\nCompany: ${payload.company}\nPriority: ${payload.interest}\n\nChallenge:\n${payload.message || 'Not specified'}\n\nAttribution: ${payload.utm_source || 'direct'}`;
    const fallbackMailto = `mailto:${FORM_CONFIG.teamEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    feedbackEl.className = 'form-feedback is-error';
    feedbackEl.innerHTML = `<strong>Submission note:</strong> We encountered a network connection issue reaching the API endpoint. Please <a href="${fallbackMailto}">click here to email your enquiry directly to ${FORM_CONFIG.teamEmail}</a> so your information is not lost.`;
  }
});

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

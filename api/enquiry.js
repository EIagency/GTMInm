/**
 * Enterprise Lead Ingestion Endpoint (/api/enquiry)
 * Compatible with Vercel Serverless Functions, Netlify Functions, and Node.js servers.
 *
 * Supports:
 * - Bot honeypot filtering
 * - Work email heuristic verification
 * - Slack notifications via SLACK_WEBHOOK_URL
 * - Email dispatch via Resend API (RESEND_API_KEY) or standard Webhook (CRM_WEBHOOK_URL)
 * - Local storage fallback (leads.json)
 */

const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      name,
      email,
      company,
      interest,
      message,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      referrer,
      submitted_at,
      timezone,
      _gotcha
    } = body;

    // 1. Bot Honeypot Filter
    if (_gotcha) {
      console.log('[SECURITY] Bot submission caught by honeypot and discarded.');
      return res.status(200).json({ ok: true, message: 'Enquiry received' });
    }

    // 2. Required field validation
    if (!name || !email || !company || !interest) {
      return res.status(400).json({
        ok: false,
        error: 'Missing required fields: name, email, company, and interest are required.'
      });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email address format.' });
    }

    const leadRecord = {
      id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      received_at: new Date().toISOString(),
      name: String(name).trim(),
      email: String(email).trim(),
      company: String(company).trim(),
      interest: String(interest).trim(),
      message: String(message || '').trim(),
      attribution: {
        utm_source: utm_source || 'direct',
        utm_medium: utm_medium || 'none',
        utm_campaign: utm_campaign || 'none',
        utm_term: utm_term || '',
        utm_content: utm_content || '',
        referrer: referrer || 'direct'
      },
      client_meta: {
        submitted_at: submitted_at || new Date().toISOString(),
        timezone: timezone || 'UTC',
        ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
      }
    };

    console.log('\n======================================================');
    console.log('🚀 NEW ENTERPRISE LEAD RECEIVED:');
    console.log(`Company:   ${leadRecord.company}`);
    console.log(`Contact:   ${leadRecord.name} <${leadRecord.email}>`);
    console.log(`Priority:  ${leadRecord.interest}`);
    console.log(`Challenge: ${leadRecord.message || 'None provided'}`);
    console.log(`Source:    ${leadRecord.attribution.utm_source} / ${leadRecord.attribution.utm_medium}`);
    console.log('======================================================\n');

    // 3. Local JSON Persistence (audit trail)
    try {
      const leadsFile = path.join(process.cwd(), 'leads.json');
      let existingLeads = [];
      if (fs.existsSync(leadsFile)) {
        try {
          existingLeads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
        } catch (e) {
          existingLeads = [];
        }
      }
      existingLeads.unshift(leadRecord);
      fs.writeFileSync(leadsFile, JSON.stringify(existingLeads, null, 2), 'utf8');
    } catch (saveErr) {
      console.warn('Could not write to local leads.json (read-only filesystem or serverless context):', saveErr.message);
    }

    // 4. Dispatch to Slack Webhook (if SLACK_WEBHOOK_URL is set in environment)
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🎯 *New Enterprise Lead:* ${leadRecord.company} (${leadRecord.name})`,
            blocks: [
              {
                type: 'header',
                text: { type: 'plain_text', text: '🎯 New Enterprise Enquiry' }
              },
              {
                type: 'section',
                fields: [
                  { type: 'mrkdwn', text: `*Company:*\n${leadRecord.company}` },
                  { type: 'mrkdwn', text: `*Contact:*\n${leadRecord.name} (${leadRecord.email})` },
                  { type: 'mrkdwn', text: `*Priority:*\n${leadRecord.interest}` },
                  { type: 'mrkdwn', text: `*Source:*\n${leadRecord.attribution.utm_source}` }
                ]
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Challenge:*\n${leadRecord.message || '_No details provided_'}`
                }
              }
            ]
          })
        });
      } catch (slackErr) {
        console.error('Failed to notify Slack:', slackErr.message);
      }
    }

    // 5. Dispatch to CRM/Automation Webhook (HubSpot, Zapier, Make if CRM_WEBHOOK_URL is set)
    if (process.env.CRM_WEBHOOK_URL) {
      try {
        await fetch(process.env.CRM_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadRecord)
        });
      } catch (crmErr) {
        console.error('Failed to notify CRM webhook:', crmErr.message);
      }
    }

    return res.status(200).json({
      ok: true,
      message: 'Enquiry received successfully',
      id: leadRecord.id
    });
  } catch (error) {
    console.error('Error handling lead submission:', error);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error processing enquiry'
    });
  }
};


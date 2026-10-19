import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      _gotcha,
    } = body;

    // 1. Silent Honeypot Guard
    if (_gotcha) {
      return NextResponse.json({ ok: true, message: 'Enquiry received' }, { status: 200 });
    }

    // 2. Field Validation
    if (!name || !email || !company || !interest) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const leadRecord = {
      id: `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      received_at: new Date().toISOString(),
      name,
      email,
      company,
      interest,
      message: message || '',
      attribution: {
        utm_source: utm_source || 'direct',
        utm_medium: utm_medium || 'none',
        utm_campaign: utm_campaign || 'none',
        utm_term: utm_term || '',
        utm_content: utm_content || '',
        referrer: referrer || 'direct',
      },
    };

    // 3. Slack Webhook Dispatch (if configured)
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await fetch(process.env.SLACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🎯 *New Enterprise Lead:* ${company} (${name})`,
            blocks: [
              {
                type: 'header',
                text: { type: 'plain_text', text: '🎯 New Enterprise Enquiry' },
              },
              {
                type: 'section',
                fields: [
                  { type: 'mrkdwn', text: `*Company:*\n${company}` },
                  { type: 'mrkdwn', text: `*Contact:*\n${name} (${email})` },
                  { type: 'mrkdwn', text: `*Priority:*\n${interest}` },
                  { type: 'mrkdwn', text: `*Source:*\n${leadRecord.attribution.utm_source}` },
                ],
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Challenge:*\n${message || '_No description provided_'}`,
                },
              },
            ],
          }),
        });
      } catch (slackError) {
        console.error('Slack webhook failed:', slackError);
      }
    }

    // 4. CRM Webhook Dispatch (HubSpot, Zapier, Make if configured)
    if (process.env.CRM_WEBHOOK_URL) {
      try {
        await fetch(process.env.CRM_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadRecord),
        });
      } catch (crmError) {
        console.error('CRM webhook dispatch failed:', crmError);
      }
    }

    return NextResponse.json(
      { ok: true, message: 'Enquiry received successfully', id: leadRecord.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error processing enquiry' },
      { status: 500 }
    );
  }
}


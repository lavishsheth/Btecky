const TO_EMAIL = 'lavishsheth122@gmail.com';
const MAX_FIELD_LENGTH = 5000;

function clean(value, max = MAX_FIELD_LENGTH) {
  return String(value || '').trim().slice(0, max);
}
function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}
function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Please submit the contact form using the Send message button.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    // Quietly accept bot submissions without sending email.
    if (clean(body.website, 200)) return res.status(200).json({ ok: true });

    const name = clean(body.name, 100);
    const email = clean(body.email, 254);
    const topic = clean(body.topic, 140);
    const organization = clean(body.organization, 120);
    const subject = clean(body.subject, 140);
    const message = clean(body.message, MAX_FIELD_LENGTH);

    if (name.length < 2) return res.status(400).json({ ok: false, error: 'Please enter your name.' });
    if (!validEmail(email)) return res.status(400).json({ ok: false, error: 'Please enter a valid email address so I can reply.' });
    if (!topic) return res.status(400).json({ ok: false, error: 'Please choose what your message is about.' });
    if (message.length < 10) return res.status(400).json({ ok: false, error: 'Please add a little more detail to your message (at least 10 characters).' });

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) {
      console.error('Contact email is not configured: set RESEND_API_KEY and RESEND_FROM_EMAIL in Vercel.');
      return res.status(503).json({ ok: false, error: 'The contact form is temporarily unavailable. Please email lavishsheth122@gmail.com directly.' });
    }

    const emailSubject = '[B Tecky Contact] ' + topic + (subject ? ' — ' + subject : '');
    const plainText = [
      'New message from the B Tecky contact form',
      '',
      'Name: ' + name,
      'Email: ' + email,
      'Topic: ' + topic,
      'Organization: ' + (organization || 'Not provided'),
      'Subject: ' + (subject || 'Not provided'),
      '',
      'Message:',
      message
    ].join('\n');
    const html = '<h2>New B Tecky contact message</h2>' +
      '<p><strong>Name:</strong> ' + escapeHtml(name) + '</p>' +
      '<p><strong>Email:</strong> ' + escapeHtml(email) + '</p>' +
      '<p><strong>Topic:</strong> ' + escapeHtml(topic) + '</p>' +
      '<p><strong>Organization:</strong> ' + escapeHtml(organization || 'Not provided') + '</p>' +
      '<p><strong>Subject:</strong> ' + escapeHtml(subject || 'Not provided') + '</p>' +
      '<h3>Message</h3><p style="white-space:pre-wrap">' + escapeHtml(message) + '</p>';

    const providerResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [TO_EMAIL],
        reply_to: email,
        subject: emailSubject,
        text: plainText,
        html
      })
    });
    const providerBody = await providerResponse.json().catch(() => ({}));
    if (!providerResponse.ok) {
      console.error('Resend contact email failed:', providerResponse.status, providerBody);
      return res.status(502).json({ ok: false, error: 'Your message could not be delivered right now. Please try again or email me directly.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ ok: false, error: 'Something went wrong while sending your message. Please try again or email me directly.' });
  }
};

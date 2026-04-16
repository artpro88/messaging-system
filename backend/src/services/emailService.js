import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

export const sendEmail = async (to, subject, htmlContent, textContent) => {
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured');
    return { id: `mock-${Date.now()}`, status: 'mocked' };
  }

  try {
    const response = await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        personalizations: [
          {
            to: [{ email: to }],
            subject: subject,
          },
        ],
        from: { email: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com' },
        content: [
          {
            type: 'text/plain',
            value: textContent || 'No text content',
          },
          {
            type: 'text/html',
            value: htmlContent || '<p>No HTML content</p>',
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return { id: response.headers['x-message-id'], status: 'sent' };
  } catch (error) {
    console.error('SendGrid error:', error.response?.data || error.message);
    throw error;
  }
};

// Parse incoming email webhook from SendGrid
export const parseIncomingEmail = (data) => {
  return {
    from: data.from,
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
    externalId: data.message_id,
  };
};


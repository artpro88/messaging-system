import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

const AUTH = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

export const sendSMS = async (to, message) => {
  if (!TWILIO_ACCOUNT_SID) {
    console.warn('Twilio not configured');
    return { sid: `mock-${Date.now()}`, status: 'mocked' };
  }

  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        From: TWILIO_PHONE_NUMBER,
        To: to,
        Body: message,
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${AUTH}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return { sid: response.data.sid, status: 'sent' };
  } catch (error) {
    console.error('Twilio SMS error:', error.response?.data || error.message);
    throw error;
  }
};

export const sendWhatsApp = async (to, message) => {
  if (!TWILIO_ACCOUNT_SID) {
    console.warn('Twilio not configured');
    return { sid: `mock-${Date.now()}`, status: 'mocked' };
  }

  try {
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
        To: `whatsapp:${to}`,
        Body: message,
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${AUTH}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return { sid: response.data.sid, status: 'sent' };
  } catch (error) {
    console.error('Twilio WhatsApp error:', error.response?.data || error.message);
    throw error;
  }
};

// Parse incoming SMS/WhatsApp webhook from Twilio
export const parseIncomingSMS = (data) => {
  return {
    from: data.From,
    to: data.To,
    message: data.Body,
    externalId: data.MessageSid,
  };
};


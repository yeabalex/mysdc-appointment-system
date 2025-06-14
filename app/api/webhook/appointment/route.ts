// app/api/webhook/appointment/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Environment variables you'll need to set:
// TELEGRAM_BOT_TOKEN - Your bot token from @BotFather
// TELEGRAM_CHAT_ID - The chat/group ID where messages will be sent
// BASE_URL - Your application's base URL

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const BASE_URL = process.env.BASE_URL || 'https://yourapp.com';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { appointmentId } = body;

    // Validate required fields
    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return NextResponse.json(
        { error: 'Telegram bot configuration missing' },
        { status: 500 }
      );
    }

    // Create the appointment details URL
    const appointmentUrl = `${BASE_URL}/admin`;
    
    // Format the current date and time
    const currentDateTime = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Prepare the message
    const message = `Hello Dr Shimeles! You have got a new Appointment on ${currentDateTime}. Please visit ${appointmentUrl} to get more details.`;

    // Send message to Telegram
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Telegram API Error:', telegramData);
      return NextResponse.json(
        { error: 'Failed to send Telegram message', details: telegramData },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Appointment notification sent successfully',
      appointmentId,
      telegramMessageId: telegramData.result.message_id,
      sentAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

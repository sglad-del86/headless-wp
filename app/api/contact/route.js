import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message, recaptchaToken, honeypot, startTime } = body;

    // 1. Honeypot check (Bots fill this, humans don't)
    if (honeypot) {
      return NextResponse.json({ message: 'Spam detected' }, { status: 400 });
    }

    // 2. Simple time check (Bots fill form in < 3 seconds)
    const timeTaken = (Date.now() - startTime) / 1000;
    if (timeTaken < 3) {
      return NextResponse.json({ message: 'Too fast. Please take your time.' }, { status: 400 });
    }

    // 3. Verify reCAPTCHA v3
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    
    const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
    const recaptchaJson = await recaptchaRes.json();

    if (!recaptchaJson.success || recaptchaJson.score < 0.5) {
      return NextResponse.json({ message: 'Security check failed. Please try again.' }, { status: 400 });
    }

    // 4. Send Email (Backend Logic)
    // NOTE: In a real production environment, you would use Nodemailer, SendGrid, or Resend here.
    // For now, we simulate success and log the data.
    console.log('--- NEW CONTACT FORM SUBMISSION ---');
    console.log(`To: tomo81222chapu@gmail.com`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Message: ${message}`);
    console.log('------------------------------------');

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

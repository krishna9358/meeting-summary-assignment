import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { formatEmailContent, EMAIL_TEMPLATE } from '../../templates/emailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("from email", process.env.FROM_EMAIL);
console.log("resend api key", process.env.RESEND_API_KEY);


export async function POST(req: Request) {
  try {
    const { to, body, subject } = await req.json();

    if (!to || !body) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const recipients = to.split(',').map((r: string) => r.trim());
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    // Use HTML template for better formatting
    const htmlContent = formatEmailContent(body, 'html', currentDate);
    const emailSubject = subject || EMAIL_TEMPLATE.subject(currentDate);

    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: recipients,
      subject: emailSubject,
      html: htmlContent,
    });
    console.log("from email", process.env.FROM_EMAIL);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Email failed' }, { status: 500 });
  }
}
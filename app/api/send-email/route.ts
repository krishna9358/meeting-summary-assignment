import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("from email", process.env.FROM_EMAIL);
console.log("resend api key", process.env.RESEND_API_KEY);


export async function POST(req: Request) {
  try {
    const { to, body, subject} = await req.json();

    if (!to || !body) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const recipients = to.split(',').map((r: string) => r.trim());

    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: recipients,
      subject: subject || 'Meeting Summary',
      text: body,
    });
    console.log("from email", process.env.FROM_EMAIL);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Email failed' }, { status: 500 });
  }
}
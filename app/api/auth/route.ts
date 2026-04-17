import { getUserByPhone, getUserByEmail, createUser, getUsers } from '@/lib/db';

export const dynamic = 'force-dynamic';

// In-memory OTP store (resets on server restart — acceptable for local dev)
const otpStore = new Map<string, { otp: string; expires: number }>();

export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;

  // ── Send OTP ─────────────────────────────────────────────────────────────
  if (action === 'send-otp') {
    const { phone } = body;
    if (!phone) return Response.json({ error: 'Phone required' }, { status: 400 });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 }); // 5 min
    // In production: send via Twilio/MSG91. For dev we expose the OTP.
    console.log(`[OTP] ${phone}: ${otp}`);
    return Response.json({ success: true, devOtp: otp }); // Remove devOtp in production
  }

  // ── Verify OTP & Login ───────────────────────────────────────────────────
  if (action === 'verify-otp') {
    const { phone, otp, name, email } = body;
    const entry = otpStore.get(phone);
    if (!entry) return Response.json({ error: 'OTP not found. Request again.' }, { status: 400 });
    if (Date.now() > entry.expires) return Response.json({ error: 'OTP expired.' }, { status: 400 });
    if (entry.otp !== otp) return Response.json({ error: 'Invalid OTP.' }, { status: 401 });

    otpStore.delete(phone);

    let user = getUserByPhone(phone);
    if (!user) {
      // New user — register
      user = createUser({
        id: 'u' + Date.now(),
        name: name || 'Customer',
        email: email || '',
        phone,
        alternatePhone: '',
        membership: 'Standard',
        loyaltyPoints: 0,
        avatar: '',
        addresses: [],
        role: 'customer',
        createdAt: new Date().toISOString(),
        approved: true,
      });
    }

    const { password: _, ...safeUser } = user as typeof user & { password?: string };
    return Response.json({ success: true, user: safeUser });
  }

  // ── Admin Login ──────────────────────────────────────────────────────────
  if (action === 'admin-login') {
    const { email, password } = body;
    const users = getUsers();
    const admin = users.find((u) => u.email === email && u.role === 'admin');
    if (!admin || (admin as typeof admin & { password?: string }).password !== password) {
      return Response.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    const { password: _, ...safeAdmin } = admin as typeof admin & { password?: string };
    return Response.json({ success: true, user: safeAdmin });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
}

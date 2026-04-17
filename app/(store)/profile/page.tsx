'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import {
  User, Phone, Mail, MapPin, Edit3, Save, Star, Package,
  ShoppingBag, Crown, Gift, Plus, Trash2, X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [altPhone, setAltPhone] = useState('');

  if (!user) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <User size={48} className="text-slate-200 mx-auto mb-4" />
      <h1 className="text-2xl font-black text-slate-800 mb-4">My Profile</h1>
      <p className="text-slate-500 mb-6">Please log in to view your profile.</p>
      <Link href="/login" className="btn-primary px-8 py-3 text-base inline-flex">Login / Sign Up</Link>
    </div>
  );

  const handleSave = async () => {
    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, name, email }),
      });
      login({ ...user, name, email });
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Update failed.');
    }
  };

  const membershipConfig = {
    Standard: { color: 'membership-standard', icon: '🥉', benefit: 'No membership benefits', upgrade: 'Upgrade to Prime for 5% off every order!' },
    Prime: { color: 'membership-prime', icon: '⭐', benefit: '5% off on all orders', upgrade: 'Upgrade to VIP for 10% off and priority delivery!' },
    VIP: { color: 'membership-vip', icon: '👑', benefit: '10% off + Priority Delivery', upgrade: "You're at our highest tier! Enjoy exclusive benefits." },
  }[user.membership];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="section-title mb-7">My Profile</h1>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-3xl font-black text-green-700">
              {user.name[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-black text-xl text-slate-900">{user.name}</h2>
              <p className="text-slate-400 text-sm">{user.phone}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${membershipConfig.color}`}>
                {membershipConfig.icon} {user.membership} Member
              </span>
            </div>
          </div>
          <button
            onClick={() => editing ? handleSave() : setEditing(true)}
            className={editing ? 'btn-primary' : 'btn-outline'}
          >
            {editing ? <><Save size={15} /> Save</> : <><Edit3 size={15} /> Edit</>}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
            {editing ? (
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
            ) : (
              <p className="font-medium text-slate-800 flex items-center gap-2"><User size={14} className="text-slate-400" />{user.name}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Phone</label>
            <p className="font-medium text-slate-800 flex items-center gap-2"><Phone size={14} className="text-slate-400" />{user.phone}</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
            {editing ? (
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="your@email.com" />
            ) : (
              <p className="font-medium text-slate-800 flex items-center gap-2">
                <Mail size={14} className="text-slate-400" />
                {user.email || <span className="text-slate-400 italic">Not set</span>}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Loyalty Points</label>
            <p className="font-bold text-amber-600 flex items-center gap-2"><Gift size={14} /> {user.loyaltyPoints} Points</p>
          </div>
        </div>
      </div>

      {/* Membership */}
      <div className={`rounded-2xl border p-5 mb-6 ${
        user.membership === 'VIP' ? 'bg-violet-50 border-violet-200' :
        user.membership === 'Prime' ? 'bg-amber-50 border-amber-200' :
        'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">{membershipConfig.icon}</div>
          <div>
            <h3 className="font-bold text-slate-800">{user.membership} Membership</h3>
            <p className="text-sm text-slate-500">{membershipConfig.benefit}</p>
          </div>
        </div>
        <p className="text-sm text-slate-600">{membershipConfig.upgrade}</p>
        {user.membership !== 'VIP' && (
          <button className="btn-accent mt-3 text-sm py-2"><Crown size={15} /> Upgrade Membership</button>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { icon: ShoppingBag, label: 'My Orders', href: '/orders', color: 'bg-green-50 text-green-700 border-green-200' },
          { icon: MapPin, label: 'Addresses', href: '#', color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { icon: Star, label: 'My Reviews', href: '#', color: 'bg-amber-50 text-amber-700 border-amber-200' },
        ].map(({ icon: Icon, label, href, color }) => (
          <Link key={label} href={href}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${color} hover:shadow-sm transition-shadow text-sm font-semibold`}>
            <Icon size={22} />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}

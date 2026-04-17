'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Crown, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(data => { setCustomers(data); setLoading(false); });
  }, []);

  const handleMembershipChange = async (id: string, membership: string) => {
    try {
      await fetch(`/api/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, membership }),
      });
      setCustomers(c => c.map(user => user.id === id ? { ...user, membership } : user));
      toast.success('Membership updated');
    } catch {
      toast.error('Failed to update');
    }
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="text-purple-600" /> Customers
          </h1>
          <p className="text-slate-500 text-sm mt-1">{customers.length} registered customers</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search Name or Phone" className="input-field pl-9 py-2 text-sm w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Customer Details</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4 text-center">Membership</th>
                <th className="px-6 py-4 text-right">Loyalty Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Loading customers...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">No customers found.</td></tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-700">
                        {user.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="flex items-center gap-1.5 text-slate-700"><Phone size={14} className="text-slate-400"/> {user.phone}</p>
                      <p className="flex items-center gap-1.5 text-slate-500 text-xs mt-1"><Mail size={14} className="text-slate-400"/> {user.email || '—'}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select 
                        value={user.membership}
                        onChange={(e) => handleMembershipChange(user.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${
                          user.membership === 'VIP' ? 'bg-violet-50 text-violet-700 border-violet-200' :
                          user.membership === 'Prime' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Standard">Standard</option>
                        <option value="Prime">Prime</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{user.loyaltyPoints}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

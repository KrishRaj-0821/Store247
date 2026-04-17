'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Search, ChevronDown, Bell, CheckCircle, Clock, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); });
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      toast.success(`Order ${newStatus}!`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = orders.filter(o => {
    if (filter !== 'All' && o.status !== filter) return false;
    if (search && !o.orderNumber.toLowerCase().includes(search.toLowerCase()) && !o.address.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingCart className="text-green-600" /> Orders
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track customer orders</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search ID or Name" className="input-field pl-9 py-2 text-sm w-48"
            />
          </div>
          <select 
            value={filter} onChange={e => setFilter(e.target.value)}
            className="input-field py-2 text-sm w-36 font-semibold"
          >
            <option value="All">All Status</option>
            <option value="Placed">Placed</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Order Details</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Loading orders...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">No orders found matching filters.</td></tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{order.orderNumber}</p>
                      <p className="text-xs text-slate-400 mt-1">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                      <p className="text-sm font-semibold text-green-700 mt-2">₹{order.total.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{order.items.length} items • {order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{order.address.name}</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-[200px] truncate">{order.address.line1}, {order.address.city}</p>
                      <p className="text-xs text-slate-400">{order.address.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1.5 rounded-lg border outline-none cursor-pointer ${
                          order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download Invoice">
                         <FileText size={16} />
                       </button>
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

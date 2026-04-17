'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Users, IndianRupee, TrendingUp, TrendingDown, Clock, CheckCircle, ScanLine, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    // In a real app we'd have a specific /api/admin/stats route.
    // Here we'll fetch orders, products, and users and compute stats locally.
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
      fetch('/api/users').then(r => r.json()),
    ]).then(([orders, products, users]) => {
      const today = new Date().toISOString().split('T')[0];
      const todaysOrders = orders.filter((o: any) => o.createdAt.startsWith(today));
      const revenue = todaysOrders.reduce((sum: number, o: any) => sum + o.total, 0);
      
      setStats({
        revenue,
        orders: todaysOrders.length,
        totalProducts: products.length,
        totalUsers: users.length,
      });
      setRecentOrders(orders.slice(0, 5));
    });
  }, []);

  if (!stats) return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
      <div className="skeleton h-96 rounded-2xl" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Here's what's happening in your store today.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: "Today's Revenue", value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: IndianRupee, trend: '+12%', color: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/20' },
          { label: "Today's Orders", value: stats.orders.toString(), icon: ShoppingCart, trend: '+5%', color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
          { label: 'Total Products', value: stats.totalProducts.toString(), icon: Package, trend: '2 new', color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
          { label: 'Total Customers', value: stats.totalUsers.toString(), icon: Users, trend: '+18 this month', color: 'from-purple-500 to-violet-600', shadow: 'shadow-purple-500/20' },
        ].map((k) => (
          <div key={k.label} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${k.color} p-6 text-white shadow-lg ${k.shadow} hover:-translate-y-1 transition-transform`}>
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <k.icon size={64} />
            </div>
            <div className="relative z-10">
              <p className="text-white/80 font-medium text-sm mb-1">{k.label}</p>
              <h3 className="text-3xl font-black mb-4">{k.value}</h3>
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                {k.trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {k.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-green-600 hover:text-green-700 font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-800">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status === 'Delivered' ? <CheckCircle size={12} /> : <Clock size={12} />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ₹{order.total.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="space-y-2.5">
              <Link href="/admin/bill-scanner" className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 hover:border-green-400 hover:bg-green-50 hover:text-green-700 transition-colors font-medium text-slate-700 group">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <ScanLine size={16} />
                </div>
                Scan Wholesale Bill
              </Link>
              <Link href="/admin/products" className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium text-slate-700 group">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Package size={16} />
                </div>
                Manage Products
              </Link>
              <Link href="/admin/community" className="flex items-center gap-3 w-full p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 transition-colors font-medium text-slate-700 group">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <MessageSquare size={16} />
                </div>
                Post Announcement
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-sm p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
              <ScanLine size={120} />
            </div>
            <div className="relative z-10">
              <span className="inline-block px-2 py-1 bg-amber-400/20 text-amber-400 font-bold text-[10px] rounded mb-3 border border-amber-400/30 tracking-widest uppercase">
                AI FEATURE
              </span>
              <h3 className="font-bold text-lg mb-2 leading-tight">Automate Pricing</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Upload bills from wholesale suppliers. Our AI will extract items & update your store prices automatically.
              </p>
              <Link href="/admin/bill-scanner" className="text-sm font-semibold text-green-400 hover:text-green-300 flex items-center gap-1 group">
                Try Scanner Now <TrendingUp size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

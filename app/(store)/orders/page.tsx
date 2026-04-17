'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Package, CheckCircle, Clock, Truck, MapPin, ChevronDown, ChevronUp, Download } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: string; userId: string; orderNumber: string;
  status: string; items: { productId: string; name: string; price: number; qty: number; unit: string }[];
  subtotal: number; deliveryFee: number; total: number; paymentMethod: string;
  address: { name: string; phone: string; line1: string; city: string; state: string; pincode: string };
  timeline: { status: string; time: string }[];
  createdAt: string;
}

const STATUS_STEPS = ['Placed', 'Confirmed', 'Dispatched', 'Out for Delivery', 'Delivered'];

function StatusTimeline({ timeline, status }: { timeline: Order['timeline']; status: string }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="flex gap-0">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        const event = timeline.find((t) => t.status === step);
        return (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 z-10 text-xs font-bold transition-all ${
              done ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 text-slate-300'
            } ${active ? 'ring-4 ring-green-100' : ''}`}>
              {done ? <CheckCircle size={14} /> : i + 1}
            </div>
            <p className={`text-[10px] font-semibold mt-1.5 text-center leading-tight ${done ? 'text-green-700' : 'text-slate-400'}`}>{step}</p>
            {event && <p className="text-[9px] text-slate-400 mt-0.5 text-center">{new Date(event.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>}
            {i < STATUS_STEPS.length - 1 && (
              <div className="absolute" style={{ display: 'none' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <p className="font-bold text-slate-800">{order.orderNumber}</p>
            <p className="text-xs text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
              order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            }`}>{order.status}</span>
            <p className="font-bold text-green-700 mt-1">₹{order.total.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Timeline */}
        {order.status !== 'Cancelled' && (
          <div className="relative mb-4">
            <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-slate-100 mx-3.5 z-0" />
            <StatusTimeline timeline={order.timeline} status={order.status} />
          </div>
        )}

        {/* Item previews */}
        <p className="text-sm text-slate-600">{order.items.map((i) => `${i.name} × ${i.qty}`).join(', ')}</p>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 font-medium mt-3 transition-colors"
        >
          {expanded ? <><ChevronUp size={15} /> Hide Details</> : <><ChevronDown size={15} /> View Details</>}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50 animate-fade-in space-y-4">
          {/* Address */}
          <div className="flex gap-2">
            <MapPin size={15} className="text-slate-400 mt-0.5 shrink-0" />
            <div className="text-sm text-slate-600">
              <p className="font-semibold text-slate-800">{order.address.name}</p>
              <p>{order.address.line1}, {order.address.city}, {order.address.state} — {order.address.pincode}</p>
              <p>{order.address.phone}</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-600">{item.name} × {item.qty} ({item.unit})</span>
                <span className="font-semibold text-slate-800">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm border-t border-slate-200 pt-2 font-bold text-slate-900">
              <span>Total (incl. ₹{order.deliveryFee} delivery)</span>
              <span>₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Payment: <strong>{order.paymentMethod}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch(`/api/orders?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); });
  }, [user]);

  if (!user) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-black text-slate-800 mb-4">Track Your Orders</h1>
      <p className="text-slate-500 mb-6">Please log in to view your order history.</p>
      <Link href="/login" className="btn-primary px-8 py-3 text-base inline-flex">Login / Sign Up</Link>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-7">
        <Package size={24} className="text-green-600" />
        <h1 className="section-title">My Orders</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <Truck size={48} className="text-slate-200 mx-auto mb-4" />
          <h2 className="font-bold text-slate-600 mb-2">No orders yet</h2>
          <p className="text-slate-400 text-sm mb-6">Start shopping to place your first order.</p>
          <Link href="/products" className="btn-primary inline-flex">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </div>
  );
}

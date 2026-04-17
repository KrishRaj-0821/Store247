'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { CreditCard, Smartphone, Wallet, Banknote, CheckCircle, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Pay via any UPI app' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Debit / Credit card' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, desc: 'Paytm, PhonePe, etc.' },
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when delivered' },
];

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('854318');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (items.length === 0 && !placed) {
    router.push('/cart');
    return null;
  }

  const handlePlace = async () => {
    if (!name || !phone || !address || !city) {
      toast.error('Please fill all delivery details.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'guest',
          status: 'Placed',
          items: items.map((i) => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty, unit: i.unit })),
          subtotal,
          deliveryFee,
          discount: 0,
          total,
          paymentMethod,
          address: { name, phone, line1: address, city, state: 'Bihar', pincode },
        }),
      });
      const order = await res.json();
      clearCart();
      setOrderId(order.orderNumber);
      setPlaced(true);
      toast.success('Order placed successfully! 🎉');
    } catch {
      toast.error('Failed to place order. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (placed) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce-in">
        <CheckCircle size={40} className="text-green-600" />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-2">Order Placed! 🎉</h1>
      <p className="text-slate-500 mb-2">Order number: <strong className="text-green-700">{orderId}</strong></p>
      <p className="text-slate-500 mb-8">You'll receive updates via SMS. Thank you for shopping with S. K. General STORE!</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => router.push('/orders')} className="btn-primary px-8 py-3 text-base">Track My Order</button>
        <button onClick={() => router.push('/products')} className="btn-outline px-8 py-3 text-base">Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="section-title mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Delivery & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Details */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-5">
              <MapPin size={18} className="text-green-600" /> Delivery Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Full Name *</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Phone Number *</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="10-digit mobile" maxLength={10} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Address *</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" placeholder="House/Flat, Street, Locality" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">City *</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} className="input-field" placeholder="City" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Pincode</label>
                <input value={pincode} onChange={(e) => setPincode(e.target.value)} className="input-field" placeholder="854318" maxLength={6} />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-5">
              <CreditCard size={18} className="text-green-600" /> Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === id
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-green-300 hover:bg-green-50/50'
                  }`}
                  id={`payment-${id}`}
                >
                  <Icon size={20} className={paymentMethod === id ? 'text-green-600' : 'text-slate-500'} />
                  <p className={`font-semibold text-sm mt-2 ${paymentMethod === id ? 'text-green-700' : 'text-slate-700'}`}>{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-slate-800 mb-4">Order Summary</h2>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-600 truncate max-w-[160px]">{item.name} × {item.qty}</span>
                  <span className="font-semibold text-slate-800">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-slate-900 border-t border-slate-100 pt-3">
                <span>Total</span>
                <span className="text-green-700">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button
              id="place-order-btn"
              onClick={handlePlace}
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5 mt-5"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Placing Order…</> : `Place Order — ₹${total.toLocaleString('en-IN')}`}
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">🔒 Secure & Encrypted Checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Trash2, ShoppingBag, ChevronRight, Package, Truck, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, deliveryFee, total, clearCart } = useCart();

  if (items.length === 0) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
        <Package size={40} className="text-slate-300" />
      </div>
      <h1 className="text-2xl font-black text-slate-800 mb-2">Your cart is empty</h1>
      <p className="text-slate-500 mb-8">Looks like you have not added any products yet.</p>
      <Link href="/products" className="btn-primary text-base px-8 py-3 inline-flex">
        <ShoppingBag size={18} /> Browse Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/products" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="section-title">Shopping Cart</h1>
        <span className="badge-primary">{items.length} item{items.length > 1 ? 's' : ''}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex gap-4 animate-fade-in">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🛒</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{item.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{item.unit}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="qty-btn" aria-label="Decrease">−</button>
                    <span className="font-bold w-8 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="qty-btn" aria-label="Increase">+</button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700 text-lg">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-400">₹{item.price} each</p>
                  </div>
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start" aria-label="Remove">
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 mt-2">
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-24">
            <h2 className="font-bold text-slate-800 text-lg mb-5">Order Summary</h2>

            {/* Delivery progress */}
            {subtotal < 1500 && (
              <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={15} className="text-amber-600" />
                  <span className="text-sm font-semibold text-amber-700">
                    Add ₹{(1500 - subtotal).toLocaleString('en-IN')} for FREE delivery!
                  </span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (subtotal / 1500) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {subtotal >= 1500 && (
              <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <span className="text-sm font-semibold text-green-700">FREE Delivery Applied!</span>
              </div>
            )}

            <div className="space-y-3 text-sm pb-5 border-b border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg text-slate-900 py-4">
              <span>Total</span>
              <span className="text-green-700">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <Link href="/checkout" className="btn-primary w-full justify-center text-base py-3.5 mb-3">
              Proceed to Checkout <ChevronRight size={18} />
            </Link>
            <Link href="/products" className="btn-outline w-full justify-center text-base py-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

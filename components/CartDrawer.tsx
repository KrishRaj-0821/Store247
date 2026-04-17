'use client';

import Link from 'next/link';
import { X, Trash2, ShoppingBag, ChevronRight, Package } from 'lucide-react';
import { useCart } from '@/lib/CartContext';

export default function CartDrawer() {
  const { items, removeItem, updateQty, isOpen, setIsOpen, subtotal, deliveryFee, total } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-green-600" />
            <h2 className="font-bold text-slate-800">Your Cart</h2>
            {items.length > 0 && (
              <span className="badge-primary">{items.length} item{items.length > 1 ? 's' : ''}</span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Package size={36} className="text-slate-300" />
              </div>
              <h3 className="font-semibold text-slate-600 mb-1">Your cart is empty</h3>
              <p className="text-sm text-slate-400 mb-6">Looks like you haven&apos;t added anything yet.</p>
              <button
                onClick={() => setIsOpen(false)}
                className="btn-primary"
              >
                Browse Products
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-slate-50 rounded-xl p-3 animate-fade-in">
                {/* Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-slate-100 shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-2xl">🛒</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400 mb-2">{item.unit}</p>
                  <div className="flex items-center justify-between">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="qty-btn"
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="font-bold text-sm w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="qty-btn"
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                    <span className="font-bold text-green-700">₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                  aria-label="Remove item"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 p-5 space-y-4">
            {/* Delivery badge */}
            {subtotal < 1500 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-xs text-amber-700 flex items-center gap-2">
                <span>🚚</span>
                {subtotal >= 500
                  ? `Add ₹${(1500 - subtotal).toLocaleString('en-IN')} more for FREE delivery!`
                  : `Delivery: ₹${deliveryFee} (Free above ₹1500)`}
              </div>
            )}
            {subtotal >= 1500 && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 text-xs text-green-700 flex items-center gap-2">
                <span>✅</span> FREE delivery applied!
              </div>
            )}

            {/* Price breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-slate-800 border-t border-slate-100 pt-2">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full justify-center text-base py-3"
            >
              Proceed to Checkout <ChevronRight size={18} />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

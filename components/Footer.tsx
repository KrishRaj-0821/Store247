import Link from 'next/link';
import {
  MapPin, Phone, Mail, Package, Star, ShieldCheck, Truck, Clock, Heart
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Trust badges */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, label: 'Fast Delivery', sub: 'Same day in 854318' },
            { icon: ShieldCheck, label: 'Quality Assured', sub: '100% genuine products' },
            { icon: Star, label: 'Best Prices', sub: 'Price match guarantee' },
            { icon: Clock, label: 'Easy Returns', sub: '7-day return policy' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-700/30 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-black">SK</div>
            <div>
              <div className="font-black text-white leading-tight">S. K. General</div>
              <div className="text-[10px] text-slate-500 tracking-widest uppercase">STORE</div>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Your trusted neighborhood store for quality products at the best prices. Serving the community of 854318 with happiness delivered to your doorstep.
          </p>
          <div className="flex gap-3">
            {/* Social icons removed temporarily due to lucide-react export issues */}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2.5">
            {[
              ['Home', '/'],
              ['Products', '/products'],
              ['About Us', '/about'],
              ['Contact Us', '/contact'],
              ['Community', '/community'],
              ['Track Order', '/orders'],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="text-sm text-slate-400 hover:text-green-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-bold text-white mb-4">Categories</h3>
          <ul className="space-y-2.5">
            {['Groceries', 'Beverages', 'Dairy', 'Personal Care', 'Household', 'Snacks'].map((cat) => (
              <li key={cat}>
                <Link href={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-sm text-slate-400 hover:text-green-400 transition-colors">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex gap-2">
              <MapPin size={15} className="text-green-400 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-400">Main Market Road, Pincode 854318, Bihar, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-green-400 shrink-0" />
              <a href="tel:+918434103661" className="text-sm text-slate-400 hover:text-green-400 transition-colors">
                +91 84341 03661
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-green-400 shrink-0" />
              <a href="mailto:support@skgeneral.com" className="text-sm text-slate-400 hover:text-green-400 transition-colors">
                support@skgeneral.com
              </a>
            </li>
          </ul>

          <div className="mt-5 p-3 bg-slate-800 rounded-xl">
            <p className="text-xs text-slate-400 mb-2">Store Hours</p>
            <p className="text-sm text-white font-medium">Mon – Sat: 8:00 AM – 9:00 PM</p>
            <p className="text-sm text-white font-medium">Sunday: 9:00 AM – 6:00 PM</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {currentYear} S. K. General STORE. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
            <span className="flex items-center gap-1">Made with <Heart size={10} className="text-red-400" fill="#f87171" /> in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

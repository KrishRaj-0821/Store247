import Link from 'next/link';
import { Store, ShieldCheck, Truck, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">About S. K. General STORE</h1>
        <p className="text-lg text-slate-600">Your trusted neighborhood partner since 2010. We believe in delivering quality, freshness, and happiness to every home in 854318.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80" alt="Our Store" className="rounded-2xl shadow-lg w-full object-cover h-[400px]" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-800">Our Journey</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            What started as a small family-run grocery shop in the heart of the city has now grown into a comprehensive general store catering to thousands of happy families. We built S. K. General STORE with a simple vision: to make everyday shopping easy, affordable, and reliable.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm">
            Today, with our new digital platform, we are bringing the store to your fingertips. Whether it's daily staples, farm-fresh dairy, or your favorite snacks, we ensure same-day delivery with the same warmth and trust you've always experienced at our physical outlet.
          </p>
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <div>
              <p className="text-3xl font-black text-green-600">10+</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Years of Trust</p>
            </div>
            <div>
              <p className="text-3xl font-black text-amber-500">5k+</p>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Happy Families</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-8">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, title: 'Quality First', desc: 'Sourced from the best brands and trusted local suppliers.' },
            { icon: Clock, title: 'Reliability', desc: 'If we promise it, we deliver it. Always on time.' },
            { icon: Truck, title: 'Convenience', desc: 'Shop from anywhere, get it right at your doorstep.' },
            { icon: Store, title: 'Community', desc: 'We are a part of 854318, building relationships, not just sales.' },
          ].map((val) => (
            <div key={val.title} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <val.icon size={24} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{val.title}</h3>
              <p className="text-sm text-slate-500">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Contact Us</h1>
        <p className="text-lg text-slate-600">Have a question or need assistance? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Get In Touch</h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Visit Our Store</h3>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    S. K. General STORE<br />
                    Main Market Road<br />
                    Pincode: 854318, Bihar, India
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Call Us</h3>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    <a href="tel:+918434103661" className="hover:text-green-600">+91 84341 03661</a><br />
                    <span className="text-xs text-slate-400">Available Mon-Sat, 8 AM - 9 PM</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Email Us</h3>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    <a href="mailto:support@skgeneral.com" className="hover:text-green-600">support@skgeneral.com</a>
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Store Hours</h3>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    Mon - Sat: 8:00 AM – 9:00 PM<br />
                    Sunday: 9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Send a Message</h2>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for contacting us!"); }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Full Name</label>
                <input type="text" required className="input-field" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Phone Number</label>
                <input type="tel" required className="input-field" placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Email Address</label>
              <input type="email" required className="input-field" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase">Message</label>
              <textarea required rows={4} className="input-field resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" className="btn-primary w-full justify-center">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

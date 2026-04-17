'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Search, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

export default function AdminInvoicesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false); });
  }, []);

  const generatePDF = (order: any) => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(21, 128, 61); // Green-700
      doc.text("S. K. General STORE", 14, 22);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text("Main Market Road, Pincode 854318", 14, 28);
      doc.text("Phone: +91 84341 03661", 14, 33);
      
      // Invoice Details
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text("TAX INVOICE", 140, 22);
      
      doc.setFontSize(10);
      doc.text(`Order No: ${order.orderNumber}`, 140, 28);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 33);
      
      doc.line(14, 40, 196, 40);
      
      // Bill To
      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 14, 48);
      doc.setFont("helvetica", "normal");
      doc.text(order.address.name, 14, 53);
      doc.text(`${order.address.line1}, ${order.address.city}`, 14, 58);
      doc.text(`Phone: ${order.address.phone}`, 14, 63);

      // Table Header
      let yOffset = 75;
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(14, yOffset, 182, 10, 'F');
      doc.setFont("helvetica", "bold");
      doc.text("Item Details", 16, yOffset + 7);
      doc.text("Qty", 120, yOffset + 7);
      doc.text("Price", 150, yOffset + 7);
      doc.text("Amount", 175, yOffset + 7);
      
      // Table Content
      doc.setFont("helvetica", "normal");
      yOffset += 15;
      order.items.forEach((item: any) => {
        doc.text(item.name, 16, yOffset);
        doc.text(item.qty.toString(), 120, yOffset);
        doc.text(`Rs ${item.price}`, 150, yOffset);
        doc.text(`Rs ${item.price * item.qty}`, 175, yOffset);
        yOffset += 10;
      });
      
      doc.line(14, yOffset, 196, yOffset);
      yOffset += 8;
      
      // Totals
      doc.text(`Subtotal:`, 150, yOffset);
      doc.text(`Rs ${order.subtotal}`, 175, yOffset);
      yOffset += 8;
      doc.text(`Delivery Fee:`, 150, yOffset);
      doc.text(`Rs ${order.deliveryFee}`, 175, yOffset);
      yOffset += 8;
      doc.setFont("helvetica", "bold");
      doc.text(`Total Amount:`, 150, yOffset);
      doc.text(`Rs ${order.total}`, 175, yOffset);

      // Footer
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text("Thank you for shopping with S. K. General STORE!", 105, 280, { align: "center" });

      doc.save(`Invoice_${order.orderNumber}.pdf`);
      toast.success('Invoice downloaded!');
    } catch (err) {
      toast.error('Failed to generate PDF');
      console.error(err);
    }
  };

  const filtered = orders.filter(o => o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.address.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="text-emerald-600" /> Invoices
          </h1>
          <p className="text-slate-500 text-sm mt-1">Generate and download order invoices</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search Order ID or Name" className="input-field pl-9 py-2 text-sm w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading invoices...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-slate-400">No invoices found.</td></tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{order.orderNumber}</td>
                    <td className="px-6 py-4 font-semibold text-slate-600">{order.address.name}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">₹{order.total.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => generatePDF(order)} className="btn-primary text-xs py-2 px-3">
                         <Download size={14} /> Download PDF
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

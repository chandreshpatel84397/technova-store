"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Truck, CreditCard, MapPin, User, Calendar, ExternalLink } from "lucide-react";

import Image from "next/image";

interface OrderItem {
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  items: OrderItem[];
  totalPrice: number;
  user?: {
    name?: string;
    email?: string;
  };
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  orderStatus: string;
  paymentStatus: string;
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
                  <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-black uppercase tracking-wider">
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-500 text-sm flex items-center gap-2">
                  <Calendar size={14} />
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Package size={20} className="text-brand-600" />
                      Order Items ({order.items?.length || 0})
                    </h3>
                    <div className="space-y-4">
                      {order.items?.map((item, idx) => (
                         <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors bg-slate-50/30">
                           <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-100 flex-shrink-0">
                             <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                           </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 truncate">{item.title}</h4>
                            <p className="text-slate-500 text-sm font-medium">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">${(item.price * item.quantity).toLocaleString()}</p>
                            <p className="text-xs text-slate-400">${item.price.toLocaleString()} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-brand-50/50 border border-brand-100">
                    <h3 className="text-sm font-black uppercase tracking-widest text-brand-700 mb-4 flex items-center gap-2">
                      <CreditCard size={16} />
                      Payment Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-slate-600 font-medium">
                        <span>Subtotal</span>
                        <span>${order.totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 font-medium">
                        <span>Shipping</span>
                        <span className="text-emerald-600 font-bold">FREE</span>
                      </div>
                      <div className="pt-3 border-t border-brand-200 flex justify-between items-center text-slate-900">
                        <span className="font-bold text-lg">Total Amount</span>
                        <span className="font-black text-2xl">${order.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <User size={16} />
                      Customer
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                        {order.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-slate-500">{order.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <MapPin size={16} />
                      Shipping Address
                    </h3>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-600 leading-relaxed font-medium">
                      {order.shippingAddress ? (
                        <>
                          <p>{order.shippingAddress.street}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                          <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
                        </>
                      ) : (
                        <p className="italic text-slate-400">No address provided</p>
                      )}
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Truck size={16} />
                      Logistics
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">STATUS</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest 
                          ${order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 
                            order.orderStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-brand-100 text-brand-700'}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">PAYMENT</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest 
                          ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button className="px-6 py-2.5 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors flex items-center gap-2 shadow-lg shadow-brand-500/20">
                <ExternalLink size={18} />
                Print Invoice
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

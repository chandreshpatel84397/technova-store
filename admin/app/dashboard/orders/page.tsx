"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import OrderDetailsModal from "@/components/dashboard/OrderDetailsModal";

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  createdAt: string;
  totalPrice: number;
  paymentStatus: string;
  orderStatus: string;
}


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getOrders();
      setOrders(data);
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await adminService.updateOrderStatus(id, status);
      fetchOrders();
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message);
    }
  };

  const filteredOrders = orders.filter((order: Order) => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-slate-500 mt-1">Track and manage all customer transactions.</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
          <Download size={20} />
          Export CSV
        </button>
      </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by order ID or customer name..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium outline-none focus:border-brand-500 shadow-sm">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
              <p className="text-slate-400 font-medium">Loading orders from database...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center text-rose-500 font-bold">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total Amount</th>
                    <th className="px-6 py-4">Payment</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order, i) => (
                        <motion.tr 
                          key={order._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4 font-bold text-slate-900 text-sm tracking-tight">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 text-xs font-bold border border-brand-100">
                                {order.user?.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 text-sm">{order.user?.name || 'Guest User'}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{order.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                            {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">${order.totalPrice.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${order.paymentStatus === "paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                              className={`
                                px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider outline-none cursor-pointer border-none
                                ${order.orderStatus === "delivered" ? "bg-emerald-100 text-emerald-700" : ""}
                                ${order.orderStatus === "processing" ? "bg-blue-100 text-blue-700" : ""}
                                ${order.orderStatus === "pending" ? "bg-amber-100 text-amber-700" : ""}
                                ${order.orderStatus === "shipped" ? "bg-purple-100 text-purple-700" : ""}
                                ${order.orderStatus === "cancelled" ? "bg-rose-100 text-rose-700" : ""}
                              `}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-20 text-center text-slate-400">No orders found.</td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

      <OrderDetailsModal 
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
}

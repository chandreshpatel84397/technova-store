"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Shield, Ban, Mail, Loader2, Trash2, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  status: string;
  profileImage?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockUser = async (id: string) => {
    try {
      await adminService.blockUser(id);
      fetchUsers(); // Refresh list
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message);
    }
  };

  const filteredUsers = users.filter((user: User) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">Total registered customers: <span className="font-bold text-brand-600">{users.length}</span></p>
        </div>
        <button 
          onClick={fetchUsers}
          className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
        >
          Refresh Data
        </button>
      </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
              <p className="text-slate-400 font-medium">Fetching real users from MongoDB...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center">
              <p className="text-rose-500 font-bold mb-4">Error: {error}</p>
              <button onClick={fetchUsers} className="px-6 py-2 bg-brand-600 text-white rounded-xl">Retry</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Customer Details</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined On</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <AnimatePresence>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, i) => (
                        <motion.tr 
                          key={user._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ delay: i * 0.05 }}
                          className="group hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 font-bold border border-brand-100 shadow-sm overflow-hidden">
                                {user.profileImage ? (
                                  <Image src={user.profileImage} alt={user.name} width={44} height={44} className="w-full h-full object-cover" />
                                ) : (
                                  user.name.charAt(0)
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{user.name}</p>
                                <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest w-fit
                              ${user.role === "admin" ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-blue-50 text-blue-600 border border-blue-100"}
                            `}>
                              {user.role === "admin" && <Shield size={12} />}
                              {user.role}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                            {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <div className={`flex items-center gap-1.5 font-bold text-xs
                              ${user.status === "active" ? "text-emerald-600" : "text-rose-600"}
                            `}>
                              {user.status === "active" ? <CheckCircle size={14} /> : <XCircle size={14} />}
                              {user.status?.toUpperCase() || 'ACTIVE'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all" title="Message User">
                                <Mail size={18} />
                              </button>
                              <button 
                                onClick={() => handleBlockUser(user._id)}
                                className={`p-2 rounded-xl transition-all ${user.status === 'blocked' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'}`} 
                                title={user.status === 'blocked' ? "Unblock User" : "Block User"}
                              >
                                <Ban size={18} />
                              </button>
                              <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Delete User">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <p className="text-slate-400 font-medium">No users found matching your search.</p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
    </DashboardLayout>
  );
}

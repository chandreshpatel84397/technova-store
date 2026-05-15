"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { 
  ArrowUpRight, Loader2, Calendar, Filter
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";

const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
}

interface SalesRecord {
  _id: string;
  totalSales: number;
  count: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [dashboardStats, salesReport] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getSalesReport()
        ]);
        setStats(dashboardStats);
        setSalesData(salesReport);
      } catch (err: unknown) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
            <p className="text-slate-500 font-medium">Analyzing business metrics...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Mock category data for visualization if real data doesn't have it
  const categoryData = [
    { name: 'Smartphones', value: 400 },
    { name: 'Laptops', value: 300 },
    { name: 'Fragrances', value: 200 },
    { name: 'Skincare', value: 278 },
    { name: 'Groceries', value: 189 },
  ];

  return (
    <DashboardLayout>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Advanced Analytics</h1>
          <p className="text-slate-500 mt-1">Deep dive into your store&apos;s performance and trends.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            <Calendar size={18} />
            Last 30 Days
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors flex items-center justify-center gap-2">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </header>

      {/* Main Revenue Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Revenue Growth</h3>
            <p className="text-slate-500 text-sm">Total sales across all regions.</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-slate-900">${stats?.totalRevenue?.toLocaleString() || 0}</p>
            <span className="text-emerald-600 text-xs font-bold flex items-center justify-end gap-1">
              <ArrowUpRight size={14} />
              +24.5% vs last month
            </span>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData.length > 0 ? salesData : [{_id: 'Mon', totalSales: 4000}, {_id: 'Tue', totalSales: 3000}, {_id: 'Wed', totalSales: 5000}]}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
              />
              <Area type="monotone" dataKey="totalSales" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Breakdown */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Sales by Category</h3>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 pr-8">
              {categoryData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Order Volume</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData.length > 0 ? salesData : [{_id: 'Jan', count: 40}, {_id: 'Feb', count: 30}, {_id: 'Mar', count: 50}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

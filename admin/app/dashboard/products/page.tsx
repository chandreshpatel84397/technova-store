"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, Loader2, Package, Tag, AlertCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { adminService } from "@/services/adminService";
import AddProductModal from "@/components/dashboard/AddProductModal";
import Image from "next/image";
import { Product } from "@/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const fetchProducts = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true);
      const data = await adminService.getProducts(page);
      setProducts(data.products);
      setPagination({ page: data.page, pages: data.pages });
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load products");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await adminService.deleteProduct(id);
        fetchProducts(pagination.page);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to delete product";
        alert(message);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setProductToEdit(null);
  };

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight text-balance">Inventory Management</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Package size={14} className="text-brand-600" />
            Showing <span className="font-bold text-slate-900">{products.length}</span> products in database.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-500/20 active:scale-95"
        >
          <Plus size={20} />
          Create Product
        </button>
      </header>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by title, brand, or category..."
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={18} />
            Category
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
          {isLoading ? (
            <div className="p-32 flex flex-col items-center justify-center gap-6">
              <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
              <div className="text-center">
                <p className="text-slate-900 font-bold text-lg">Syncing Inventory</p>
                <p className="text-slate-400">Fetching live product data from MongoDB...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-32 text-center">
              <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
              <p className="text-slate-900 font-bold text-xl mb-2">Connection Failed</p>
              <p className="text-slate-400 mb-6">{error}</p>
              <button onClick={() => fetchProducts(1)} className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold">Retry Sync</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-[0.1em] border-b border-slate-100">
                    <th className="px-8 py-5">Product Info</th>
                    <th className="px-8 py-5">Categorization</th>
                    <th className="px-8 py-5 text-right">Pricing</th>
                    <th className="px-8 py-5 text-center">Inventory</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product, i) => (
                        <motion.tr 
                          key={product._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="group hover:bg-slate-50/40 transition-colors"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-5">
                              <div className="relative w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100 group-hover:border-brand-200 transition-colors">
                                <Image 
                                  src={product.thumbnail} 
                                  alt={product.title} 
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-tight mb-1">
                                  {product.title}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">#{product.slug.slice(0, 8)}</span>
                                  {product.badge && (
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded border border-brand-100">{product.badge}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-1.5 text-slate-600 text-sm font-semibold">
                                <Tag size={12} className="text-slate-400" />
                                {product.category}
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">{product.brand}</p>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <p className="text-slate-900 font-black text-lg">${product.price.toLocaleString()}</p>
                            {product.discount > 0 && (
                              <p className="text-[10px] font-bold text-emerald-600">-{product.discount}% OFF</p>
                            )}
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                  style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }}
                                />
                              </div>
                              <span className={`text-xs font-black ${product.stock > 0 ? 'text-slate-600' : 'text-rose-600'}`}>
                                {product.stock} IN STOCK
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleEdit(product)}
                                className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all shadow-sm"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(product._id)}
                                className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm"
                              >
                                <Trash2 size={18} />
                              </button>
                              <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all">
                                <MoreVertical size={18} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-24 text-center">
                          <p className="text-slate-400 font-bold text-lg">No products match your current search criteria.</p>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
          <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-slate-500 text-xs font-bold tracking-widest">
            <p>PAGE {pagination.page} OF {pagination.pages}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => fetchProducts(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-30 shadow-sm"
              >
                PREV
              </button>
              <button 
                onClick={() => fetchProducts(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors disabled:opacity-30 shadow-sm"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>

      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => fetchProducts(1)}
        editProduct={productToEdit}
      />
    </DashboardLayout>
  );
}

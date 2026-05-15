"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Search, Package, Tag, DollarSign, List, Briefcase, Plus, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: any;
}

const CATEGORIES = [
  "Laptops", "Mobile Phones", "Headphones", "Smart Watches", "Keyboards", "Gaming Mouse", 
  "Monitors", "Speakers", "Mobile Accessories", "Cameras", "Tablets"
];

// Preset high-quality Unsplash images for the "Public API" feel
const PRESET_IMAGES = [
  { url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", title: "Laptop" },
  { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", title: "Mobile Phone" },
  { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", title: "Headphones" },
  { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80", title: "Smart Watch" },
  { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", title: "Gaming PC" },
  { url: "https://images.unsplash.com/photo-1527690191606-4774f97c4c7c?auto=format&fit=crop&w=800&q=80", title: "Wearables" },
  { url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80", title: "Mouse" },
  { url: "https://images.unsplash.com/photo-1587829741301-dc798b83bac1?auto=format&fit=crop&w=800&q=80", title: "Keyboard" },
  { url: "https://images.unsplash.com/photo-1547115941-9d45f2ee1688?auto=format&fit=crop&w=800&q=80", title: "Monitor" },
  { url: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80", title: "Smart TV" },
  { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80", title: "Tablets" },
  { url: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80", title: "Mobile Phones" },
  { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", title: "Laptops" },
];

export default function AddProductModal({ isOpen, onClose, onSuccess, editProduct }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: CATEGORIES[0],
    brand: "",
    stock: "",
    thumbnail: "",
    discount: "0",
    badge: ""
  });

  const [imageSearch, setImageSearch] = useState("");
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [searchResults, setSearchResults] = useState(PRESET_IMAGES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchImages = (query?: string) => {
    const searchTerm = query || imageSearch;
    setIsSearchingImages(true);
    // Simulate API call to Unsplash
    setTimeout(() => {
      let filtered = PRESET_IMAGES;
      if (searchTerm.trim()) {
        filtered = PRESET_IMAGES.filter(img => 
          img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          searchTerm.toLowerCase().includes(img.title.toLowerCase().replace(/s$/, ''))
        );
      }
      
      // If no exact match, return a random subset or everything
      if (filtered.length === 0) {
        filtered = PRESET_IMAGES.sort(() => 0.5 - Math.random()).slice(0, 6);
      }
      
      setSearchResults(filtered);
      setIsSearchingImages(false);
    }, 600);
  };

  useEffect(() => {
    if (isOpen) {
      if (editProduct) {
        setFormData({
          title: editProduct.title || "",
          price: String(editProduct.price || ""),
          description: editProduct.description || "",
          category: editProduct.category || CATEGORIES[0],
          brand: editProduct.brand || "",
          stock: String(editProduct.stock || ""),
          thumbnail: editProduct.thumbnail || "",
          discount: String(editProduct.discount || "0"),
          badge: editProduct.badge || ""
        });
      } else {
        setFormData({
          title: "",
          price: "",
          description: "",
          category: CATEGORIES[0],
          brand: "",
          stock: "",
          thumbnail: "",
          discount: "0",
          badge: ""
        });
      }
      handleSearchImages(editProduct?.category || formData.category);
    }
  }, [isOpen, editProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!formData.thumbnail) {
        throw new Error("Please select a product image");
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        discount: Number(formData.discount),
      };

      if (editProduct) {
        await adminService.updateProduct(editProduct._id, productData);
      } else {
        await adminService.createProduct(productData);
      }

      onSuccess();
      onClose();
      // Reset form
      setFormData({
        title: "",
        price: "",
        description: "",
        category: CATEGORIES[0],
        brand: "",
        stock: "",
        thumbnail: "",
        discount: "0",
        badge: ""
      });
    } catch (err: any) {
      setError(err.message || `Failed to ${editProduct ? 'update' : 'create'} product`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col border border-white/20"
        >
          {/* Header */}
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {editProduct ? "Edit Product" : "Create New Product"}
              </h2>
              <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                <Plus size={16} className={editProduct ? "text-amber-600" : "text-brand-600"} />
                {editProduct ? `Modifying inventory for "${editProduct.title}"` : "Add premium inventory to TechNova catalog."}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-2xl transition-all active:scale-90"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column: Form Details */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Basic Information</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Product Title</label>
                    <div className="relative group">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                      <input 
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. MacBook Pro M3"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Brand</label>
                      <div className="relative group">
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                        <input 
                          required
                          name="brand"
                          value={formData.brand}
                          onChange={handleChange}
                          placeholder="Apple"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Category</label>
                      <div className="relative group">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                        <select 
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold appearance-none cursor-pointer"
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Pricing & Inventory</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Price</label>
                      <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                        <input 
                          required
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="1999"
                          className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Stock</label>
                      <div className="relative group">
                        <List className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                        <input 
                          required
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          placeholder="50"
                          className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Discount %</label>
                      <input 
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1 text-balance">Description</label>
                  <textarea 
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the premium features and specifications..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium resize-none"
                  />
                </div>
              </div>

              {/* Right Column: Image Picker */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Visual Assets (Public API)</h3>
                  
                  {/* Image Search Box */}
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600" size={18} />
                        <input 
                          type="text"
                          placeholder="Search Unsplash for images..."
                          value={imageSearch}
                          onChange={(e) => setImageSearch(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium shadow-sm"
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchImages())}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleSearchImages()}
                        className="px-6 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors flex items-center gap-2"
                      >
                        {isSearchingImages ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                        Search
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-px bg-slate-100 flex-1" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or Provide Custom URL</span>
                      <div className="h-px bg-slate-100 flex-1" />
                    </div>

                    <div className="relative group">
                      <Upload className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-600" size={18} />
                      <input 
                        type="text"
                        name="thumbnail"
                        value={formData.thumbnail}
                        onChange={handleChange}
                        placeholder="Paste image URL here..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Image Grid */}
                  <div className="grid grid-cols-3 gap-4 h-[350px] overflow-y-auto pr-2 custom-scrollbar bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">
                    {searchResults.map((img, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData(prev => ({ ...prev, thumbnail: img.url }))}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${formData.thumbnail === img.url ? 'border-brand-600 shadow-md ring-2 ring-brand-500/10' : 'border-white shadow-sm'}`}
                      >
                        <img 
                          src={img.url} 
                          alt={img.title} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?auto=format&fit=crop&w=200&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                           <p className="text-[8px] font-black text-white uppercase tracking-wider">{img.title}</p>
                        </div>
                        {formData.thumbnail === img.url && (
                          <div className="absolute inset-0 bg-brand-600/10 flex items-center justify-center backdrop-blur-[1px]">
                            <div className="bg-brand-600 text-white p-1 rounded-full shadow-lg">
                              <Check size={14} strokeWidth={4} />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Selected Preview */}
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-700 ml-1">Selected Thumbnail URL</label>
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl break-all text-[11px] font-mono text-slate-500 flex items-start gap-3">
                      <ImageIcon size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      {formData.thumbnail || "No image selected yet. Search and pick one above."}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Badge (Optional)</label>
                    <input 
                      name="badge"
                      value={formData.badge}
                      onChange={handleChange}
                      placeholder="e.g. NEW ARRIVAL, BEST SELLER"
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-black text-xs uppercase tracking-widest"
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-3">
                <X size={18} className="bg-rose-100 rounded-full p-0.5" />
                {error}
              </div>
            )}

            {/* Form Footer */}
            <div className="mt-12 flex justify-end gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
              >
                Discard Changes
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`px-10 py-4 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 ${editProduct ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-brand-600 hover:bg-brand-700 shadow-brand-500/20'}`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                {isSubmitting ? "Syncing..." : editProduct ? "Update Product" : "Publish Product"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Package as PackageIcon, Eye, MoreVertical, Loader2, Save, X, Tag, Layers, Star, Package, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
import { adminApi } from "@/services/api";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

export default function ProductsCatalog() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock_quantity: "",
    category: "CARDS",
    description: ""
  });

  const loadProducts = async () => {
    if (!token) return;
    try {
      const res = await adminApi.listProducts(token);
      setProducts(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [token]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", stock_quantity: "", category: "CARDS", description: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock_quantity: (product.stock_quantity || 0).toString(),
      category: product.category || "CARDS",
      description: product.description || ""
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (product: any) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        is_active: true
      };

      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload, token);
      } else {
        await adminApi.createProduct(payload, token);
      }

      await loadProducts();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Action failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !productToDelete) return;
    setSubmitting(true);
    try {
      await adminApi.deleteProduct(productToDelete.id, token);
      await loadProducts();
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Delete failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Product Hardware",
      accessorKey: "name",
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
            {row.imageUrl ? (
              <img src={row.imageUrl} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              <PackageIcon className="w-6 h-6 text-slate-400" />
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{row.name}</div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">{row.id}</div>
          </div>
        </div>
      )
    },
    {
       header: "Details",
       accessorKey: "category",
       cell: (row: any) => (
         <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-tighter">{row.category}</span>
            <span className="text-xs text-slate-500 truncate max-w-[200px]">{row.description}</span>
         </div>
       )
    },
    {
      header: "Price",
      accessorKey: "price",
      cell: (row: any) => <span className="font-bold text-slate-900 leading-none">₹{row.price.toLocaleString()}</span>
    },
    {
      header: "Inventory",
      accessorKey: "stock_quantity",
      cell: (row: any) => (
        <div className="flex flex-col gap-1.5 w-32">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
             <span className="text-slate-400">Stock</span>
             <span className={(row.stock_quantity || 0) > 20 ? "text-emerald-600" : "text-rose-500"}>{row.stock_quantity || 0} Units</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-700",
                (row.stock_quantity || 0) > 50 ? "bg-emerald-500" : (row.stock_quantity || 0) > 10 ? "bg-amber-500" : "bg-rose-500"
              )} 
              style={{ width: `${Math.min(100, ((row.stock_quantity || 0) / 150) * 100)}%` }} 
            />
          </div>
        </div>
      )
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-1">
          <button 
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" 
            title="Edit"
            onClick={() => openEditModal(row)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" 
            title="Delete"
            onClick={() => openDeleteModal(row)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">Initializing products terminal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Products Catalog</h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg">Provision and manage physical NFC hardware, inventory levels, and global pricing strategies.</p>
        </div>
        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
          onClick={openAddModal}
        >
          <Plus size={20} /> Provision New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total SKU Count</div>
            <div className="text-3xl font-black text-slate-900">{products.length}</div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Critical</div>
            <div className="text-3xl font-black text-rose-500">{products.filter(p => (p.stock_quantity || 0) < 10).length}</div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Hardware</div>
            <div className="text-3xl font-black text-emerald-500 uppercase">{products.filter(p => p.is_active).length}</div>
         </div>
         <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Card Price</div>
            <div className="text-3xl font-black text-indigo-600">₹{Math.round(products.reduce((acc, p) => acc + p.price, 0) / (products.length || 1))}</div>
         </div>
      </div>

      <DataTable 
        data={products} 
        columns={columns} 
        title="Hardware Node Catalog" 
        searchPlaceholder="Search hardware by name, category or node ID..."
      />

      {/* Add / Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingProduct ? "Update Hardware Spec" : "Provision New Hardware"}
        className="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Name</label>
            <input
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              placeholder="e.g. Matte Black Premium Card"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Unit Price (INR)</label>
              <input
                required
                type="number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Stock Quantity</label>
              <input
                required
                type="number"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="100"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
              />
            </div>
          </div>

          <Select 
            label="Hardware Category"
            value={formData.category}
            onChange={(val) => setFormData({ ...formData, category: val })}
            options={[
              { value: "CARDS", label: "NFC Smart Cards", icon: Package },
              { value: "TAGS", label: "NFC Tags & Stickers", icon: Tag },
              { value: "ACCESSORIES", label: "Hardware Accessories", icon: Layers },
              { value: "LUXURY", label: "Luxury Gold Collection", icon: Star }
            ]}
          />

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Brief Description</label>
            <textarea
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none h-24"
              placeholder="Describe the hardware features, material, and finish..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all shadow-sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                   {editingProduct ? "Sync Changes" : "Initialize SKU"} <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        className="max-w-md"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mb-2">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">Are you sure?</h4>
            <p className="text-sm text-slate-500 mt-2">
              You are about to delete <span className="font-bold text-slate-800">"{productToDelete?.name}"</span>. 
              This action permanent and cannot be reversed.
            </p>
          </div>
          <div className="flex gap-3 w-full pt-4">
            <button
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold text-sm transition-all"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              No, Keep it
            </button>
            <button
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
              onClick={handleDelete}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete Product"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

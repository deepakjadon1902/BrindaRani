import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Product } from '@/data/mockData';
import { uploadAPI, resolveAssetUrl } from '@/services/api';

interface ProductFormState {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: string;
  stock: string;
  rating: string;
  reviews: string;
  images: string[];
  isTrending: boolean;
  isLatest: boolean;
  isVrindavanSpecial: boolean;
}

const emptyForm: ProductFormState = {
  name: '',
  category: '',
  subcategory: '',
  description: '',
  price: '',
  stock: '',
  rating: '0',
  reviews: '0',
  images: [],
  isTrending: false,
  isLatest: false,
  isVrindavanSpecial: false,
};

const productToForm = (product: Product): ProductFormState => ({
  name: product.name || '',
  category: product.category || '',
  subcategory: product.subcategory || '',
  description: product.description || '',
  price: String(product.sizes?.[0]?.price ?? ''),
  stock: String(product.sizes?.[0]?.stock ?? ''),
  rating: String(product.rating ?? 0),
  reviews: String(product.reviews ?? 0),
  images: product.images || [],
  isTrending: Boolean(product.isTrending),
  isLatest: Boolean(product.isLatest),
  isVrindavanSpecial: Boolean(product.isVrindavanSpecial),
});

const AdminProducts = () => {
  const { products, categories, deleteProduct, addProduct, updateProduct, fetchProducts, fetchCategories, isLoadingProducts } = useStore();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );
  const selectedCategory = categories.find((category) => category.name === form.category);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFiles([]);
    setImagePreviews([]);
    setOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm(productToForm(product));
    setImageFiles([]);
    setImagePreviews([]);
    setOpen(true);
  };

  const closeDialog = () => {
    if (!isSubmitting) {
      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setImageFiles([]);
      setImagePreviews([]);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removePreview = (index: number) => {
    const existingCount = form.images.length;
    if (index < existingCount) {
      setForm((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      return;
    }
    const newIndex = index - existingCount;
    setImagePreviews((prev) => prev.filter((_, i) => i !== newIndex));
    setImageFiles((prev) => prev.filter((_, i) => i !== newIndex));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim() || !form.description.trim()) {
      toast.error('Name, category and description are required');
      return;
    }
    const price = Number(form.price);
    const stock = Number(form.stock);
    const rating = Number(form.rating);
    const reviews = Number(form.reviews);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }
    if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
      toast.error('Rating must be between 0 and 5');
      return;
    }
    if (!Number.isInteger(reviews) || reviews < 0) {
      toast.error('Reviews must be a whole number');
      return;
    }

    let imageUrls = [...form.images];
    if (imageFiles.length > 0) {
      try {
        const { urls } = await uploadAPI.uploadImages(imageFiles, 'products');
        imageUrls = [...imageUrls, ...(urls || []).map((url: string) => resolveAssetUrl(url))];
      } catch {
        toast.error('Image upload failed');
        return;
      }
    }

    if (imageUrls.length === 0) {
      toast.error('At least one product image is required');
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      subcategory: form.subcategory.trim(),
      description: form.description.trim(),
      sizes: [{ size: 'Default', price, stock }],
      rating,
      reviews,
      images: imageUrls,
      isTrending: form.isTrending,
      isLatest: form.isLatest,
      isVrindavanSpecial: form.isVrindavanSpecial,
    };

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        toast.success('Product updated');
      } else {
        await addProduct(payload);
        toast.success('Product added');
      }
      closeDialog();
    } catch {
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="mt-1 text-sm text-white/60">{filtered.length} products in your catalogue</p>
        </div>
        <Button className="bg-white text-[#212020] hover:bg-white/90" onClick={openCreate}>
          <Plus size={18} className="mr-2" />
          Add Product
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 border-[#90878E]/25 bg-[#212020]/80 pl-10 text-white placeholder:text-white/45 focus-visible:ring-[#90878E]"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#90878E]/24 bg-[#212020] shadow-[0_24px_70px_-45px_rgba(255,255,255,0.35)]">
        <table className="w-full min-w-[920px] border-collapse">
          <thead>
            <tr className="border-b border-[#90878E]/18 bg-[#262525] text-left text-sm font-semibold text-white/70">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Rating</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingProducts ? (
              <tr><td colSpan={7} className="py-10 text-center text-white/60">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-10 text-center text-white/60">No products found</td></tr>
            ) : (
              filtered.map((product, index) => {
                const productPrices = product.sizes.map((s) => s.price);
                const minPrice = Math.min(...productPrices);
                const maxPrice = Math.max(...productPrices);
                const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
                return (
                  <tr key={product.id} className={`border-b border-[#90878E]/12 text-sm text-white transition-colors hover:bg-[#90878E]/14 ${index % 2 === 1 ? 'bg-[#2a2929]' : 'bg-[#212020]'}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0] || '/placeholder.svg'} alt="" className="h-10 w-10 rounded-lg border border-white/10 bg-white object-cover" />
                        <span className="max-w-[260px] truncate font-semibold text-white">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-white/78">{product.category}</td>
                    <td className="px-5 py-3 font-semibold text-white">
                      {minPrice === maxPrice ? `INR ${minPrice}` : `INR ${minPrice} - ${maxPrice}`}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-white">★ {Number(product.rating || 0).toFixed(1)}</span>
                      <span className="ml-1 text-white/55">({product.reviews || 0})</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={totalStock > 0 ? 'font-semibold text-white' : 'font-semibold text-[#ff7d7d]'}>
                        {totalStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {product.isTrending && <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#212020]">Trending</span>}
                        {product.isLatest && <span className="rounded-full border border-white/35 px-2.5 py-1 text-[10px] font-bold text-white">New</span>}
                        {product.isVrindavanSpecial && <span className="rounded-full bg-[#90878E] px-2.5 py-1 text-[10px] font-bold text-white">Vrindavan Special</span>}
                        {!product.isTrending && !product.isLatest && !product.isVrindavanSpecial && <span className="text-xs text-white/45">-</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(product)} className="rounded-lg p-2 text-white/75 transition-colors hover:bg-white/10 hover:text-white" aria-label={`Edit ${product.name}`}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="rounded-lg p-2 text-[#ff7d7d] transition-colors hover:bg-[#ff7d7d]/10" aria-label={`Delete ${product.name}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Product' : 'Add Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(category) => setForm({ ...form, category, subcategory: '' })}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((category) => <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subcategory</Label>
              <Select
                value={form.subcategory}
                onValueChange={(subcategory) => setForm({ ...form, subcategory })}
                disabled={!selectedCategory || selectedCategory.subcategories.length === 0}
              >
                <SelectTrigger><SelectValue placeholder={selectedCategory ? 'Select a subcategory' : 'Select a category first'} /></SelectTrigger>
                <SelectContent>
                  {(selectedCategory?.subcategories || []).map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Price</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <Label>Stock</Label>
                <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Rating Stars</Label>
                <Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              </div>
              <div>
                <Label>Review Count</Label>
                <Input type="number" min="0" step="1" value={form.reviews} onChange={(e) => setForm({ ...form, reviews: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Upload Images</Label>
              <Input type="file" accept="image/*" multiple onChange={handleImageSelect} className="mt-1" />
              {(imagePreviews.length > 0 || form.images.length > 0) && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {[...form.images, ...imagePreviews].map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt="Preview"
                        className="h-20 w-20 rounded-md object-cover border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(index)}
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white text-xs"
                        aria-label="Remove image"
                      >
                        Ã—
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">Only uploads from device are allowed.</p>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.isTrending} onCheckedChange={(v) => setForm({ ...form, isTrending: Boolean(v) })} />
                Trending
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={form.isLatest} onCheckedChange={(v) => setForm({ ...form, isLatest: Boolean(v) })} />
                Latest
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isVrindavanSpecial}
                  onCheckedChange={(v) => setForm({ ...form, isVrindavanSpecial: Boolean(v) })}
                />
                Vrindavan Special
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" className="btn-sacred" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;


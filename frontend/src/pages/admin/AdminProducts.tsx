import { useEffect, useMemo, useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  image: string;
  isTrending: boolean;
  isLatest: boolean;
}

const emptyForm: ProductFormState = {
  name: '',
  category: '',
  subcategory: '',
  description: '',
  price: '',
  stock: '',
  image: '',
  isTrending: false,
  isLatest: false,
};

const productToForm = (product: Product): ProductFormState => ({
  name: product.name || '',
  category: product.category || '',
  subcategory: product.subcategory || '',
  description: product.description || '',
  price: String(product.sizes?.[0]?.price ?? ''),
  stock: String(product.sizes?.[0]?.stock ?? ''),
  image: product.images?.[0] || '',
  isTrending: Boolean(product.isTrending),
  isLatest: Boolean(product.isLatest),
});

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminProducts = () => {
  const { products, categories, deleteProduct, addProduct, updateProduct, fetchProducts, fetchCategories, isLoadingProducts } = useStore();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm(productToForm(product));
    setImageFile(null);
    setImagePreview(product.images?.[0] || '');
    setOpen(true);
  };

  const closeDialog = () => {
    if (!isSubmitting) {
      setOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setImageFile(null);
      setImagePreview('');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
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
    if (!Number.isFinite(price) || price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    let imageUrl = form.image.trim() || '/placeholder.svg';
    if (imageFile) {
      try {
        const { urls } = await uploadAPI.uploadImages([imageFile]);
        imageUrl = resolveAssetUrl(urls?.[0] || imageUrl);
      } catch {
        imageUrl = await fileToDataUrl(imageFile);
      }
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      subcategory: form.subcategory.trim(),
      description: form.description.trim(),
      sizes: [{ size: 'Default', price, stock }],
      images: [imageUrl],
      isTrending: form.isTrending,
      isLatest: form.isLatest,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button className="btn-sacred" onClick={openCreate}>
          <Plus size={18} className="mr-2" />
          Add Product
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="table-premium">
          <thead>
            <tr><th>Product</th><th>Category</th><th>Price Range</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {isLoadingProducts ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">No products found</td></tr>
            ) : (
              filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={product.images[0] || '/placeholder.svg'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    Rs {Math.min(...product.sizes.map((s) => s.price))} - Rs {Math.max(...product.sizes.map((s) => s.price))}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {product.isTrending && <span className="badge-trending text-xs">Trending</span>}
                      {product.isLatest && <span className="badge-new text-xs">New</span>}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(product)} className="p-2 hover:bg-muted rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
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
              <Input
                list="category-options"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Type or pick category"
              />
              <datalist id="category-options">
                {categories.map((category) => (
                  <option key={category.id} value={category.name} />
                ))}
              </datalist>
            </div>
            <div>
              <Label>Subcategory</Label>
              <Input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
            <div>
              <Label>Upload Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageSelect} className="mt-1" />
              {(imagePreview || form.image) && (
                <img
                  src={imagePreview || form.image}
                  alt="Preview"
                  className="mt-3 h-24 w-24 rounded-md object-cover border border-border"
                />
              )}
              <p className="text-xs text-muted-foreground mt-2">Or paste image URL</p>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="mt-1" />
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

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import type { Category } from '@/data/mockData';
import { resolveAssetUrl, uploadAPI } from '@/services/api';

interface CategoryFormState {
  name: string;
  image: string;
  subcategories: string;
}

const emptyForm: CategoryFormState = {
  name: '',
  image: '',
  subcategories: '',
};

const categoryToForm = (category: Category): CategoryFormState => ({
  name: category.name || '',
  image: category.image || '',
  subcategories: (category.subcategories || []).join(', '),
});

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const AdminCategories = () => {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory } = useStore();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview('');
    setOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category.id);
    setForm(categoryToForm(category));
    setImageFile(null);
    setImagePreview(category.image || '');
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

  const parseSubcategories = (value: string) =>
    value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    let imageUrl = form.image.trim();
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
      image: imageUrl,
      subcategories: parseSubcategories(form.subcategories),
    };

    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateCategory(editingId, payload);
        toast.success('Category updated');
      } else {
        await addCategory(payload);
        toast.success('Category added');
      }
      closeDialog();
    } catch {
      toast.error('Failed to save category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button className="btn-sacred" onClick={openCreate}>
          <Plus size={18} className="mr-2" />
          Add Category
        </Button>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="table-premium">
          <thead>
            <tr><th>Name</th><th>Image</th><th>Subcategories</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">No categories found</td></tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id}>
                  <td className="font-medium">{category.name}</td>
                  <td>
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-12 h-12 rounded-md object-cover border border-border" />
                    ) : (
                      <span className="text-xs text-muted-foreground">No image</span>
                    )}
                  </td>
                  <td className="text-muted-foreground">{(category.subcategories || []).join(', ') || '-'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(category)} className="p-2 hover:bg-muted rounded-lg">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive">
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
            <DialogTitle>{editingId ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Upload Image</Label>
              <Input type="file" accept="image/*" onChange={handleImageSelect} className="mt-1" />
              {(imagePreview || form.image) && (
                <img
                  src={imagePreview || form.image}
                  alt="Category preview"
                  className="mt-3 h-24 w-24 rounded-md object-cover border border-border"
                />
              )}
              <p className="text-xs text-muted-foreground mt-2">Or paste image URL</p>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="mt-1" />
            </div>
            <div>
              <Label>Subcategories (comma separated)</Label>
              <Input value={form.subcategories} onChange={(e) => setForm({ ...form, subcategories: e.target.value })} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" className="btn-sacred" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCategories;

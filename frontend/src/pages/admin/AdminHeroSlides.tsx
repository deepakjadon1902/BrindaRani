import { useEffect, useState } from 'react';
import { Edit2, GripVertical, ImagePlus, Plus, Trash2 } from 'lucide-react';
import { heroSlidesAPI, resolveAssetUrl, uploadAPI } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

type Slide = { _id: string; title: string; description: string; tag: string; image: string; ctaLabel: string; ctaLink: string; order: number; isActive: boolean };
const empty = { title: '', description: '', tag: '', image: '', ctaLabel: 'Shop Now', ctaLink: '/products', order: 0, isActive: true };
const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ''));
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const AdminHeroSlides = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [form, setForm] = useState<Omit<Slide, '_id'>>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const load = async () => { try { setSlides(await heroSlidesAPI.getAdmin()); } catch (error) { const message = error instanceof Error ? error.message : 'Could not load hero slides'; toast.error(message === 'Invalid token' || message === 'Authentication required' ? 'Your admin session expired. Please sign in again.' : message); } };
  useEffect(() => { load(); }, []);
  const startNew = () => { setEditing(null); setForm({ ...empty, order: slides.length }); setOpen(true); };
  const startEdit = (slide: Slide) => { setEditing(slide._id); setForm({ ...slide }); setOpen(true); };
  const upload = async (file?: File) => { if (!file) return; setUploading(true); try { const result = await uploadAPI.uploadImages([file], 'site'); const uploadedUrl = result.urls[0]; const portableUrl = String(uploadedUrl).startsWith('/uploads/') ? await fileToDataUrl(file) : uploadedUrl; setForm((f) => ({ ...f, image: portableUrl })); } catch { toast.error('Image upload failed'); } finally { setUploading(false); } };
  const save = async () => { if (!form.title.trim() || !form.image) return toast.error('Title and image are required'); try { if (editing) await heroSlidesAPI.update(editing, form); else await heroSlidesAPI.create(form); setOpen(false); await load(); toast.success('Hero slide saved'); } catch { toast.error('Could not save hero slide'); } };
  const remove = async (id: string) => { if (!window.confirm('Delete this hero slide?')) return; try { await heroSlidesAPI.delete(id); await load(); toast.success('Hero slide deleted'); } catch { toast.error('Could not delete slide'); } };

  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold">Hero slides</h1><p className="text-sm text-muted-foreground">Manage storefront carousel content and display order</p></div><Button onClick={startNew}><Plus className="mr-2 h-4 w-4"/>Add slide</Button></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{slides.map((slide) => <article key={slide._id} className="admin-card overflow-hidden"><div className="relative aspect-[16/7]"><img src={resolveAssetUrl(slide.image)} alt={slide.title} className="h-full w-full object-cover"/><span className="absolute left-3 top-3 rounded-full bg-background/90 px-2 py-1 text-xs">#{slide.order + 1} · {slide.isActive ? 'Active' : 'Hidden'}</span></div><div className="p-4"><div className="flex items-start gap-2"><GripVertical className="mt-1 h-4 w-4 text-muted-foreground"/><div className="flex-1"><p className="text-xs font-medium text-primary">{slide.tag}</p><h2 className="font-bold">{slide.title}</h2><p className="line-clamp-2 text-sm text-muted-foreground">{slide.description}</p></div></div><div className="mt-4 flex gap-2"><Button variant="outline" size="sm" onClick={() => startEdit(slide)}><Edit2 className="mr-2 h-4 w-4"/>Edit</Button><Button variant="outline" size="sm" onClick={() => remove(slide._id)}><Trash2 className="mr-2 h-4 w-4"/>Delete</Button></div></div></article>)}{slides.length === 0 && <div className="admin-card col-span-full p-10 text-center text-muted-foreground">No database slides yet. The storefront will keep using its built-in slides until you add one.</div>}</div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} hero slide</DialogTitle></DialogHeader><div className="grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Label>Image</Label><div className="mt-1 flex gap-3"><Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL or upload"/><Button variant="outline" asChild><label className="cursor-pointer"><ImagePlus className="mr-2 h-4 w-4"/>{uploading ? 'Uploading…' : 'Upload'}<input type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files?.[0])}/></label></Button></div></div><div><Label>Tag</Label><Input className="mt-1" value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}/></div><div><Label>Display order</Label><Input type="number" className="mt-1" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}/></div><div className="sm:col-span-2"><Label>Title</Label><Input className="mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}/></div><div className="sm:col-span-2"><Label>Description</Label><Textarea className="mt-1" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/></div><div><Label>CTA label</Label><Input className="mt-1" value={form.ctaLabel} onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}/></div><div><Label>CTA link</Label><Input className="mt-1" value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}/></div><div className="sm:col-span-2 flex items-center gap-3"><Switch checked={form.isActive} onCheckedChange={(isActive) => setForm({ ...form, isActive })}/><Label>Visible on storefront</Label></div></div><Button onClick={save} disabled={uploading}>Save slide</Button></DialogContent></Dialog>
  </div>;
};
export default AdminHeroSlides;

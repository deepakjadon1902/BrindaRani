import { useState } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AdminProducts = () => {
  const { products, deleteProduct, updateProduct } = useStore();
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button className="btn-sacred"><Plus size={18} className="mr-2" />Add Product</Button>
      </div>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="table-premium">
          <thead><tr><th>Product</th><th>Category</th><th>Price Range</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td><div className="flex items-center gap-3">
                  <img src={product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  <span className="font-medium">{product.name}</span>
                </div></td>
                <td>{product.category}</td>
                <td>₹{Math.min(...product.sizes.map(s => s.price))} - ₹{Math.max(...product.sizes.map(s => s.price))}</td>
                <td><div className="flex gap-1">
                  {product.isTrending && <span className="badge-trending text-xs">Trending</span>}
                  {product.isLatest && <span className="badge-new text-xs">New</span>}
                </div></td>
                <td><div className="flex gap-2">
                  <button className="p-2 hover:bg-muted rounded-lg"><Edit2 size={16} /></button>
                  <button onClick={() => { deleteProduct(product.id); toast.success('Deleted'); }} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive"><Trash2 size={16} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;

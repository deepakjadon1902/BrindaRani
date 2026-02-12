import { useState, useMemo } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const CustomDesignSection = () => {
  const { categories, products, adminSettings } = useStore();
  const [formData, setFormData] = useState({
    category: '',
    product: '',
    productSize: '',
    quantity: '1',
    message: '',
    name: '',
    phone: '',
  });

  const sizes = ['Small', 'Medium', 'Large', 'Extra Large', 'Custom Size'];

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (!formData.category) return [];
    return products.filter((p) => p.category === formData.category);
  }, [formData.category, products]);

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value, product: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.productSize || !formData.message || !formData.name || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedProduct = products.find(p => p.id === formData.product);

    const whatsappMessage = `🙏 *Custom Order Request - BrindaRani*

*Customer Details:*
Name: ${formData.name}
Phone: ${formData.phone}

*Order Details:*
Category: ${formData.category}
${selectedProduct ? `Reference Product: ${selectedProduct.name}` : ''}
Size: ${formData.productSize}
Quantity: ${formData.quantity}

*Custom Requirements:*
${formData.message}

---
_Sent via BrindaRani Website_`;

    const whatsappUrl = `https://wa.me/${adminSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank');

    toast.success('Redirecting to WhatsApp...', {
      description: 'Your custom order request is ready to send!',
    });

    setFormData({
      category: '',
      product: '',
      productSize: '',
      quantity: '1',
      message: '',
      name: '',
      phone: '',
    });
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
              ✨ Special Service
            </span>
            <h2 className="section-title text-center mx-auto">
              Custom Design Orders
            </h2>
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto">
              Can't find exactly what you're looking for? We create bespoke spiritual products 
              tailored to your requirements. Share your vision with us!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card-premium p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Name *</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-sacred"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-sacred"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="input-sacred">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product - filtered by category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Product (Optional)
                </label>
                <Select
                  value={formData.product}
                  onValueChange={(value) => setFormData({ ...formData, product: value })}
                  disabled={!formData.category}
                >
                  <SelectTrigger className="input-sacred">
                    <SelectValue placeholder={formData.category ? 'Select a product to customise' : 'Select category first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProducts.map((prod) => (
                      <SelectItem key={prod.id} value={prod.id}>
                        {prod.name}
                      </SelectItem>
                    ))}
                    {filteredProducts.length === 0 && formData.category && (
                      <SelectItem value="__none" disabled>
                        No products in this category
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Size *</label>
                <Select
                  value={formData.productSize}
                  onValueChange={(value) => setFormData({ ...formData, productSize: value })}
                >
                  <SelectTrigger className="input-sacred">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <Input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="input-sacred"
                />
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Your Custom Requirements *
                </label>
                <Textarea
                  placeholder="Describe your requirements in detail... (e.g., specific design, materials, inscriptions, colors, etc.)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-sacred min-h-[150px] resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MessageCircle size={18} className="text-accent" />
                Your request will be sent via WhatsApp
              </p>
              <Button type="submit" className="btn-sacred px-8">
                <Send size={18} className="mr-2" />
                Send Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CustomDesignSection;

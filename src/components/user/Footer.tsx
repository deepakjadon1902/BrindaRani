import { Link } from 'react-router-dom';
import { useState } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Footer = () => {
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const aboutContent = (
    <div className="space-y-4 text-muted-foreground">
      <p>
        <strong className="text-foreground">BrindaRani</strong> is a spiritual e-commerce platform 
        dedicated to bringing authentic, satvik products from the holy land of Vrindavan to devotees worldwide.
      </p>
      <p>
        Our mission is to provide high-quality puja items, deity accessories, and spiritual goods 
        that are sourced directly from skilled artisans and trusted suppliers in Vrindavan and Mathura.
      </p>
      <p>
        Every product in our collection is blessed with devotion and crafted with traditional 
        techniques passed down through generations.
      </p>
    </div>
  );

  const contactContent = (
    <div className="space-y-4 text-muted-foreground">
      <div>
        <h4 className="font-medium text-foreground mb-1">Address</h4>
        <p>Temple Street, Vrindavan<br />Mathura, Uttar Pradesh - 281121</p>
      </div>
      <div>
        <h4 className="font-medium text-foreground mb-1">Email</h4>
        <p>support@brindaRani.com</p>
      </div>
      <div>
        <h4 className="font-medium text-foreground mb-1">Phone</h4>
        <p>+91 98765 43210</p>
      </div>
      <div>
        <h4 className="font-medium text-foreground mb-1">Working Hours</h4>
        <p>Monday - Saturday: 9:00 AM - 8:00 PM<br />Sunday: 10:00 AM - 6:00 PM</p>
      </div>
    </div>
  );

  const termsContent = (
    <div className="space-y-4 text-muted-foreground text-sm">
      <section>
        <h4 className="font-medium text-foreground mb-2">1. Acceptance of Terms</h4>
        <p>By accessing and using BrindaRani, you accept and agree to be bound by these Terms of Service.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">2. Products & Pricing</h4>
        <p>All products are subject to availability. Prices may change without prior notice. We reserve the right to limit quantities.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">3. Orders & Payment</h4>
        <p>Orders are confirmed upon successful payment. We accept UPI, Cards, and Cash on Delivery for select locations.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">4. Shipping & Delivery</h4>
        <p>Delivery times vary based on location. We ship across India. International shipping is available for select products.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">5. Returns & Refunds</h4>
        <p>Products can be returned within 7 days of delivery. Refunds are processed within 5-7 business days.</p>
      </section>
    </div>
  );

  const privacyContent = (
    <div className="space-y-4 text-muted-foreground text-sm">
      <section>
        <h4 className="font-medium text-foreground mb-2">Information We Collect</h4>
        <p>We collect information you provide directly, including name, email, address, and payment details.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">How We Use Your Information</h4>
        <p>Your information is used to process orders, provide customer support, and improve our services.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">Data Security</h4>
        <p>We implement industry-standard security measures to protect your personal information.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">Third-Party Services</h4>
        <p>We may share information with trusted partners for payment processing and shipping.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">Your Rights</h4>
        <p>You can request access, correction, or deletion of your personal data at any time.</p>
      </section>
    </div>
  );

  return (
    <>
      <footer className="bg-foreground text-background/90">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-serif font-bold mb-4 text-background">
                BrindaRani
              </h3>
              <p className="text-background/70 text-sm leading-relaxed">
                Authentic spiritual products from Vrindavan. Bringing divine blessings to your doorstep.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-background">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/products" className="text-background/70 hover:text-primary transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/category/Puja%20Items" className="text-background/70 hover:text-primary transition-colors">
                    Puja Items
                  </Link>
                </li>
                <li>
                  <Link to="/category/Idols%20%26%20Murtis" className="text-background/70 hover:text-primary transition-colors">
                    Idols & Murtis
                  </Link>
                </li>
                <li>
                  <Link to="/wishlist" className="text-background/70 hover:text-primary transition-colors">
                    Wishlist
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h4 className="font-semibold mb-4 text-background">Information</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => setModalContent({ title: 'About Us', content: aboutContent })}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setModalContent({ title: 'Contact Us', content: contactContent })}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setModalContent({ title: 'Terms of Service', content: termsContent })}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setModalContent({ title: 'Privacy Policy', content: privacyContent })}
                    className="text-background/70 hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-semibold mb-4 text-background">Connect With Us</h4>
              <p className="text-background/70 text-sm mb-4">
                Subscribe for divine updates and exclusive offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg bg-background/10 border border-background/20 
                           text-background placeholder:text-background/50 text-sm
                           focus:outline-none focus:border-primary"
                />
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium
                                 hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © 2024 BrindaRani. All rights reserved.
            </p>
            <p className="text-background/60 text-sm">
              Made with ❤️ in Vrindavan
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Dialog open={!!modalContent} onOpenChange={() => setModalContent(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif">{modalContent?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {modalContent?.content}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;

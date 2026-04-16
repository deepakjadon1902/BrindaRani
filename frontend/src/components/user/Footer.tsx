import { Link } from 'react-router-dom';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Footer = () => {
  const { appSettings } = useStore();
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const termsContent = (
    <div className="space-y-5 text-muted-foreground text-sm leading-relaxed">
      <section>
        <p>
          Welcome to Brindarani. These Terms of Service ("Terms") govern your use of our website,
          mobile application, and services. By accessing or purchasing from Brindarani, you agree
          to be bound by these Terms. Please read them carefully.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">1. About Brindarani</h4>
        <p>
          Brindarani is an eCommerce platform inspired by the spiritual heritage of Vrindavan,
          offering devotional and spiritual products including pooja items, idols, and customized kits.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">2. Eligibility</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>You are at least 18 years old or using the platform under parental supervision.</li>
          <li>You are legally capable of entering into a binding agreement under applicable laws in India.</li>
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">3. Account Responsibility</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>You agree to provide accurate and complete information.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>Any activity under your account is your responsibility.</li>
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">4. Products & Services</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Pooja essentials and accessories</li>
          <li>Idols of Gods and Goddesses</li>
          <li>Customized pooja kits</li>
        </ul>
        <p className="mt-3">
          We strive to ensure all product descriptions, images, and prices are accurate. However,
          minor variations (such as color, size, or design) may occur due to the handmade or artisanal
          nature of some items.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">5. Pricing & Payments</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>All prices are listed in INR (Rs.) unless stated otherwise.</li>
          <li>Prices are subject to change without prior notice.</li>
          <li>We use secure third-party payment gateways to process transactions.</li>
          <li>By placing an order, you agree to pay the full amount, including applicable taxes and shipping charges.</li>
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">6. Order Acceptance & Cancellation</h4>
        <p>Once an order is placed, you will receive a confirmation.</p>
        <p className="mt-2">Brindarani reserves the right to cancel or refuse any order due to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Product unavailability</li>
          <li>Pricing errors</li>
          <li>Suspicious or fraudulent activity</li>
        </ul>
        <p className="mt-2">If your order is cancelled, you will be notified and refunded accordingly.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">7. Shipping & Delivery</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Delivery timelines may vary based on your location and product availability.</li>
          <li>While we aim to deliver on time, delays may occur due to external factors (logistics, weather, etc.).</li>
          <li>Shipping charges, if applicable, will be displayed at checkout.</li>
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">8. Returns & Refunds</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Returns are accepted only under specific conditions such as damaged, defective, or incorrect items.</li>
          <li>Requests must be raised within [X] days of delivery.</li>
          <li>Refunds will be processed after verification of the returned product.</li>
          <li>Certain items (such as customized pooja kits or used products) may not be eligible for return.</li>
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">9. Intellectual Property</h4>
        <p>
          All content on Brindarani, including logos, images, product descriptions, and designs,
          is the property of Brindarani and is protected under applicable intellectual property laws.
          You may not copy, reproduce, or distribute any content without prior permission.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">10. User Conduct</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Violate any laws or regulations</li>
          <li>Use the platform for fraudulent purposes</li>
          <li>Interfere with the functioning or security of the platform</li>
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">11. Limitation of Liability</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Any indirect, incidental, or consequential damages</li>
          <li>Delays or failures caused by circumstances beyond our control</li>
          <li>Any misuse of products purchased from our platform</li>
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">12. Privacy</h4>
        <p>
          Your use of Brindarani is also governed by our Privacy Policy, which explains how we collect,
          use, and protect your data.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">13. Modifications to Terms</h4>
        <p>
          We reserve the right to update or modify these Terms at any time. Changes will be effective
          immediately upon posting on the platform. Continued use of the service indicates your
          acceptance of the updated Terms.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">14. Governing Law</h4>
        <p>
          These Terms shall be governed by and interpreted in accordance with the laws of India. Any
          disputes will be subject to the jurisdiction of the courts in [Your City/State].
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">15. Contact Us</h4>
        <p>If you have any questions regarding these Terms, you can contact us at:</p>
        <p className="mt-2">Email: [Your Email]</p>
        <p>Address: [Your Business Address]</p>
      </section>
    </div>
  );

  const privacyContent = (
    <div className="space-y-5 text-muted-foreground text-sm leading-relaxed">
      <section>
        <p>
          At Brindarani, your trust is deeply valued. We are committed to protecting your personal
          information and ensuring a safe, secure, and seamless shopping experience. This Privacy
          Policy explains how we collect, use, and safeguard your data when you use our website or
          mobile application.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">1. About Us</h4>
        <p>
          Brindarani is an eCommerce platform inspired by the spiritual essence of Vrindavan,
          offering a wide range of devotional and spiritual products across India.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">2. Information We Collect</h4>
        <p className="mb-2">To provide you with a smooth and personalized experience, we may collect:</p>
        <p className="font-medium text-foreground">a) Personal Information</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Shipping and billing address</li>
        </ul>
        <p className="font-medium text-foreground mt-4">b) Payment Information</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Payment details (processed securely via third-party payment gateways)</li>
          <li>We do not store your card or banking details on our servers</li>
        </ul>
        <p className="font-medium text-foreground mt-4">c) Device & Usage Information</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>IP address</li>
          <li>Device type and browser</li>
          <li>App usage behavior and preferences</li>
        </ul>
        <p className="font-medium text-foreground mt-4">d) Optional Information</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Feedback, reviews, or responses you share with us</li>
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">3. How We Use Your Information</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Process and deliver your orders</li>
          <li>Provide customer support</li>
          <li>Improve our platform and user experience</li>
          <li>Send order updates, offers, and important notifications</li>
          <li>Prevent fraud and enhance security</li>
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">4. Sharing of Information</h4>
        <p>We respect your privacy and do not sell your personal data. However, we may share your information with:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Logistics partners for order delivery</li>
          <li>Payment gateway providers for secure transactions</li>
          <li>Service providers (such as hosting or analytics tools) to improve our services</li>
        </ul>
        <p className="mt-2">All third parties are obligated to keep your data secure and confidential.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">5. Data Security</h4>
        <p>
          We implement appropriate technical and organizational measures to protect your data against
          unauthorized access, misuse, or disclosure. While we strive to use industry-standard security
          practices, no system is completely foolproof.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">6. Cookies & Tracking Technologies</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Enhance your browsing experience</li>
          <li>Remember your preferences</li>
          <li>Analyze platform performance</li>
        </ul>
        <p className="mt-2">
          You can choose to disable cookies through your browser settings, though some features may not
          function properly.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">7. Your Rights & Choices</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access and update your personal information</li>
          <li>Request deletion of your data (subject to legal obligations)</li>
          <li>Opt out of promotional communications at any time</li>
        </ul>
        <p className="mt-2">To exercise these rights, you can contact us using the details below.</p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">8. Data Retention</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Fulfill orders</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce our agreements</li>
        </ul>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">9. Children's Privacy</h4>
        <p>
          Brindarani is not intended for individuals under the age of 18. We do not knowingly collect
          personal information from children.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">10. Third-Party Links</h4>
        <p>
          Our platform may contain links to third-party websites or services. We are not responsible
          for their privacy practices, and we encourage you to review their policies separately.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">11. Changes to This Policy</h4>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or
          legal requirements. Updated versions will be posted on this page with the revised effective date.
        </p>
      </section>
      <section>
        <h4 className="font-medium text-foreground mb-2">12. Contact Us</h4>
        <p>If you have any questions or concerns about this Privacy Policy or your data, please reach out to us:</p>
        <p className="mt-2">Email: [Your Email]</p>
        <p>Address: [Your Business Address]</p>
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
              <div className="flex items-center gap-3 mb-4">
                {appSettings.logoUrl ? (
                  <img
                    src={appSettings.logoUrl}
                    alt={`${appSettings.appName} logo`}
                    className="h-8 w-8 rounded-full object-cover border border-background/20"
                  />
                ) : null}
                <h3 className="text-2xl font-serif font-bold text-background">
                  {appSettings.appName || 'Brindarani'}
                </h3>
              </div>
              <p className="text-background/70 text-sm leading-relaxed">
                {appSettings.motto || 'Authentic spiritual products from Vrindavan. Bringing divine blessings to your doorstep.'}
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
                  <Link to="/about" className="text-background/70 hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-background/70 hover:text-primary transition-colors">
                    Contact Us
                  </Link>
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
              (c) 2024 {appSettings.appName || 'Brindarani'}. All rights reserved.
            </p>
            <p className="text-background/60 text-sm">
              Made with love in Vrindavan
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




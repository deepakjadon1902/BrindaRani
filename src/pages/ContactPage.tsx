import { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! Your message has been sent. We\'ll get back to you soon. 🙏');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      lines: ['Temple Street, Vrindavan', 'Mathura, Uttar Pradesh - 281121'],
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['support@brindaRani.com', 'orders@brindaRani.com'],
    },
    {
      icon: Phone,
      title: 'Call Us',
      lines: ['+91 98765 43210', '+91 87654 32109'],
    },
    {
      icon: Clock,
      title: 'Working Hours',
      lines: ['Mon - Sat: 9:00 AM - 8:00 PM', 'Sunday: 10:00 AM - 6:00 PM'],
    },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <span className="text-sm text-primary font-medium uppercase tracking-wider mb-3 block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We'd love to hear from you. Reach out for any queries about our products, 
            orders, or custom requests.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <div key={i} className="bg-background p-6 rounded-2xl border border-border shadow-sm text-center hover:shadow-lg transition-shadow group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <info.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                {info.lines.map((line, j) => (
                  <p key={j} className="text-sm text-muted-foreground">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-background p-8 md:p-10 rounded-3xl border border-border shadow-sm">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">
                Send Us a Message
              </h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we'll respond within 24 hours.
              </p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={e => setFormData(d => ({ ...d, name: e.target.value }))}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData(d => ({ ...d, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={e => setFormData(d => ({ ...d, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={e => setFormData(d => ({ ...d, subject: e.target.value }))}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={e => setFormData(d => ({ ...d, message: e.target.value }))}
                    placeholder="Write your message here..."
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full gap-2">
                  <Send size={18} />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Map / Location visual */}
            <div className="flex flex-col gap-6">
              <div className="flex-1 rounded-3xl overflow-hidden border border-border shadow-sm min-h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14154.36!2d77.6869!3d27.5833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736e2f1f7f5e3f%3A0x53a5c1e80d9a4a9e!2sVrindavan%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1690000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="BrindaRani Location"
                />
              </div>
              <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-3xl text-primary-foreground">
                <h3 className="text-xl font-serif font-bold mb-2">🙏 Visit Our Store</h3>
                <p className="opacity-90 text-sm leading-relaxed">
                  Experience the divine atmosphere of our Vrindavan store. Touch and feel 
                  our handcrafted products, receive blessings, and discover unique spiritual 
                  items that you won't find online.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;

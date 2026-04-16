import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { resolveAssetUrl, settingsAPI, uploadAPI } from '@/services/api';
import { useStore } from '@/store/useStore';

type SettingsFormState = {
  appName: string;
  motto: string;
  logoUrl: string;
  faviconUrl: string;
  paymentEnabled: boolean;
  paymentProvider: string;
  paymentKeyId: string;
  paymentKeySecret: string;
  upiId: string;
  shippingFee: string;
  freeShippingThreshold: string;
  notificationEmail: string;
  notificationWhatsapp: string;
  adminEmail: string;
  adminPassword: string;
};

const AdminSettings = () => {
  const { appSettings, updateAppSettings } = useStore();
  const [form, setForm] = useState<SettingsFormState>({
    appName: appSettings.appName,
    motto: appSettings.motto,
    logoUrl: appSettings.logoUrl,
    faviconUrl: appSettings.faviconUrl,
    paymentEnabled: appSettings.paymentEnabled,
    paymentProvider: appSettings.paymentProvider,
    paymentKeyId: '',
    paymentKeySecret: '',
    upiId: appSettings.upiId,
    shippingFee: String(appSettings.shippingFee ?? ''),
    freeShippingThreshold: String(appSettings.freeShippingThreshold ?? ''),
    notificationEmail: appSettings.notificationEmail,
    notificationWhatsapp: appSettings.notificationWhatsapp,
    adminEmail: '',
    adminPassword: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(appSettings.logoUrl);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState(appSettings.faviconUrl);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await settingsAPI.getAdmin();
        setForm((prev) => ({
          ...prev,
          appName: data.appName || prev.appName,
          motto: data.motto || '',
          logoUrl: resolveAssetUrl(data.logoUrl),
          faviconUrl: resolveAssetUrl(data.faviconUrl),
          paymentEnabled: Boolean(data.paymentEnabled),
          paymentProvider: data.paymentProvider || 'razorpay',
          paymentKeyId: data.paymentKeyId || '',
          upiId: data.upiId || '',
          shippingFee: String(data.shippingFee ?? ''),
          freeShippingThreshold: String(data.freeShippingThreshold ?? ''),
          notificationEmail: data.notificationEmail || '',
          notificationWhatsapp: data.notificationWhatsapp || '',
          adminEmail: data.adminEmail || '',
        }));
        setLogoPreview(resolveAssetUrl(data.logoUrl));
        setFaviconPreview(resolveAssetUrl(data.faviconUrl));
      } catch (error) {
        console.error('Failed to load admin settings:', error);
      }
    };
    load();
  }, []);

  const generateFaviconFromLogo = async (file: File) => {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      const loaded = new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load logo'));
      });
      img.src = url;
      await loaded;

      const size = 32;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      const scale = Math.max(size / img.width, size / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (size - width) / 2;
      const y = (size - height) / 2;
      ctx.drawImage(img, x, y, width, height);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      );
      if (!blob) throw new Error('Failed to generate favicon');
      return {
        file: new File([blob], 'favicon-32.png', { type: 'image/png' }),
        preview: canvas.toDataURL('image/png'),
      };
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    try {
      const { file: favicon, preview } = await generateFaviconFromLogo(file);
      setFaviconFile(favicon);
      setFaviconPreview(preview);
    } catch (error) {
      console.error('Failed to generate favicon:', error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let logoUrl = form.logoUrl;
      let faviconUrl = form.faviconUrl;
      if (logoFile) {
        const { urls } = await uploadAPI.uploadImages([logoFile]);
        logoUrl = resolveAssetUrl(urls?.[0] || logoUrl);
      }
      if (faviconFile) {
        const { urls } = await uploadAPI.uploadImages([faviconFile]);
        faviconUrl = resolveAssetUrl(urls?.[0] || faviconUrl);
      }

      const payload: Record<string, any> = {
        appName: form.appName.trim(),
        motto: form.motto.trim(),
        logoUrl,
        faviconUrl,
        paymentEnabled: form.paymentEnabled,
        paymentProvider: form.paymentProvider.trim(),
        paymentKeyId: form.paymentKeyId.trim(),
        upiId: form.upiId.trim(),
        shippingFee: Number(form.shippingFee) || 0,
        freeShippingThreshold: Number(form.freeShippingThreshold) || 0,
        notificationEmail: form.notificationEmail.trim(),
        notificationWhatsapp: form.notificationWhatsapp.trim(),
      };

      if (form.paymentKeySecret.trim()) {
        payload.paymentKeySecret = form.paymentKeySecret.trim();
      }

      await updateAppSettings(payload);

      if (form.adminEmail.trim() && form.adminPassword.trim()) {
        await settingsAPI.updateAdminCredentials(form.adminEmail.trim(), form.adminPassword.trim());
      }

      setForm((prev) => ({
        ...prev,
        logoUrl,
        faviconUrl,
        adminPassword: '',
        paymentKeySecret: '',
      }));
      toast.success('Settings updated');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage application branding, payment, notifications, and admin access.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="admin-card space-y-4">
          <h2 className="text-lg font-semibold">Branding</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Application Name</Label>
              <Input
                value={form.appName}
                onChange={(e) => setForm({ ...form, appName: e.target.value })}
                placeholder="App name"
              />
            </div>
            <div>
              <Label>Motto / Tagline</Label>
              <Input
                value={form.motto}
                onChange={(e) => setForm({ ...form, motto: e.target.value })}
                placeholder="App motto"
              />
            </div>
          </div>
          <div>
            <Label>Upload Logo</Label>
            <Input type="file" accept="image/*" onChange={handleLogoSelect} className="mt-1" />
            {logoPreview && (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-20 w-20 rounded-full object-cover border border-border"
                />
                {faviconPreview && (
                  <div className="text-xs text-muted-foreground">
                    <span className="block font-medium text-foreground">Auto favicon</span>
                    <img
                      src={faviconPreview}
                      alt="Favicon preview"
                      className="mt-1 h-8 w-8 rounded border border-border"
                    />
                    <span className="mt-1 block">Generated at 32x32</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="admin-card space-y-4">
          <h2 className="text-lg font-semibold">Payment Settings</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="block">Enable Payments</Label>
              <p className="text-xs text-muted-foreground">Turn on/off payment processing in the app.</p>
            </div>
            <Switch
              checked={form.paymentEnabled}
              onCheckedChange={(checked) => setForm({ ...form, paymentEnabled: checked })}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Provider</Label>
              <Input
                value={form.paymentProvider}
                onChange={(e) => setForm({ ...form, paymentProvider: e.target.value })}
                placeholder="razorpay"
              />
            </div>
            <div>
              <Label>UPI ID</Label>
              <Input
                value={form.upiId}
                onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                placeholder="your@upi"
              />
            </div>
            <div>
              <Label>Shipping Fee (Rs)</Label>
              <Input
                type="number"
                value={form.shippingFee}
                onChange={(e) => setForm({ ...form, shippingFee: e.target.value })}
                placeholder="50"
              />
            </div>
            <div>
              <Label>Free Shipping Above (Rs)</Label>
              <Input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: e.target.value })}
                placeholder="500"
              />
            </div>
            <div>
              <Label>Payment Key ID</Label>
              <Input
                value={form.paymentKeyId}
                onChange={(e) => setForm({ ...form, paymentKeyId: e.target.value })}
                placeholder="Key ID"
              />
            </div>
            <div>
              <Label>Payment Key Secret</Label>
              <Input
                value={form.paymentKeySecret}
                onChange={(e) => setForm({ ...form, paymentKeySecret: e.target.value })}
                placeholder="Leave blank to keep existing"
                type="password"
              />
            </div>
          </div>
        </div>

        <div className="admin-card space-y-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Notification Email</Label>
              <Input
                value={form.notificationEmail}
                onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })}
                placeholder="alerts@yourdomain.com"
              />
            </div>
            <div>
              <Label>Notification WhatsApp</Label>
              <Input
                value={form.notificationWhatsapp}
                onChange={(e) => setForm({ ...form, notificationWhatsapp: e.target.value })}
                placeholder="+91XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        <div className="admin-card space-y-4">
          <h2 className="text-lg font-semibold">Admin Access</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Admin Email</Label>
              <Input
                value={form.adminEmail}
                onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
                placeholder="admin@yourdomain.com"
              />
            </div>
            <div>
              <Label>New Admin Password</Label>
              <Input
                value={form.adminPassword}
                onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
                placeholder="Set new password"
                type="password"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Saving this will change the admin login credentials.
          </p>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="btn-sacred" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;


import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

const upsertMeta = (key: 'name' | 'property', value: string, content: string) => {
  if (!content) return;
  const selector = `meta[${key}="${value}"]`;
  const el = document.querySelector(selector) as HTMLMetaElement | null;
  if (el) {
    el.setAttribute('content', content);
    return;
  }
  const meta = document.createElement('meta');
  meta.setAttribute(key, value);
  meta.setAttribute('content', content);
  document.head.appendChild(meta);
};

const upsertLink = (rel: string, href: string) => {
  if (!href) return;
  const existing = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (existing) {
    existing.href = href;
    return;
  }
  const link = document.createElement('link');
  link.rel = rel;
  link.href = href;
  document.head.appendChild(link);
};

const AppMetaUpdater = () => {
  const { appSettings, fetchAppSettings } = useStore();

  useEffect(() => {
    fetchAppSettings();
  }, [fetchAppSettings]);

  useEffect(() => {
    const name = appSettings.appName || 'Brindarani';
    const motto = (appSettings.motto || 'Sacred E-Commerce from Vrindavan').trim();
    const logo = appSettings.logoUrl || '';
    const favicon = appSettings.faviconUrl || '';

    const title = motto ? `${name} | ${motto}` : name;
    const description = motto ? `${name} - ${motto}` : name;

    document.title = title;

    upsertMeta('name', 'description', description);
    upsertMeta('name', 'application-name', name);
    upsertMeta('name', 'apple-mobile-web-app-title', name);

    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    if (logo) upsertMeta('property', 'og:image', logo);

    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);
    if (logo) upsertMeta('name', 'twitter:image', logo);

    if (favicon || logo) {
      upsertLink('icon', favicon || logo);
      upsertLink('apple-touch-icon', logo || favicon);
    }
  }, [appSettings]);

  return null;
};

export default AppMetaUpdater;

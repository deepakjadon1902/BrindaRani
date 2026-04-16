import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { resolveAssetUrl } from '@/services/api';

const updateMetaTag = (id: string, content: string) => {
  const element = document.getElementById(id) as HTMLMetaElement | null;
  if (element && content) {
    element.setAttribute('content', content);
  }
};

const updateLinkTag = (id: string, href: string) => {
  const element = document.getElementById(id) as HTMLLinkElement | null;
  if (element && href) {
    element.href = href;
  }
};

const updateTitle = (title: string) => {
  const titleElement = document.getElementById('page-title');
  if (titleElement) {
    titleElement.textContent = title;
  }
  document.title = title;
};

const AppMetaUpdater = () => {
  const { appSettings, fetchAppSettings } = useStore();

  useEffect(() => {
    fetchAppSettings();
  }, [fetchAppSettings]);

  useEffect(() => {
    if (!appSettings.appName) return;

    const name = appSettings.appName || 'Brindarani';
    const motto = (appSettings.motto || '').trim();
    const logo = resolveAssetUrl(appSettings.logoUrl || '');
    const favicon = resolveAssetUrl(appSettings.faviconUrl || '');
    const pageUrl = window.location.href;

    const title = motto ? `${name} | ${motto}` : name;
    const description = motto ? `${name} - ${motto}` : name;

    // Update page title
    updateTitle(title);

    // Update all meta tags using IDs
    updateMetaTag('meta-description', description);
    updateMetaTag('app-name', name);
    updateMetaTag('app-mobile-title', name);
    updateMetaTag('og-title', title);
    updateMetaTag('og-description', description);
    updateMetaTag('og-site-name', name);
    updateMetaTag('og-url', pageUrl);
    updateMetaTag('twitter-title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('meta-canonical', pageUrl);

    // Update favicons and images
    if (favicon) {
      updateLinkTag('icon-favicon', favicon);
      updateLinkTag('icon-apple', favicon);
    }

    if (logo) {
      updateMetaTag('og-image', logo);
      updateMetaTag('og-image-alt', `${name} logo`);
    }
  }, [appSettings]);

  return null;
};

export default AppMetaUpdater;

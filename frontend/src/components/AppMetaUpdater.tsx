import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { resolveAssetUrl } from '@/services/api';

const DEFAULT_TITLE = 'Shop Pure Tulsi Mala, Radha Krishna Accessories & Pooja Essentials';
const DEFAULT_DESCRIPTION = 'Brindarani offers authentic Tulsi Kanthi Mala, japa mala, Radha Krishna accessories, pooja essentials, and devotional products for Krishna bhakti.';
const DEFAULT_KEYWORDS = 'Tulsi Mala, Tulsi Kanthi Mala, japa mala, Radha Krishna accessories, pooja essentials, Krishna bhakti, devotional products, Brindarani';
const DEFAULT_SITE_NAME = 'Brindarani';
const CANONICAL_SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://brindarani.com').replace(/\/+$/, '');

const pageMetaByPath: Record<string, { title: string; description: string }> = {
  '/': { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  '/products': {
    title: 'Shop Devotional Products, Tulsi Mala & Pooja Essentials | Brindarani',
    description: DEFAULT_DESCRIPTION,
  },
  '/about': {
    title: 'About Brindarani | Authentic Krishna Bhakti Products',
    description: 'Learn about Brindarani and our devotional collection of Tulsi Mala, pooja essentials, Radha Krishna accessories, and Krishna bhakti products.',
  },
  '/contact': {
    title: 'Contact Brindarani | Devotional Products Support',
    description: 'Contact Brindarani for help with Tulsi Mala, japa mala, Radha Krishna accessories, pooja essentials, orders, and devotional products.',
  },
  '/custom-design': {
    title: 'Custom Devotional Products & Pooja Essentials | Brindarani',
    description: 'Request custom devotional products, pooja essentials, and Krishna bhakti accessories from Brindarani.',
  },
};

const cleanText = (value?: string) => (value || '').replace(/\s+/g, ' ').trim();

const limitText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  const trimmed = value.slice(0, maxLength - 1).trimEnd();
  return `${trimmed.replace(/[,.:-]+$/, '')}...`;
};

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

const getCanonicalUrl = (pathname: string) => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const origin = isLocalhost ? window.location.origin : CANONICAL_SITE_URL;
  return `${origin}${pathname === '/' ? '/' : pathname}`;
};

const AppMetaUpdater = () => {
  const location = useLocation();
  const { appSettings, fetchAppSettings, products, fetchProducts, isLoadingProducts } = useStore();

  useEffect(() => {
    fetchAppSettings();
  }, [fetchAppSettings]);

  useEffect(() => {
    const productMatch = matchPath('/product/:id', location.pathname);
    if (productMatch && products.length === 0 && !isLoadingProducts) {
      fetchProducts();
    }
  }, [fetchProducts, isLoadingProducts, location.pathname, products.length]);

  useEffect(() => {
    const name = appSettings.appName || DEFAULT_SITE_NAME;
    const logo = resolveAssetUrl(appSettings.logoUrl || '');
    const favicon = resolveAssetUrl(appSettings.faviconUrl || '');
    const pageUrl = getCanonicalUrl(location.pathname);
    const productMatch = matchPath('/product/:id', location.pathname);
    const product = productMatch?.params.id
      ? products.find((item) => item.id === productMatch.params.id)
      : null;

    const pageMeta = pageMetaByPath[location.pathname] || {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    };

    const title = product
      ? `${cleanText(product.name)} | ${name}`
      : pageMeta.title;
    const description = product
      ? limitText(cleanText(product.description) || DEFAULT_DESCRIPTION, 160)
      : pageMeta.description;
    const image = product?.images?.[0] ? resolveAssetUrl(product.images[0]) : logo;

    updateTitle(title);

    updateMetaTag('meta-description', description);
    updateMetaTag('meta-keywords', DEFAULT_KEYWORDS);
    updateMetaTag('app-name', name);
    updateMetaTag('app-mobile-title', name);
    updateMetaTag('og-title', title);
    updateMetaTag('og-description', description);
    updateMetaTag('og-type', product ? 'product' : 'website');
    updateMetaTag('og-site-name', name);
    updateMetaTag('og-url', pageUrl);
    updateMetaTag('twitter-title', title);
    updateMetaTag('twitter:description', description);
    updateLinkTag('meta-canonical', pageUrl);

    if (favicon) {
      updateLinkTag('icon-favicon', favicon);
      updateLinkTag('icon-apple', favicon);
    }

    if (image) {
      updateMetaTag('og-image', image);
      updateMetaTag('og-image-alt', product ? cleanText(product.name) : `${name} logo`);
      updateMetaTag('twitter-image', image);
    }
  }, [appSettings, location.pathname, products]);

  return null;
};

export default AppMetaUpdater;

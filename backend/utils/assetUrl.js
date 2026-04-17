const normalizeStoredAssetUrl = (value) => {
  if (!value) return '';
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('data:')) return trimmed;

  const normalizedSlashes = trimmed.replace(/\\/g, '/');

  // If it's an absolute URL and points to an uploaded file, store only the path
  // so it works across environments (localhost, Render, etc.).
  try {
    const url = new URL(normalizedSlashes);
    const pathname = url.pathname || '';
    const uploadsIndex = pathname.indexOf('/uploads/');
    if (uploadsIndex !== -1) return pathname.slice(uploadsIndex);
    return normalizedSlashes;
  } catch {
    // Not an absolute URL
  }

  // Normalize "uploads/..." to "/uploads/..."
  if (normalizedSlashes.startsWith('uploads/')) return `/${normalizedSlashes}`;

  // Keep "/uploads/..." as-is
  if (normalizedSlashes.startsWith('/uploads/')) return normalizedSlashes;

  // Keep other relative/absolute-ish values (e.g. external URLs, frontend assets) unchanged
  return normalizedSlashes;
};

module.exports = { normalizeStoredAssetUrl };


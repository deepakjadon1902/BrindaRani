const path = require('path');

const hasImageKitConfig = () => Boolean(
  process.env.IMAGEKIT_PRIVATE_KEY &&
  process.env.IMAGEKIT_PUBLIC_KEY &&
  process.env.IMAGEKIT_URL_ENDPOINT
);

const uploadImageBuffer = async (buffer, options = {}) => {
  if (!hasImageKitConfig()) throw new Error('ImageKit is not configured');
  const originalName = String(options.fileName || `image-${Date.now()}`).replace(/[^a-zA-Z0-9.-]/g, '_');
  const baseName = path.parse(originalName).name || `image-${Date.now()}`;
  const form = new FormData();
  form.append('file', new Blob([buffer]));
  form.append('fileName', `${baseName}.webp`);
  form.append('folder', `/Brindarani/${String(options.folder || 'misc').replace(/[^a-zA-Z0-9/_-]/g, '')}`);
  form.append('useUniqueFileName', 'true');
  form.append('transformation', JSON.stringify({ pre: 'f-webp,q-80' }));
  form.append('tags', JSON.stringify(['brindarani', String(options.folder || 'misc')]));

  const authorization = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64');
  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: { Authorization: `Basic ${authorization}` },
    body: form,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || `ImageKit upload failed (${response.status})`);
  return result;
};

module.exports = { hasImageKitConfig, uploadImageBuffer };

let cloudinaryModule;

const getCloudinary = () => {
  if (!cloudinaryModule) {
    // Lazily require so local dev can still run without the dependency
    // when Cloudinary env vars are not set.
    // eslint-disable-next-line global-require
    cloudinaryModule = require('cloudinary').v2;
  }
  return cloudinaryModule;
};

const hasCloudinaryConfig = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  return Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
};

let configured = false;
const ensureConfigured = () => {
  if (configured) return;
  if (!hasCloudinaryConfig()) return;

  const cloudinary = getCloudinary();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  configured = true;
};

const uploadImageBuffer = (buffer, options = {}) => {
  ensureConfigured();
  const cloudinary = getCloudinary();

  const folderRoot = (process.env.CLOUDINARY_FOLDER || 'brindarani').trim() || 'brindarani';
  const { folder: requestedFolder, ...restOptions } = options || {};
  const folder = requestedFolder ? `${folderRoot}/${requestedFolder}` : folderRoot;

  const uploadOptions = {
    ...restOptions,
    resource_type: 'image',
    folder,
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) return reject(error);
      if (!result) return reject(new Error('Cloudinary upload failed'));
      resolve(result);
    });
    stream.end(buffer);
  });
};

module.exports = {
  hasCloudinaryConfig,
  uploadImageBuffer,
};

// src/config/multer.js
import multer from 'multer';
import cloudinary from './cloudinary.js';
import streamifier from 'streamifier';

// set up multer memory storage
const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB default (images smaller by usage)
  }
});

/**
 * Helper: upload buffer to Cloudinary using upload_stream
 * resourceType: 'image' or 'raw' (for pdf)
 * folder: folder name in cloudinary
 */
const uploadBufferToCloudinary = (buffer, { folder = '', resource_type = 'image', filename }) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type, public_id: filename ? filename.replace(/[^a-zA-Z0-9-_]/g, '_') : undefined },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Middleware factory for images (jpg/png/webp)
export const uploadImage = (fieldName = 'image') => {
  // first parse single file into memory
  const single = upload.single(fieldName);

  return async (req, res, next) => {
    single(req, res, async (err) => {
      if (err) return next(err);
      if (!req.file) return next();

      // Basic mime/type check
      const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Invalid image type. Allowed: jpg, jpeg, png, webp' });
      }

      try {
        const result = await uploadBufferToCloudinary(req.file.buffer, {
          folder: 'cse_department/images',
          resource_type: 'image'
        });

        // normalize to existing code expectations
        req.file.path = result.secure_url;
        req.file.public_id = result.public_id;
        req.file.cloudinary_raw = result; // full response if needed
        next();
      } catch (uploadErr) {
        next(uploadErr);
      }
    });
  };
};

// Middleware factory for pdf (field name default 'pdf')
export const uploadPDF = (fieldName = 'pdf') => {
  const single = upload.single(fieldName);

  return async (req, res, next) => {
    single(req, res, async (err) => {
      if (err) return next(err);
      if (!req.file) return next();

      const allowed = ['application/pdf'];
      if (!allowed.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Invalid file type. Only PDF allowed' });
      }

      try {
        const result = await uploadBufferToCloudinary(req.file.buffer, {
          folder: 'cse_department/pdfs',
          resource_type: 'raw' // PDFs -> raw
        });

        req.file.path = result.secure_url;
        req.file.public_id = result.public_id;
        req.file.cloudinary_raw = result;
        next();
      } catch (uploadErr) {
        next(uploadErr);
      }
    });
  };
};

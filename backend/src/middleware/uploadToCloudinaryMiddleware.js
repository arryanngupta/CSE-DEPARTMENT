// src/middleware/uploadToCloudinaryMiddleware.js
import multer from "multer";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

const memory = multer({ storage: multer.memoryStorage() });

/**
 * Usage: attach to route like:
 *  router.post('/create', uploadToCloudinarySingle('image', { folder: 'sliders', resource_type: 'image' }), controller.createSlider)
 *
 * fieldName: the form field name for the file
 * options: cloudinary upload options, e.g. { folder: 'sliders', resource_type: 'image' }
 */
export function uploadToCloudinarySingle(fieldName, options = {}) {
  const multerSingle = memory.single(fieldName);

  return async function (req, res, next) {
    // run multer to parse file into req.file (buffer)
    multerSingle(req, res, async (err) => {
      if (err) return next(err);

      // if no file, continue
      if (!req.file || !req.file.buffer) return next();

      try {
        // upload buffer to cloudinary
        const result = await uploadBufferToCloudinary(req.file.buffer, options);

        // mutate req.file to mimic previous setup where req.file.path was the uploaded url
        req.file.path = result.secure_url || result.url; // controllers expect req.file.path
        req.file.cloudinary_public_id = result.public_id;
        req.file.cloudinary_resource_type = result.resource_type;

        // optionally attach full result
        req.file.cloudinary_result = result;

        next();
      } catch (uploadErr) {
        next(uploadErr);
      }
    });
  };
}

// src/utils/uploadToCloudinary.js
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

/**
 * Upload a Buffer to Cloudinary using upload_stream.
 * options are forwarded to cloudinary.uploader.upload_stream (folder, resource_type, public_id, etc).
 * Returns the Cloudinary result object.
 */
export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

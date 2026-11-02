/**
 * Cloudinary Unsigned Upload Engine
 * Direct browser-to-Cloudinary upload for portfolio images and media.
 * Avoids storing multi-megabyte base64 strings in Firestore, keeping
 * documents tiny (~2-5 KB) and lightning fast.
 */

export const CLOUDINARY_CLOUD_NAME =
  (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) || 'dwo7oemds';

export const CLOUDINARY_UPLOAD_PRESET =
  (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) || 'VDVC_PORTFOLIO';

export interface UploadOptions {
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  folder?: string;
  onProgress?: (percent: number) => void;
}

/**
 * Uploads any image, audio memo, or document directly to Cloudinary.
 * Returns the secure HTTPS CDN URL.
 */
export async function uploadToCloudinary(
  file: File | Blob,
  options?: UploadOptions
): Promise<string> {
  const cloudName = CLOUDINARY_CLOUD_NAME;
  const preset = CLOUDINARY_UPLOAD_PRESET;

  const resourceType = options?.resourceType || 'auto';
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);
  if (options?.folder) {
    formData.append('folder', options.folder);
  }

  // Use XMLHttpRequest if progress callback is needed, otherwise standard fetch
  if (options?.onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          options.onProgress?.(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data.secure_url);
          } catch (e) {
            reject(new Error('Invalid response from Cloudinary'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.responseText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during Cloudinary upload'));
      xhr.send(formData);
    });
  }

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Upload failed with status ${res.status}: ${errorBody}`);
  }

  const data = await res.json();
  return data.secure_url;
}

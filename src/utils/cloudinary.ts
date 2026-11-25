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

export interface ImageTransformOptions {
  width?: number;
  quality?: 'auto' | 'auto:good' | 'auto:best' | 'auto:eco';
}

/**
 * Rewrites a Cloudinary image delivery URL to serve an auto-formatted (WebP/AVIF),
 * auto-quality, width-capped variant so browsers don't decode 26–50 MP originals
 * for thumbnails and scrollable cards. Non-Cloudinary URLs and URLs that already
 * contain delivery transforms are returned unchanged.
 */
export function getOptimizedImageUrl(
  url: string | undefined | null,
  options?: ImageTransformOptions
): string {
  if (!url) return '';
  const marker = '/image/upload/';
  if (!url.includes('res.cloudinary.com') || !url.includes(marker)) {
    return url;
  }

  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const prefix = url.slice(0, idx + marker.length);
  const rest = url.slice(idx + marker.length);

  const firstSegment = rest.split('/')[0] || '';
  if (
    firstSegment &&
    !/^v\d+$/.test(firstSegment) &&
    /(?:^|,)(?:w_|h_|c_|f_|q_|dpr_|ar_)/.test(firstSegment)
  ) {
    return url;
  }

  const parts = ['f_auto', `q_${options?.quality || 'auto'}`];
  if (options?.width && options.width > 0) {
    parts.push(`c_limit,w_${Math.round(options.width)}`);
  }

  return `${prefix}${parts.join(',')}/${rest}`;
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

export interface BatchUploadResult {
  urls: string[];
  failed: { fileName: string; error: string }[];
}

/**
 * Uploads multiple files to Cloudinary with bounded concurrency while
 * preserving the input file order for successful uploads.
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  options?: {
    resourceType?: UploadOptions['resourceType'];
    folder?: string;
    concurrency?: number;
    onFileComplete?: (completedCount: number, totalCount: number) => void;
  }
): Promise<BatchUploadResult> {
  if (files.length === 0) {
    return { urls: [], failed: [] };
  }

  const results: (string | null)[] = new Array(files.length).fill(null);
  const failed: { fileName: string; error: string }[] = [];
  const concurrency = Math.max(1, Math.min(options?.concurrency ?? 4, files.length));
  let nextIndex = 0;
  let completedCount = 0;

  const worker = async () => {
    while (nextIndex < files.length) {
      const idx = nextIndex++;
      const file = files[idx];
      try {
        results[idx] = await uploadToCloudinary(file, {
          resourceType: options?.resourceType,
          folder: options?.folder,
        });
      } catch (err) {
        failed.push({
          fileName: file.name,
          error: err instanceof Error ? err.message : String(err),
        });
      } finally {
        completedCount += 1;
        options?.onFileComplete?.(completedCount, files.length);
      }
    }
  };

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  return {
    urls: results.filter((u): u is string => Boolean(u)),
    failed,
  };
}

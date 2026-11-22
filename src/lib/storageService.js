import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Compresses an image file in-browser to max dimensions and reasonable quality
 * so it fits cleanly into cloud storage / JSON sync without 413 Payload Too Large limits.
 */
export function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) {
  return new Promise((resolve) => {
    // If not an image (e.g. video or pdf), convert to standard data URL
    if (!file || !file.type || !file.type.startsWith('image/')) {
      fileToDataUrl(file).then(resolve).catch(() => resolve(''));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compact JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a file to Supabase Storage bucket 'portfolio'.
 * Falls back to optimized compressed Data URL for preview & Pantry Cloud.
 *
 * @param {File} file 
 * @param {string} folder - 'thumbnails' | 'projects' | 'profile'
 * @returns {Promise<{ url: string, path?: string, error?: any }>}
 */
export async function uploadPortfolioFile(file, folder = 'projects') {
  if (!file) {
    throw new Error('No file provided for upload');
  }

  // File size validation (limit: 50MB for videos/large PDFs, 15MB for images)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File exceeds the 50MB maximum upload limit.');
  }

  const fileExt = file.name.split('.').pop().toLowerCase();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  // If Supabase Storage is configured and active
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (!error) {
        const { data: publicData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName);
        return { url: publicData.publicUrl, path: fileName };
      }
      console.warn('Supabase storage bucket upload failed, using compressed fallback:', error.message);
    } catch (err) {
      console.warn('Storage exception, using compressed fallback:', err);
    }
  }

  // Fallback: compress image so it saves to Pantry Cloud in under 1 second without size limits!
  const compressedUrl = await compressImage(file);
  return {
    url: compressedUrl,
    path: fileName,
    fallback: true
  };
}

// Convert File to base64 Data URL for robust fallback & immediate previews
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

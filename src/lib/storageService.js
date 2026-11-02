import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Uploads a file to Supabase Storage bucket 'portfolio'.
 * Falls back to Data URL for preview if Supabase is not yet configured.
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

  // Detect file type
  const fileExt = file.name.split('.').pop().toLowerCase();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.warn('Supabase storage upload failed, falling back:', error.message);
        // If storage bucket is missing, or permission issue, fallback to data URL so user work isn't lost
        const fallbackUrl = await fileToDataUrl(file);
        return { url: fallbackUrl, path: fileName, fallback: true, message: error.message };
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName);

      return { url: publicData.publicUrl, path: fileName };
    } catch (err) {
      console.warn('Storage exception:', err);
      const fallbackUrl = await fileToDataUrl(file);
      return { url: fallbackUrl, path: fileName, fallback: true };
    }
  }

  // Local demo fallback: convert to base64 Data URL so user can preview and test immediately
  const fallbackUrl = await fileToDataUrl(file);
  return {
    url: fallbackUrl,
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


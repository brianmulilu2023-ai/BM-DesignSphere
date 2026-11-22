import { supabase, isSupabaseConfigured } from './supabase';
import {
  isCloudSyncConfigured,
  fetchFromCloud,
  pushToCloud,
  getLocalData,
} from './cloudSync';
import { fetchProjects } from './portfolioService';

export async function fetchCategories() {
  // 1. Try Cloud Sync
  if (isCloudSyncConfigured()) {
    try {
      const data = await fetchFromCloud();
      if (data.categories && data.categories.length > 0) {
        return data.categories;
      }
    } catch (e) {
      console.warn('Cloud sync categories fetch failed:', e);
    }
  }

  // 2. Try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase fetch categories failed:', err.message);
    }
  }

  // 3. Local fallback
  const { categories } = getLocalData();
  return categories || [];
}

export async function createCategory({ name, slug }) {
  const cleanSlug =
    slug ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const newCat = {
    id: 'cat-' + Date.now().toString(36),
    name: name.trim(),
    slug: cleanSlug,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').insert([newCat]);
    } catch (err) {
      console.warn('Supabase insert category note:', err.message);
    }
  }

  // Always update Cloud Sync & Local
  const fullData = await fetchFromCloud();
  const list = [...(fullData.categories || []), newCat];

  await pushToCloud({
    ...fullData,
    categories: list,
  });

  return newCat;
}

export async function updateCategory(id, { name, slug }) {
  const cleanSlug =
    slug ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const updates = { name: name.trim(), slug: cleanSlug };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').update(updates).eq('id', id);
    } catch (err) {
      console.warn('Supabase update category note:', err.message);
    }
  }

  // Always update Cloud Sync & Local
  const fullData = await fetchFromCloud();
  const list = [...(fullData.categories || [])];
  const index = list.findIndex((c) => c.id === id);

  if (index !== -1) {
    list[index] = { ...list[index], ...updates };
    await pushToCloud({
      ...fullData,
      categories: list,
    });
    return list[index];
  }

  throw new Error('Category not found');
}

export async function deleteCategory(id) {
  const allProjects = await fetchProjects();
  const associated = allProjects.filter((p) => p.category_id === id);
  if (associated.length > 0) {
    throw new Error(
      `Cannot delete category: ${associated.length} project(s) are currently assigned to it. Please reassign or delete those projects first.`
    );
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase delete category note:', err.message);
    }
  }

  // Always update Cloud Sync & Local
  const fullData = await fetchFromCloud();
  const filtered = (fullData.categories || []).filter((c) => c.id !== id);

  await pushToCloud({
    ...fullData,
    categories: filtered,
  });

  return true;
}

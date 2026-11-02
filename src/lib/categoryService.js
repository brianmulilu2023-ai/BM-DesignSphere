import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_CATEGORIES } from './mockData';
import { fetchProjects } from './portfolioService';

const LOCAL_STORAGE_KEY = 'vg_portfolio_categories';

function getLocalCategories() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_CATEGORIES;
  }
}

function saveLocalCategories(cats) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cats));
}

export async function fetchCategories() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase fetch categories failed, using fallback:', err.message);
    }
  }

  return getLocalCategories();
}

export async function createCategory({ name, slug }) {
  const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const newCat = {
    name: name.trim(),
    slug: cleanSlug,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([newCat])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase insert category error:', err.message);
    }
  }

  const list = getLocalCategories();
  const created = {
    ...newCat,
    id: 'cat-' + Date.now().toString(36)
  };
  list.push(created);
  saveLocalCategories(list);
  return created;
}

export async function updateCategory(id, { name, slug }) {
  const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const updates = { name: name.trim(), slug: cleanSlug };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase update category error:', err.message);
    }
  }

  const list = getLocalCategories();
  const index = list.findIndex(c => c.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...updates };
    saveLocalCategories(list);
    return list[index];
  }
  throw new Error('Category not found');
}

export async function deleteCategory(id) {
  // Check if projects are associated with this category
  const allProjects = await fetchProjects();
  const associated = allProjects.filter(p => p.category_id === id);
  if (associated.length > 0) {
    throw new Error(`Cannot delete category: ${associated.length} project(s) are currently assigned to it. Please reassign or delete those projects first.`);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase delete category error:', err.message);
    }
  }

  const list = getLocalCategories();
  const filtered = list.filter(c => c.id !== id);
  saveLocalCategories(filtered);
  return true;
}


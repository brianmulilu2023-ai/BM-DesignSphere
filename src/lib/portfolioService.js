import { supabase, isSupabaseConfigured } from './supabase';
import {
  isCloudSyncConfigured,
  fetchFromCloud,
  pushToCloud,
  getLocalData,
} from './cloudSync';

export async function fetchProjects({ categoryId, status, isFeatured } = {}) {
  // 1. Try Cloud Sync First (Zero-Supabase Real-Time Backend)
  if (isCloudSyncConfigured()) {
    try {
      const data = await fetchFromCloud();
      let list = data.projects || [];

      if (status) {
        list = list.filter((p) => p.status === status);
      }
      if (categoryId && categoryId !== 'all') {
        list = list.filter((p) => p.category_id === categoryId);
      }
      if (typeof isFeatured === 'boolean') {
        list = list.filter((p) => Boolean(p.is_featured) === isFeatured);
      }

      return list;
    } catch (e) {
      console.warn('Cloud sync projects fetch failed, trying next provider:', e);
    }
  }

  // 2. Try Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('projects')
        .select(`*, category:categories(id, name, slug)`)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }
      if (categoryId && categoryId !== 'all') {
        query = query.eq('category_id', categoryId);
      }
      if (typeof isFeatured === 'boolean') {
        query = query.eq('is_featured', isFeatured);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map((p) => ({
        ...p,
        category_name: p.category?.name || 'Uncategorized',
      }));
    } catch (err) {
      console.warn('Supabase fetch projects failed, falling back:', err.message);
    }
  }

  // 3. Local fallback
  const { projects } = getLocalData();
  let items = projects || [];

  if (status) {
    items = items.filter((p) => p.status === status);
  }
  if (categoryId && categoryId !== 'all') {
    items = items.filter((p) => p.category_id === categoryId);
  }
  if (typeof isFeatured === 'boolean') {
    items = items.filter((p) => Boolean(p.is_featured) === isFeatured);
  }

  return items;
}

export async function fetchProjectById(id) {
  const projects = await fetchProjects();
  return projects.find((p) => p.id === id) || null;
}

export async function createProject(projectData) {
  const newProject = {
    ...projectData,
    id: 'proj-' + Date.now().toString(36),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // If Supabase is active
  if (isSupabaseConfigured && supabase) {
    try {
      const { category_name, ...payload } = newProject;
      const { data, error } = await supabase
        .from('projects')
        .insert([payload])
        .select(`*, category:categories(id, name, slug)`)
        .single();

      if (error) throw error;
      return {
        ...data,
        category_name: data.category?.name || 'Uncategorized',
      };
    } catch (err) {
      console.warn('Supabase insert failed, using cloud/local:', err.message);
    }
  }

  // Update Cloud Sync & Local Storage
  const fullData = await fetchFromCloud();
  const updatedProjects = [newProject, ...(fullData.projects || [])];
  
  await pushToCloud({
    ...fullData,
    projects: updatedProjects,
  });

  return newProject;
}

export async function updateProject(id, updates) {
  const updatedPayload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { category_name, category, ...payload } = updatedPayload;
      const { data, error } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', id)
        .select(`*, category:categories(id, name, slug)`)
        .single();

      if (error) throw error;
      return {
        ...data,
        category_name: data.category?.name || 'Uncategorized',
      };
    } catch (err) {
      console.warn('Supabase update failed:', err.message);
    }
  }

  // Update Cloud Sync & Local Storage
  const fullData = await fetchFromCloud();
  const list = [...(fullData.projects || [])];
  const index = list.findIndex((p) => p.id === id);

  if (index !== -1) {
    list[index] = { ...list[index], ...updatedPayload };
    await pushToCloud({
      ...fullData,
      projects: list,
    });
    return list[index];
  }

  throw new Error('Project not found');
}

export async function deleteProject(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase delete failed:', err.message);
    }
  }

  // Update Cloud Sync & Local Storage
  const fullData = await fetchFromCloud();
  const filtered = (fullData.projects || []).filter((p) => p.id !== id);

  await pushToCloud({
    ...fullData,
    projects: filtered,
  });

  return true;
}

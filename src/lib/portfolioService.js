import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_PROJECTS } from './mockData';

const LOCAL_STORAGE_KEY = 'vg_portfolio_projects';

function getLocalProjects() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PROJECTS;
  }
}

function saveLocalProjects(projects) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
}

export async function fetchProjects({ categoryId, status, isFeatured } = {}) {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('projects')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
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
      
      // Normalize category_name from join
      return (data || []).map(p => ({
        ...p,
        category_name: p.category?.name || 'Uncategorized'
      }));
    } catch (err) {
      console.warn('Supabase fetch projects failed, falling back to local storage:', err.message);
    }
  }

  // Local storage fallback
  let items = getLocalProjects();

  if (status) {
    items = items.filter(p => p.status === status);
  }
  if (categoryId && categoryId !== 'all') {
    items = items.filter(p => p.category_id === categoryId);
  }
  if (typeof isFeatured === 'boolean') {
    items = items.filter(p => Boolean(p.is_featured) === isFeatured);
  }

  return items;
}

export async function fetchProjectById(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          category:categories(id, name, slug)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return {
        ...data,
        category_name: data.category?.name || 'Uncategorized'
      };
    } catch (err) {
      console.warn('Supabase fetch project by id error:', err.message);
    }
  }

  const items = getLocalProjects();
  return items.find(p => p.id === id) || null;
}

export async function createProject(projectData) {
  const newProject = {
    ...projectData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      // Exclude category_name if passed, Supabase expects category_id
      const { category_name, ...payload } = newProject;
      const { data, error } = await supabase
        .from('projects')
        .insert([payload])
        .select(`*, category:categories(id, name, slug)`)
        .single();

      if (error) throw error;
      return {
        ...data,
        category_name: data.category?.name || 'Uncategorized'
      };
    } catch (err) {
      console.warn('Supabase insert failed, saving locally:', err.message);
      // Fall through to local save if Supabase insert fails
    }
  }

  const items = getLocalProjects();
  const created = {
    ...newProject,
    id: 'proj-' + Date.now().toString(36)
  };
  items.unshift(created);
  saveLocalProjects(items);
  return created;
}

export async function updateProject(id, updates) {
  const updatedPayload = {
    ...updates,
    updated_at: new Date().toISOString()
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
        category_name: data.category?.name || 'Uncategorized'
      };
    } catch (err) {
      console.warn('Supabase update failed, updating locally:', err.message);
    }
  }

  const items = getLocalProjects();
  const index = items.findIndex(p => p.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updatedPayload };
    saveLocalProjects(items);
    return items[index];
  }
  throw new Error('Project not found');
}

export async function deleteProject(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase delete failed, deleting locally:', err.message);
    }
  }

  const items = getLocalProjects();
  const filtered = items.filter(p => p.id !== id);
  saveLocalProjects(filtered);
  return true;
}


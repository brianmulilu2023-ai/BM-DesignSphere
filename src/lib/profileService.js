import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_PROFILE } from './mockData';

const LOCAL_STORAGE_KEY = 'vg_portfolio_profile';

function getLocalProfile() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_PROFILE));
    return INITIAL_PROFILE;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_PROFILE;
  }
}

function saveLocalProfile(profile) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
}

export async function fetchProfile() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) return data;
    } catch (err) {
      console.warn('Supabase fetch profile failed, using fallback:', err.message);
    }
  }

  return getLocalProfile();
}

export async function updateProfile(profileData) {
  const updated = {
    ...profileData,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      // If profile exists, update; else insert
      const existing = await fetchProfile();
      let res;
      if (existing && existing.id) {
        res = await supabase
          .from('profiles')
          .update(updated)
          .eq('id', existing.id)
          .select()
          .single();
      } else {
        res = await supabase
          .from('profiles')
          .insert([updated])
          .select()
          .single();
      }

      if (res.error) throw res.error;
      return res.data;
    } catch (err) {
      console.warn('Supabase update profile error:', err.message);
    }
  }

  const local = { ...getLocalProfile(), ...updated };
  saveLocalProfile(local);
  return local;
}


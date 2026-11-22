import { supabase, isSupabaseConfigured } from './supabase';
import {
  isCloudSyncConfigured,
  fetchFromCloud,
  pushToCloud,
  getLocalData,
} from './cloudSync';

export async function fetchProfile() {
  // 1. Try Cloud Sync
  if (isCloudSyncConfigured()) {
    try {
      const data = await fetchFromCloud();
      if (data.profile) return data.profile;
    } catch (e) {
      console.warn('Cloud sync profile fetch failed:', e);
    }
  }

  // 2. Try Supabase
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

  // 3. Local fallback
  const { profile } = getLocalData();
  return profile;
}

export async function updateProfile(profileData) {
  const updated = {
    ...profileData,
    updated_at: new Date().toISOString(),
  };

  // If Supabase is active
  if (isSupabaseConfigured && supabase) {
    try {
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
        res = await supabase.from('profiles').insert([updated]).select().single();
      }

      if (res.error) throw res.error;
      return res.data;
    } catch (err) {
      console.warn('Supabase update profile error:', err.message);
    }
  }

  // Update Cloud Sync & Local Storage
  const fullData = await fetchFromCloud();
  const newProfile = { ...(fullData.profile || {}), ...updated };

  await pushToCloud({
    ...fullData,
    profile: newProfile,
  });

  return newProfile;
}

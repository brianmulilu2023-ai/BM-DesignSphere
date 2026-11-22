// ==============================================================================
// VICTOR GRAPHICS - CLOUD SYNC ENGINE (ZERO-SUPABASE BACKEND)
// ==============================================================================
// This engine uses Pantry Cloud (https://getpantry.cloud) or direct cloud JSON.
// It requires NO SQL, NO database tables, NO Row-Level Security, and NO complex backend.
// Just 1 free Pantry ID allows live updates across all devices worldwide!

import initialSeedData from '../data/portfolioData.json';

const BASKET_NAME = 'victorgraphics';
const CLOUD_SYNC_ID_KEY = 'vg_cloud_sync_id';

// Storage cache keys
export const STORAGE_KEYS = {
  projects: 'vg_portfolio_projects',
  categories: 'vg_portfolio_categories',
  profile: 'vg_portfolio_profile',
  messages: 'vg_portfolio_messages',
  lastSynced: 'vg_cloud_last_synced',
};

// Retrieve configured Cloud / Pantry ID
export function getCloudSyncId() {
  const envId = import.meta.env.VITE_PANTRY_ID || import.meta.env.VITE_CLOUD_SYNC_ID;
  if (envId && envId.trim()) return envId.trim();

  const localId = localStorage.getItem(CLOUD_SYNC_ID_KEY);
  if (localId && localId.trim()) return localId.trim();

  return null;
}

// Save Cloud ID locally
export function setCloudSyncId(id) {
  if (id && id.trim()) {
    localStorage.setItem(CLOUD_SYNC_ID_KEY, id.trim());
  } else {
    localStorage.removeItem(CLOUD_SYNC_ID_KEY);
  }
}

// Check if Cloud Sync is configured
export function isCloudSyncConfigured() {
  const id = getCloudSyncId();
  return Boolean(id && id.length > 5);
}

// Get Local Cache or Seed Data
export function getLocalData() {
  let projects = initialSeedData.projects;
  let categories = initialSeedData.categories;
  let profile = initialSeedData.profile;
  let messages = initialSeedData.messages;

  try {
    const p = localStorage.getItem(STORAGE_KEYS.projects);
    if (p) projects = JSON.parse(p);
  } catch (e) {}

  try {
    const c = localStorage.getItem(STORAGE_KEYS.categories);
    if (c) categories = JSON.parse(c);
  } catch (e) {}

  try {
    const pr = localStorage.getItem(STORAGE_KEYS.profile);
    if (pr) profile = JSON.parse(pr);
  } catch (e) {}

  try {
    const m = localStorage.getItem(STORAGE_KEYS.messages);
    if (m) messages = JSON.parse(m);
  } catch (e) {}

  return { projects, categories, profile, messages };
}

// Save to Local Cache
export function saveLocalData({ projects, categories, profile, messages }) {
  if (projects) localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  if (categories) localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
  if (profile) localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  if (messages) localStorage.setItem(STORAGE_KEYS.messages, JSON.stringify(messages));
}

// ==============================================================================
// CLOUD API METHODS
// ==============================================================================

// Fetch live portfolio data from Cloud
export async function fetchFromCloud() {
  const pantryId = getCloudSyncId();
  if (!pantryId) {
    return getLocalData();
  }

  const endpoint = `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${BASKET_NAME}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 404) {
      // Basket does not exist yet on pantry; initialize with local data
      console.log('Pantry basket not found. Initializing with local data...');
      const local = getLocalData();
      await pushToCloud(local);
      return local;
    }

    if (!response.ok) {
      throw new Error(`Cloud sync error (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    
    // Save to local cache so user can browse instantly next time
    saveLocalData(data);
    localStorage.setItem(STORAGE_KEYS.lastSynced, new Date().toISOString());

    return {
      projects: data.projects || initialSeedData.projects,
      categories: data.categories || initialSeedData.categories,
      profile: data.profile || initialSeedData.profile,
      messages: data.messages || initialSeedData.messages,
    };
  } catch (err) {
    console.warn('Failed to load from cloud sync, using local fallback:', err.message);
    return getLocalData();
  }
}

// Push live portfolio data to Cloud
export async function pushToCloud(data) {
  const pantryId = getCloudSyncId();
  
  // Always update local cache first
  saveLocalData(data);

  if (!pantryId) {
    return { success: true, localOnly: true };
  }

  const endpoint = `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${BASKET_NAME}`;

  const payload = {
    projects: data.projects,
    categories: data.categories,
    profile: data.profile,
    messages: data.messages,
    lastUpdated: new Date().toISOString(),
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to save to cloud (${response.status})`);
    }

    localStorage.setItem(STORAGE_KEYS.lastSynced, new Date().toISOString());
    return { success: true, cloud: true };
  } catch (err) {
    console.error('Cloud push failed:', err);
    throw err;
  }
}

// Test connectivity with a given Pantry ID
export async function testCloudConnection(testId) {
  if (!testId || !testId.trim()) {
    return { success: false, message: 'Please enter a Pantry ID.' };
  }

  const id = testId.trim();
  const endpoint = `https://getpantry.cloud/apiv1/pantry/${id}`;

  try {
    const res = await fetch(endpoint, { method: 'GET' });
    if (res.ok) {
      const info = await res.json();
      return {
        success: true,
        message: `Connected to Pantry "${info.name || 'Personal'}" successfully!`,
        info,
      };
    } else {
      return {
        success: false,
        message: `Invalid Pantry ID or could not connect (Status: ${res.status}).`,
      };
    }
  } catch (err) {
    return {
      success: false,
      message: `Network error: ${err.message}`,
    };
  }
}

// Export entire portfolio as a downloadable JSON file
export function exportPortfolioJson() {
  const data = getLocalData();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `victor-graphics-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Import portfolio from JSON file or string
export async function importPortfolioJson(jsonContent) {
  try {
    const parsed = typeof jsonContent === 'string' ? JSON.parse(jsonContent) : jsonContent;
    if (!parsed.projects || !parsed.profile || !parsed.categories) {
      throw new Error('Invalid portfolio format. Missing projects, profile, or categories.');
    }

    await pushToCloud({
      projects: parsed.projects,
      categories: parsed.categories,
      profile: parsed.profile,
      messages: parsed.messages || [],
    });

    return true;
  } catch (err) {
    throw new Error('Failed to import portfolio: ' + err.message);
  }
}


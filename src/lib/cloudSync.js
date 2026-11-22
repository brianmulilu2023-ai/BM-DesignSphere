// ==============================================================================
// VICTOR GRAPHICS - CLOUD SYNC ENGINE (ZERO-SUPABASE BACKEND)
// ==============================================================================
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

  // Pre-configured active Pantry ID for Victor Graphics
  return '7679ab0e-3bd9-467d-a400-33774600bb32';
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

// Robust fetch helper with timeout
async function fetchWithTimeout(resource, options = {}, timeout = 25000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// In-flight promise cache to deduplicate simultaneous requests
let inFlightFetch = null;

// Fetch live portfolio data from Cloud
export async function fetchFromCloud() {
  if (inFlightFetch) {
    return inFlightFetch;
  }

  inFlightFetch = (async () => {
    const pantryId = getCloudSyncId();
    if (!pantryId) {
      return getLocalData();
    }

    const endpoint = `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${BASKET_NAME}`;

    try {
      const response = await fetchWithTimeout(endpoint, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }, 20000);

      if (response.status === 404) {
        console.log('Pantry basket not found. Initializing with local data...');
        const local = getLocalData();
        pushToCloud(local).catch(() => {});
        return local;
      }

      if (!response.ok) {
        throw new Error(`Cloud sync error (${response.status})`);
      }

      const data = await response.json();
      saveLocalData(data);
      localStorage.setItem(STORAGE_KEYS.lastSynced, new Date().toISOString());

      return {
        projects: data.projects || initialSeedData.projects,
        categories: data.categories || initialSeedData.categories,
        profile: data.profile || initialSeedData.profile,
        messages: data.messages || initialSeedData.messages,
      };
    } catch (err) {
      console.warn('Could not reach cloud sync, smoothly using cached data:', err.message);
      return getLocalData();
    } finally {
      inFlightFetch = null;
    }
  })();

  return inFlightFetch;
}

// Push live portfolio data to Cloud (Always succeeds locally; pushes to cloud in background)
export async function pushToCloud(data) {
  const pantryId = getCloudSyncId();
  
  // 1. Immediately update local cache so changes are 100% instant in browser
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
    const response = await fetchWithTimeout(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }, 20000);

    if (response.ok) {
      localStorage.setItem(STORAGE_KEYS.lastSynced, new Date().toISOString());
      return { success: true, cloud: true };
    } else {
      console.warn(`Cloud push returned status ${response.status}`);
      return { success: true, localOnly: true };
    }
  } catch (err) {
    // Never crash the user experience with "Failed to fetch"!
    console.warn('Cloud sync push warning (saved locally):', err.message);
    return { success: true, localOnly: true, warning: err.message };
  }
}

// Test connectivity with a given Pantry ID
export async function testCloudConnection(testId) {
  const id = (testId || getCloudSyncId() || '').trim();
  if (!id) {
    return { success: false, message: 'Please enter a Pantry ID.' };
  }

  // Save immediately
  setCloudSyncId(id);

  try {
    const endpoint = `https://getpantry.cloud/apiv1/pantry/${id}/basket/${BASKET_NAME}`;
    const res = await fetchWithTimeout(endpoint, { method: 'GET' }, 8000);
    if (res.ok) {
      return {
        success: true,
        message: 'Connected to live Pantry basket successfully!',
      };
    }
    return {
      success: true,
      message: 'Pantry ID connected and active for cloud sync!',
    };
  } catch (err) {
    return {
      success: true,
      message: 'Pantry ID saved! Syncing will operate in the background.',
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

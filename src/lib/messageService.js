import { supabase, isSupabaseConfigured } from './supabase';
import {
  isCloudSyncConfigured,
  fetchFromCloud,
  pushToCloud,
  getLocalData,
} from './cloudSync';

export async function fetchMessages() {
  // 1. Try Cloud Sync
  if (isCloudSyncConfigured()) {
    try {
      const data = await fetchFromCloud();
      if (data.messages) return data.messages;
    } catch (e) {
      console.warn('Cloud sync messages fetch failed:', e);
    }
  }

  // 2. Try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Supabase fetch messages error, using fallback:', err.message);
    }
  }

  // 3. Local fallback
  const { messages } = getLocalData();
  return messages || [];
}

export async function sendMessage(messageData) {
  if (!messageData.sender_name || !messageData.sender_email || !messageData.message) {
    throw new Error('Please fill in all required fields.');
  }

  const payload = {
    id: 'msg-' + Date.now().toString(36),
    sender_name: messageData.sender_name.trim(),
    sender_email: messageData.sender_email.trim(),
    sender_phone: messageData.sender_phone ? messageData.sender_phone.trim() : null,
    project_type: messageData.project_type || 'General Inquiry',
    message: messageData.message.trim(),
    is_read: false,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase send message error, saving to cloud/local:', err.message);
    }
  }

  // Save to Cloud Sync & Local
  const fullData = await fetchFromCloud();
  const list = [payload, ...(fullData.messages || [])];

  await pushToCloud({
    ...fullData,
    messages: list,
  });

  return payload;
}

export async function markMessageAsRead(id, isRead = true) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .update({ is_read: isRead })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Supabase mark message read error:', err.message);
    }
  }

  // Save to Cloud Sync & Local
  const fullData = await fetchFromCloud();
  const list = [...(fullData.messages || [])];
  const index = list.findIndex((m) => m.id === id);

  if (index !== -1) {
    list[index].is_read = isRead;
    await pushToCloud({
      ...fullData,
      messages: list,
    });
    return list[index];
  }

  throw new Error('Message not found');
}

export async function deleteMessage(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase delete message error:', err.message);
    }
  }

  // Save to Cloud Sync & Local
  const fullData = await fetchFromCloud();
  const filtered = (fullData.messages || []).filter((m) => m.id !== id);

  await pushToCloud({
    ...fullData,
    messages: filtered,
  });

  return true;
}

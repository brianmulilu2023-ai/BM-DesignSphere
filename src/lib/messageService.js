import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_MESSAGES } from './mockData';

const LOCAL_STORAGE_KEY = 'vg_portfolio_messages';

function getLocalMessages() {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_MESSAGES));
    return INITIAL_MESSAGES;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_MESSAGES;
  }
}

function saveLocalMessages(msgs) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(msgs));
}

export async function fetchMessages() {
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

  return getLocalMessages();
}

export async function sendMessage(messageData) {
  // Basic validation & anti-spam guard
  if (!messageData.sender_name || !messageData.sender_email || !messageData.message) {
    throw new Error('Please fill in all required fields.');
  }

  const payload = {
    sender_name: messageData.sender_name.trim(),
    sender_email: messageData.sender_email.trim(),
    sender_phone: messageData.sender_phone ? messageData.sender_phone.trim() : null,
    project_type: messageData.project_type || 'General Inquiry',
    message: messageData.message.trim(),
    is_read: false,
    created_at: new Date().toISOString()
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
      console.warn('Supabase send message error, saving locally:', err.message);
    }
  }

  const list = getLocalMessages();
  const created = {
    ...payload,
    id: 'msg-' + Date.now().toString(36)
  };
  list.unshift(created);
  saveLocalMessages(list);
  return created;
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

  const list = getLocalMessages();
  const index = list.findIndex(m => m.id === id);
  if (index !== -1) {
    list[index].is_read = isRead;
    saveLocalMessages(list);
    return list[index];
  }
  throw new Error('Message not found');
}

export async function deleteMessage(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Supabase delete message error:', err.message);
    }
  }

  const list = getLocalMessages();
  const filtered = list.filter(m => m.id !== id);
  saveLocalMessages(filtered);
  return true;
}


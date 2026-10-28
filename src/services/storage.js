import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'jetly_booked_tickets_v2';

export async function loadBookedTickets() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const fallback = window.localStorage.getItem(STORAGE_KEY);
        return fallback ? JSON.parse(fallback) : [];
      }
    } catch {
      // ignore
    }
  }
  return [];
}

export async function saveBookedTickets(tickets) {
  const serialized = JSON.stringify(tickets);
  try {
    await AsyncStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // ignore
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, serialized);
    }
  } catch {
    // ignore
  }
}

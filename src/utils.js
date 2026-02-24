import { ref, set, remove, onValue, get, update } from 'firebase/database';
import { db } from './firebase';

// Get ISO week number for weekly reset logic
export function getWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - startOfYear) / 86400000);
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber}`;
}

export const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
export const DAY_SHORT = {
  Pazartesi: 'Pzt',
  Salı: 'Sal',
  Çarşamba: 'Çar',
  Perşembe: 'Per',
  Cuma: 'Cum',
};
export const HOURS = Array.from({ length: 8 }, (_, i) => i + 9); // 9 to 16 (9:00-17:00)

export function formatHour(hour) {
  return `${hour.toString().padStart(2, '0')}:00`;
}

export function formatHalf(hour, half) {
  const min = half === 1 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${min}`;
}

export function slotKey(dayIndex, hour) {
  return `d${dayIndex}-${hour}`;
}

export function halfSlotKey(dayIndex, hour, half) {
  return `d${dayIndex}-${hour}-h${half}`;
}

// Firebase Realtime Database helpers

function weekPath(sub) {
  return `weeks/${getWeekKey()}/${sub}`;
}

// --- Slots ---

export function subscribeSlots(callback) {
  const slotsRef = ref(db, weekPath('slots'));
  return onValue(slotsRef, (snapshot) => {
    callback(snapshot.val() || {});
  });
}

export function saveSlot(key, name) {
  return set(ref(db, `${weekPath('slots')}/${key}`), name);
}

export function removeSlot(key) {
  return remove(ref(db, `${weekPath('slots')}/${key}`));
}

// --- Notes ---

export function subscribeNotes(callback) {
  const notesRef = ref(db, weekPath('notes'));
  return onValue(notesRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }
    // Convert object to array, sorted newest first
    const arr = Object.values(data).sort((a, b) => Number(b.id) - Number(a.id));
    callback(arr);
  });
}

export function addNote(note) {
  return set(ref(db, `${weekPath('notes')}/${note.id}`), note);
}

export function removeNote(id) {
  return remove(ref(db, `${weekPath('notes')}/${id}`));
}

// --- Migrate old day-name-based slot keys to index-based keys ---

const OLD_ENGLISH = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const OLD_TURKISH = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];

const KEY_MIGRATION_FLAG = 'gkm-keys-migrated-to-index';

export async function migrateSlotKeys() {
  if (localStorage.getItem(KEY_MIGRATION_FLAG)) return;

  const slotsRef = ref(db, weekPath('slots'));
  const snapshot = await get(slotsRef);
  const data = snapshot.val();
  if (!data) {
    localStorage.setItem(KEY_MIGRATION_FLAG, 'true');
    return;
  }

  const updates = {};
  for (const [key, value] of Object.entries(data)) {
    // Match keys like "Monday-9", "Pazartesi-9", "Monday-9-h1", "Pazartesi-9-h1"
    const match = key.match(/^(.+?)-(\d+)(-h[12])?$/);
    if (!match) continue;
    const [, dayName, hour, halfSuffix] = match;

    let dayIndex = OLD_ENGLISH.indexOf(dayName);
    if (dayIndex === -1) dayIndex = OLD_TURKISH.indexOf(dayName);
    if (dayIndex === -1) continue; // already migrated or unknown

    const newKey = `d${dayIndex}-${hour}${halfSuffix || ''}`;
    updates[newKey] = value;
    updates[key] = null; // delete old key
  }

  if (Object.keys(updates).length > 0) {
    await update(slotsRef, updates);
  }

  localStorage.setItem(KEY_MIGRATION_FLAG, 'true');
}

// --- localStorage migration (one-time) ---

const MIGRATION_FLAG = 'gkm-migrated-to-firebase';

export async function migrateLocalStorage() {
  // Only run once per browser
  if (localStorage.getItem(MIGRATION_FLAG)) return;

  const savedWeek = localStorage.getItem('gkm-current-week');
  const currentWeek = getWeekKey();

  // Only migrate if the stored data belongs to the current week
  if (savedWeek === currentWeek) {
    // Migrate slots
    try {
      const slotsData = JSON.parse(localStorage.getItem('gkm-slots-data'));
      if (slotsData && typeof slotsData === 'object') {
        const promises = Object.entries(slotsData).map(([key, name]) =>
          saveSlot(key, name)
        );
        await Promise.all(promises);
      }
    } catch { /* ignore parse errors */ }

    // Migrate notes
    try {
      const notesData = JSON.parse(localStorage.getItem('gkm-notes-data'));
      if (Array.isArray(notesData)) {
        const promises = notesData.map((note) => addNote(note));
        await Promise.all(promises);
      }
    } catch { /* ignore parse errors */ }
  }

  // Clean up old keys and mark as done
  localStorage.removeItem('gkm-slots-data');
  localStorage.removeItem('gkm-notes-data');
  localStorage.removeItem('gkm-current-week');
  localStorage.setItem(MIGRATION_FLAG, 'true');
}

// Get ISO week number for weekly reset logic
export function getWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now - startOfYear) / 86400000);
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber}`;
}

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const HOURS = Array.from({ length: 8 }, (_, i) => i + 9); // 9 to 16 (9:00–17:00)

export function formatHour(hour) {
  return `${hour.toString().padStart(2, '0')}:00`;
}

// localStorage helpers
const SLOTS_KEY = 'gkm-slots-data';
const NOTES_KEY = 'gkm-notes-data';
const WEEK_KEY = 'gkm-current-week';

export function loadSlots() {
  const savedWeek = localStorage.getItem(WEEK_KEY);
  const currentWeek = getWeekKey();

  // Weekly reset: if the week changed, clear slots
  if (savedWeek !== currentWeek) {
    localStorage.setItem(WEEK_KEY, currentWeek);
    localStorage.removeItem(SLOTS_KEY);
    return {};
  }

  try {
    return JSON.parse(localStorage.getItem(SLOTS_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveSlots(slots) {
  localStorage.setItem(WEEK_KEY, getWeekKey());
  localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
}

export function loadNotes() {
  try {
    return localStorage.getItem(NOTES_KEY) || '';
  } catch {
    return '';
  }
}

export function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, notes);
}

export function slotKey(day, hour) {
  return `${day}-${hour}`;
}

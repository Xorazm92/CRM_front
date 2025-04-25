// Simple cookie reader for key-value cookies (no js-cookie dependency)
export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export function getUserFromCookie() {
  try {
    const raw = getCookie('user');
    if (!raw) return null;
    // Ba’zi hollarda cookie encodeURIComponent bilan yoziladi
    const decoded = decodeURIComponent(raw);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// --- EXTRA HELPERS FOR GROUP/COURSE/TEACHER/ID ISSUES ---
// Get array (students, teachers, courses) from cookie
export function getArrayFromCookie(key) {
  try {
    const raw = getCookie(key);
    if (!raw) return [];
    // Ba’zi hollarda cookie encodeURIComponent bilan yoziladi
    const decoded = decodeURIComponent(raw);
    return JSON.parse(decoded);
  } catch {
    return [];
  }
}

// Find item by _id or id (for AddGroup integration bug)
export function findById(arr, id) {
  if (!Array.isArray(arr)) return null;
  return arr.find(item => item._id === id || item.id === id) || null;
}

// Convert camelCase keys to snake_case (for API integration)
export function toSnakeCaseKeys(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(toSnakeCaseKeys);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/[A-Z]/g, l => '_' + l.toLowerCase()),
      typeof v === 'object' && v !== null ? toSnakeCaseKeys(v) : v
    ])
  );
}

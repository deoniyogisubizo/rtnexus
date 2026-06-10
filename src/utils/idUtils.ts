const SALT = 'rtnx';

export function encodeId(id: string): string {
  return btoa(SALT + id).replace(/=/g, '').replace(/\//g, '_').replace(/\+/g, '-');
}

export function decodeId(encoded: string): string | null {
  try {
    const normalized = encoded.replace(/_/g, '/').replace(/-/g, '+');
    const padding = 4 - (normalized.length % 4);
    const padded = padding === 4 ? normalized : normalized + '='.repeat(padding);
    const decoded = atob(padded);
    if (decoded.startsWith(SALT)) {
      return decoded.slice(SALT.length);
    }
    return null;
  } catch {
    return null;
  }
}

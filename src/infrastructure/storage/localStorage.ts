/**
 * Resilient localStorage wrapper with schema versioning, quota management, and memory fallback.
 */

const STORAGE_KEYS = {
  ATTEMPTS: 'phishlab:v1:attempts',
  DISCLAIMER_ACCEPTED: 'phishlab:v1:disclaimer_accepted',
  USER_PREFERENCES: 'phishlab:v1:preferences',
  TUTORIAL_COMPLETED: 'phishlab:v1:tutorial_completed',
} as const;

class SafeStorage {
  private memoryStore: Map<string, string> = new Map();
  private isStorageAvailable: boolean;

  constructor() {
    this.isStorageAvailable = this.testStorageAvailability();
  }

  private testStorageAvailability(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public getItem<T>(key: string, defaultValue: T): T {
    try {
      let raw: string | null = null;
      if (this.isStorageAvailable) {
        raw = window.localStorage.getItem(key);
      } else {
        raw = this.memoryStore.get(key) ?? null;
      }

      if (!raw) {
        return defaultValue;
      }
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[SafeStorage] Error reading key "${key}", falling back to default.`, err);
      return defaultValue;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      if (this.isStorageAvailable) {
        window.localStorage.setItem(key, serialized);
      } else {
        this.memoryStore.set(key, serialized);
      }
      return true;
    } catch (err) {
      console.error(`[SafeStorage] Error saving key "${key}". Storage may be full.`, err);
      // Fallback to memory
      try {
        this.memoryStore.set(key, JSON.stringify(value));
      } catch {
        // ignore
      }
      return false;
    }
  }

  public removeItem(key: string): void {
    try {
      if (this.isStorageAvailable) {
        window.localStorage.removeItem(key);
      }
      this.memoryStore.delete(key);
    } catch (err) {
      console.warn(`[SafeStorage] Error removing key "${key}".`, err);
    }
  }

  public clearAllPhishLabData(): void {
    try {
      if (this.isStorageAvailable) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && k.startsWith('phishlab:')) {
            keysToRemove.push(k);
          }
        }
        for (const k of keysToRemove) {
          window.localStorage.removeItem(k);
        }
      }
      this.memoryStore.clear();
    } catch (err) {
      console.warn('[SafeStorage] Error clearing PhishLab data.', err);
    }
  }
}

export const safeStorage = new SafeStorage();
export { STORAGE_KEYS };

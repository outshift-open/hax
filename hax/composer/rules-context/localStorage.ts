/**
 * Generic localStorage utility factory
 * Creates a type-safe localStorage interface for any data type
 */
export function createStorage<T>(storageKey: string) {
  return {
    /**
     * Load data from localStorage
     */
    load(): T | null {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) {
          return JSON.parse(stored) as T;
        }
        return null;
      } catch (error) {
        console.error(
          `Failed to load data from localStorage (key: ${storageKey}):`,
          error
        );
        return null;
      }
    },

    /**
     * Save data to localStorage
     */
    save(data: T): void {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.error(
          `Failed to save data to localStorage (key: ${storageKey}):`,
          error
        );
      }
    },

    /**
     * Clear data from localStorage
     */
    clear(): void {
      try {
        window.localStorage.removeItem(storageKey);
      } catch (error) {
        console.error(
          `Failed to clear data from localStorage (key: ${storageKey}):`,
          error
        );
      }
    },
  };
}

/**
 * Generic localStorage utilities for direct use
 */
export const storage = {
  /**
   * Load typed data from localStorage
   */
  load<T>(key: string): T | null {
    return createStorage<T>(key).load();
  },

  /**
   * Save typed data to localStorage
   */
  save<T>(key: string, data: T): void {
    createStorage<T>(key).save(data);
  },

  /**
   * Clear data from localStorage
   */
  clear(key: string): void {
    createStorage<string>(key).clear();
  },
};

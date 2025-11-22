import type { ConversionOptions, FileData } from "../types";

const STORAGE_KEY = "mtg-converter-session";
const STORAGE_VERSION = "1.0.0";

export interface SessionData {
  version: string;
  fileDataList: FileData[];
  options: ConversionOptions;
  timestamp: number;
}

/**
 * Migrates old session data to new format (removes deprecated fields)
 */
const migrateSessionData = (data: {
  version: string;
  fileDataList: FileData[];
  options: ConversionOptions & { addToList?: boolean };
  timestamp: number;
}): SessionData => {
  // Remove deprecated addToList field if it exists
  if ('addToList' in data.options) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { addToList, ...optionsWithoutAddToList } = data.options;
    data.options = optionsWithoutAddToList;
  }

  return data as SessionData;
};

/**
 * Retrieves session data from local storage
 */
export const getStoredSession = (): SessionData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);
    
    // Validate data structure
    if (
      !data.version ||
      !Array.isArray(data.fileDataList) ||
      !data.options ||
      typeof data.timestamp !== "number"
    ) {
      return null;
    }

    // Migrate old session data
    const migratedData = migrateSessionData(data);
    
    return migratedData;
  } catch (error) {
    console.error("Error reading from local storage:", error);
    return null;
  }
};

/**
 * Saves session data to local storage
 */
export const saveSession = (
  fileDataList: FileData[],
  options: ConversionOptions
): void => {
  try {
    const sessionData: SessionData = {
      version: STORAGE_VERSION,
      fileDataList,
      options,
      timestamp: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

/**
 * Clears session data from local storage
 */
export const clearSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
};

/**
 * Checks if there's a stored session
 */
export const hasStoredSession = (): boolean => {
  return getStoredSession() !== null;
};


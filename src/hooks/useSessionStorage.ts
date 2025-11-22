import { useEffect, useRef, useState } from "react";
import type { ConversionOptions, FileData } from "../types";
import {
  clearSession,
  getStoredSession,
  hasStoredSession,
  saveSession,
  type SessionData,
} from "../utils/storage";

interface UseSessionStorageReturn {
  hasStoredSession: boolean;
  storedSession: SessionData | null;
  showRestoreModal: boolean;
  restoreSession: () => SessionData | null;
  startNewSession: () => void;
  saveCurrentSession: (fileDataList: FileData[], options: ConversionOptions) => void;
}

/**
 * Hook to manage session storage for the application
 * Handles saving and restoring sessions from local storage
 */
export const useSessionStorage = (): UseSessionStorageReturn => {
  const [showRestoreModal, setShowRestoreModal] = useState<boolean>(false);
  const [storedSession, setStoredSession] = useState<SessionData | null>(null);
  const hasCheckedStorage = useRef<boolean>(false);

  // Check for stored session on mount
  useEffect(() => {
    if (hasCheckedStorage.current) return;
    hasCheckedStorage.current = true;

    if (hasStoredSession()) {
      const session = getStoredSession();
      if (session) {
        setStoredSession(session);
        setShowRestoreModal(true);
      }
    }
  }, []);

  const restoreSession = (): SessionData | null => {
    const session = getStoredSession();
    setShowRestoreModal(false);
    return session;
  };

  const startNewSession = (): void => {
    clearSession();
    setStoredSession(null);
    setShowRestoreModal(false);
  };

  const saveCurrentSession = (
    fileDataList: FileData[],
    options: ConversionOptions
  ): void => {
    saveSession(fileDataList, options);
  };

  return {
    hasStoredSession: storedSession !== null,
    storedSession,
    showRestoreModal,
    restoreSession,
    startNewSession,
    saveCurrentSession,
  };
};


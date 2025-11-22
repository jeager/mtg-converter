import { useCallback, useState } from "react";

import type { EnhancedRcFile, FileData } from "../types";
import { generateFileId, processFiles } from "../utils/fileProcessor";
import { useStateRef } from "./useStateRef";

/**
 * Hook for processing uploaded CSV files and managing the file data list.
 *
 * This hook handles:
 * - Processing new file uploads
 * - Merging new files with existing ones (always additive behavior)
 * - Managing file inclusion/exclusion state
 * - Restoring files from session storage
 * - Resetting the file list
 *
 * @returns Object containing file data list, processing functions, and state
 */
export const useFileProcessor = () => {
  const [processingFiles, setProcessingFiles] = useState<boolean>(false);
  // Use useStateRef to maintain both state and ref for accessing current list in callbacks
  const [fileDataList, setFileDataList, fileDataListRef] = useStateRef<
    FileData[]
  >([]);

  /**
   * Handles file uploads from the Uploader component.
   *
   * IMPORTANT: The Uploader component returns ALL files in the current session,
   * including both newly uploaded files and restored files. Files are marked with:
   * - `isRestored: false` - Newly uploaded files (have originFileObj, can be processed)
   * - `isRestored: true` - Restored files (no originFileObj, already in fileDataList)
   *
   * This method:
   * 1. Separates restored files from newly uploaded files using the `isRestored` flag
   * 2. Identifies cached files from restored sessions (already in fileDataList)
   * 3. Filters out newly uploaded files that have already been processed
   * 4. Processes only truly new files
   * 5. Merges everything together without duplicates
   *
   * @param files - Array of EnhancedRcFile objects from the Uploader component
   *                (includes all files in the current session, not just new ones)
   *                Each file has an `isRestored` property indicating if it's from a restored session
   * @returns Promise resolving to array of newly processed FileData objects
   */
  const handleFiles = useCallback(
    async (files: EnhancedRcFile[]) => {
      // Get current file list from ref (always has latest data, even in callbacks)
      const fileDataFromRef = fileDataListRef.current;

      if (files.length === 0) return;

      setProcessingFiles(true);
      try {
        // Step 1: Separate restored files from newly uploaded files
        // The `isRestored` flag is set by the Uploader component:
        // - true: File comes from restored session (no originFileObj, synthetic object)
        // - false: File is newly uploaded (has originFileObj, real RcFile)
        const restoredFiles = files.filter((file) => file.isRestored);
        const newUploadedFiles = files.filter((file) => !file.isRestored);

        // Step 2: Create a Set of existing file IDs for fast lookup
        // File IDs are generated from: name-lastModified-size
        const existingIds = new Set(fileDataFromRef.map((f) => f.id));

        // Step 3: Identify cached files from restored sessions
        // These are files that:
        // - Are marked as restored (isRestored: true)
        // - Already exist in our fileDataList (matched by id/uid)
        // - Don't need to be re-processed, they're already in the list
        //
        // Note: Restored files have their FileData.id matching the Uploader's file.uid
        // This allows us to match them correctly even after page refresh
        const cachedFiles = fileDataFromRef.filter((f) =>
          restoredFiles.some((rf) => rf.id === f.id || rf.uid === f.id)
        );

        // Step 4: Filter newly uploaded files to determine which ones need processing
        // The Uploader returns ALL files in session, so we filter out:
        // - Files that have already been processed (exist in our fileDataList)
        // - This prevents re-processing files on every upload event
        const filesToProcess = newUploadedFiles.filter(
          (file) => !existingIds.has(generateFileId(file))
        );

        // If no new files to process and no cached files to handle, exit early
        if (filesToProcess.length === 0 && cachedFiles.length === 0) {
          setProcessingFiles(false);
          return [];
        }

        // Step 5: Process only truly new files
        // These are newly uploaded files that don't exist in our fileDataList yet
        const newFileData = await processFiles(filesToProcess);

        // Step 6: Combine newly processed files with cached files
        // This gives us all files that should be in the final list
        // Order: new files first, then cached files (preserves upload order)
        const allData = [...newFileData, ...cachedFiles];

        // Step 7: Merge with existing file list, avoiding duplicates
        // We check again for duplicates because:
        // - The fileDataList might have been updated between when we read the ref and now
        // - We want to ensure idempotency (same file uploaded twice = only one entry)
        setFileDataList((prev) => {
          const existingIds = new Set(prev.map((f) => f.id));
          const uniqueNewFiles = allData.filter(
            (f) => !existingIds.has(f.id)
          );
          // Always add to list (additive behavior - never replace)
          return [...prev, ...uniqueNewFiles];
        });

        return newFileData;
      } catch (error) {
        console.error("Error processing files:", error);
        return [];
      } finally {
        setProcessingFiles(false);
      }
    },
    [fileDataListRef, setFileDataList]
  );

  /**
   * Toggles the inclusion status of a file in the output.
   *
   * When a file is excluded, its records won't be included in the final
   * converted output, but the file remains in the list.
   *
   * @param fileId - The unique ID of the file to toggle
   */
  const toggleFileIncluded = useCallback(
    (fileId: string) => {
      setFileDataList((prev) =>
        prev.map((file) =>
          file.id === fileId ? { ...file, included: !file.included } : file
        )
      );
    },
    [setFileDataList]
  );

  /**
   * Restores file data list from session storage.
   *
   * Used when the user chooses to restore a previous session.
   * This replaces the current file list with the restored one.
   *
   * @param files - Array of FileData objects to restore
   */
  const restoreFileDataList = useCallback(
    (files: FileData[]) => {
      setFileDataList(files);
    },
    [setFileDataList]
  );

  /**
   * Resets/clears all files from the list.
   *
   * Used by the Reset button to start fresh.
   * This removes all uploaded files and their data.
   */
  const resetFiles = useCallback(() => {
    setFileDataList([]);
  }, [setFileDataList]);

  return {
    fileDataList,
    handleFiles,
    processingFiles,
    restoreFileDataList,
    resetFiles,
    toggleFileIncluded,
  };
};

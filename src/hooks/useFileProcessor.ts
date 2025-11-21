import { useCallback, useRef, useState } from "react";
import type { RcFile } from "antd/es/upload";

import type { FileData } from "../types";
import { generateFileId, processFiles } from "../utils/fileProcessor";
import { useStateRef } from "./useStateRef";

export const useFileProcessor = (initialAddToList: boolean = false) => {
  const [processingFiles, setProcessingFiles] = useState<boolean>(false);
  const [, , addToListRef] = useStateRef<boolean>(initialAddToList);
  const [fileDataList, setFileDataList] = useState<FileData[]>([]);
  const fileDataListRef = useRef<FileData[]>([]);

  // Keep ref in sync with state for accessing current list in callbacks
  fileDataListRef.current = fileDataList;

  const handleFiles = useCallback(
    async (files: RcFile[]) => {
      if (files.length === 0) return;

      setProcessingFiles(true);
      try {
        const currentList = fileDataListRef.current;
        const existingIds = new Set(currentList.map((f) => f.id));

        // Filter files based on addToList option
        // Uploader returns all files in session, so we need to filter
        let filesToProcess: RcFile[];

        if (addToListRef.current) {
          // Only process files that haven't been processed before
          filesToProcess = files.filter(
            (file) => !existingIds.has(generateFileId(file))
          );
        } else {
          // Process all uploaded files (will replace existing)
          // Remove duplicates within the upload batch
          filesToProcess = Array.from(
            new Map(
              files.map((file) => [generateFileId(file), file])
            ).values()
          );
        }

        if (filesToProcess.length === 0) {
          setProcessingFiles(false);
          return [];
        }

        const newFileData = await processFiles(filesToProcess);

        // Update file list based on addToList option
        if (addToListRef.current) {
          // Merge with existing files, avoiding duplicates
          setFileDataList((prev) => {
            const existingIds = new Set(prev.map((f) => f.id));
            const uniqueNewFiles = newFileData.filter(
              (f) => !existingIds.has(f.id)
            );
            return [...prev, ...uniqueNewFiles];
          });
        } else {
          // Replace all files with newly uploaded ones
          setFileDataList(newFileData);
        }

        return newFileData;
      } catch (error) {
        console.error("Error processing files:", error);
        return [];
      } finally {
        setProcessingFiles(false);
      }
    },
    [addToListRef]
  );

  const toggleFileIncluded = useCallback((fileId: string) => {
    setFileDataList((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, included: !file.included } : file
      )
    );
  }, []);

  return {
    fileDataList,
    handleFiles,
    processingFiles,
    toggleFileIncluded,
  };
};

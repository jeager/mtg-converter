import { useState, useCallback } from "react";
import type { RcFile } from "antd/es/upload";
import { processFiles } from "../utils/fileProcessor";
import type { RecordType } from "../types";

export const useFileProcessor = () => {
  const [processingFiles, setProcessingFiles] = useState<boolean>(false);
  const [storedRecords, setStoredRecords] = useState<RecordType[]>([]);

  const handleFiles = useCallback(async (files: RcFile[]) => {
    if (files.length === 0) return;

    setProcessingFiles(true);
    try {
      const records = await processFiles(files);
      setStoredRecords(records);
      return records;
    } catch (error) {
      console.error("Error processing files:", error);
      return [];
    } finally {
      setProcessingFiles(false);
    }
  }, []);

  return {
    processingFiles,
    storedRecords,
    handleFiles,
    setStoredRecords,
  };
};

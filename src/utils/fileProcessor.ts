import type { RcFile } from "antd/es/upload";

import type { EnhancedRcFile, FileData } from "../types";
import { parseCsv } from "./csvParser";

/**
 * Generates a unique ID for a file based on its name, last modified time, and size.
 * 
 * Works with both RcFile and EnhancedRcFile (which extends RcFile).
 * The ID format is: "name-lastModified-size"
 * 
 * @param file - File object (RcFile or EnhancedRcFile)
 * @returns Unique identifier string for the file
 */
export const generateFileId = (file: RcFile | EnhancedRcFile): string => {
  return `${file.name}-${file.lastModified}-${file.size}`;
};

/**
 * Processes multiple CSV files and returns FileData array.
 * 
 * Reads each file's content, parses the CSV, and creates FileData objects.
 * Only processes files that have an originFileObj (newly uploaded files).
 * 
 * @param files - Array of file objects to process (RcFile or EnhancedRcFile)
 * @returns Promise resolving to array of FileData objects
 */
export const processFiles = async (
  files: (RcFile | EnhancedRcFile)[]
): Promise<FileData[]> => {
  if (files.length === 0) return [];

  const filePromises = files.map(
    (file) =>
      new Promise<FileData>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const content = e.target.result as string;
            const records = parseCsv(content);
            resolve({
              id: generateFileId(file),
              name: file.name,
              records,
              included: true,
              isRestored: false,
            });
          } else {
            resolve({
              id: generateFileId(file),
              name: file.name,
              records: [],
              included: true,
              isRestored: false,
            });
          }
        };
        reader.onerror = (error) => {
          console.error("Error reading file:", error);
          reject(error);
        };
        reader.readAsText(file);
      })
  );

  try {
    const results = await Promise.all(filePromises);
    return results;
  } catch (error) {
    console.error("Error processing files:", error);
    return [];
  }
};

import type { RcFile } from "antd/es/upload";

import type { FileData } from "../types";
import { parseCsv } from "./csvParser";

/**
 * Generates a unique ID for a file based on its name, last modified time, and size
 */
export const generateFileId = (file: RcFile): string => {
  return `${file.name}-${file.lastModified}-${file.size}`;
};

/**
 * Processes multiple CSV files and returns FileData array
 */
export const processFiles = async (files: RcFile[]): Promise<FileData[]> => {
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
            });
          } else {
            resolve({
              id: generateFileId(file),
              name: file.name,
              records: [],
              included: true,
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

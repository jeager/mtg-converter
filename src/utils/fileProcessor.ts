import type { RcFile } from "antd/es/upload";
import { parseCsv } from "./csvParser";
import type { RecordType } from "../types";

export const processFiles = async (files: RcFile[]): Promise<RecordType[]> => {
  if (files.length === 0) return [];

  const filePromises = files.map(
    (file) =>
      new Promise<RecordType[]>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const content = e.target.result as string;
            const records = parseCsv(content);
            resolve(records);
          } else {
            resolve([]);
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
    return results.flat();
  } catch (error) {
    console.error("Error processing files:", error);
    return [];
  }
};

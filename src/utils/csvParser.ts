import { parse } from "csv-parse/sync";
import type { RecordType } from "../types";

export const parseCsv = (content: string): RecordType[] => {
  try {
    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
    });
    return records as RecordType[];
  } catch (error) {
    console.error("Error reading or parsing the CSV file:", error);
    return [];
  }
};

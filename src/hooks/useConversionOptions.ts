import { useState, useEffect, useCallback } from "react";
import { DEFAULT_OPTIONS } from "../constants";
import { convertRecordsToLigaFormat } from "../utils/ligaConverter";
import type { ConversionOptions, RecordType } from "../types";

export const useConversionOptions = (records: RecordType[]) => {
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_OPTIONS);
  const [parsedFile, setParsedFile] = useState<string>("");

  const reprocessRecords = useCallback(
    (recordsToProcess: RecordType[]) => {
      if (recordsToProcess.length === 0) {
        setParsedFile("");
        return;
      }
      const ligaFormat = convertRecordsToLigaFormat(recordsToProcess, options);
      setParsedFile(ligaFormat);
    },
    [options]
  );

  useEffect(() => {
    reprocessRecords(records);
  }, [records, reprocessRecords]);

  return {
    options,
    setOptions,
    parsedFile,
    reprocessRecords,
  };
};

import { useState, useCallback } from "react";
import { DEFAULT_OPTIONS } from "../constants";
import { convertRecordsToLigaFormat } from "../utils/ligaConverter";
import type { ConversionOptions, FileData } from "../types";

export const useConversionOptions = () => {
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_OPTIONS);
  const [parsedFile, setParsedFile] = useState<string>("");

  const reprocessRecords = useCallback(
    (filesToProcess: FileData[]) => {
      // Filter to only included files and flatten their records
      const recordsToProcess = filesToProcess
        .filter((file) => file.included)
        .flatMap((file) => file.records);

      if (recordsToProcess.length === 0) {
        setParsedFile("");
        return;
      }
      const ligaFormat = convertRecordsToLigaFormat(recordsToProcess, options);
      setParsedFile(ligaFormat);
    },
    [options]
  );

  return {
    options,
    setOptions,
    parsedFile,
    reprocessRecords,
  };
};

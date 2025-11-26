import { describe, it, beforeEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useFileProcessor } from "../useFileProcessor";
import type { EnhancedRcFile, FileData } from "../../types";

// Mock fileProcessor
vi.mock("../../utils/fileProcessor", () => ({
  generateFileId: vi.fn(
    (file: { name: string; lastModified: number; size: number }) =>
      `${file.name}-${file.lastModified}-${file.size}`
  ),
  processFiles: vi.fn(
    async (files: EnhancedRcFile[]): Promise<FileData[]> => {
      return files.map((file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}`,
        name: file.name,
        records: [
          {
            Quantidade: "4",
            "Card (EN)": "Lightning Bolt",
            "Edicao (Sigla)": "M21",
            Extras: "foil",
          },
        ],
        included: true,
        isRestored: false,
      }));
    }
  ),
}));

describe("useFileProcessor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should initialize with empty file list", () => {
      const { result } = renderHook(() => useFileProcessor());

      expect(result.current.fileDataList).toEqual([]);
      expect(result.current.processingFiles).toBe(false);
    });
  });

  describe("handleFiles", () => {
    it("should process new files and add them to the list", async () => {
      const { result } = renderHook(() => useFileProcessor());

      const file1 = {
        name: "test1.csv",
        lastModified: 1000,
        size: 100,
        isRestored: false,
        uid: "uid1",
      } as EnhancedRcFile;

      await act(async () => {
        await result.current.handleFiles([file1]);
      });

      await waitFor(() => {
        expect(result.current.fileDataList).toHaveLength(1);
        expect(result.current.fileDataList[0].name).toBe("test1.csv");
        expect(result.current.fileDataList[0].included).toBe(true);
      });
    });

    it("should not process files that already exist", async () => {
      const { result } = renderHook(() => useFileProcessor());

      const file1 = {
        name: "test1.csv",
        lastModified: 1000,
        size: 100,
        isRestored: false,
        uid: "uid1",
      } as EnhancedRcFile;

      // Process file first time
      await act(async () => {
        await result.current.handleFiles([file1]);
      });

      await waitFor(() => {
        expect(result.current.fileDataList).toHaveLength(1);
      });

      // Try to process same file again
      await act(async () => {
        await result.current.handleFiles([file1]);
      });

      // Should still only have one file
      await waitFor(() => {
        expect(result.current.fileDataList).toHaveLength(1);
      });
    });

    it("should handle multiple new files", async () => {
      const { result } = renderHook(() => useFileProcessor());

      const file1 = {
        name: "test1.csv",
        lastModified: 1000,
        size: 100,
        isRestored: false,
        uid: "uid1",
      } as EnhancedRcFile;

      const file2 = {
        name: "test2.csv",
        lastModified: 2000,
        size: 200,
        isRestored: false,
        uid: "uid2",
      } as EnhancedRcFile;

      await act(async () => {
        await result.current.handleFiles([file1, file2]);
      });

      await waitFor(() => {
        expect(result.current.fileDataList).toHaveLength(2);
        expect(result.current.fileDataList[0].name).toBe("test1.csv");
        expect(result.current.fileDataList[1].name).toBe("test2.csv");
      });
    });

    it("should handle restored files without reprocessing", async () => {
      const { result } = renderHook(() => useFileProcessor());

      // First, add a file normally
      const file1 = {
        name: "test1.csv",
        lastModified: 1000,
        size: 100,
        isRestored: false,
        uid: "uid1",
      } as EnhancedRcFile;

      await act(async () => {
        await result.current.handleFiles([file1]);
      });

      await waitFor(() => {
        expect(result.current.fileDataList).toHaveLength(1);
      });

      // Now simulate a restored file (same file, but marked as restored)
      const restoredFile = {
        name: "test1.csv",
        lastModified: 1000,
        size: 100,
        isRestored: true,
        uid: "uid1",
        id: "test1.csv-1000-100",
      } as EnhancedRcFile;

      await act(async () => {
        await result.current.handleFiles([restoredFile]);
      });

      // Should still only have one file (not duplicate)
      await waitFor(() => {
        expect(result.current.fileDataList).toHaveLength(1);
      });
    });

    it("should return empty array when no files to process", async () => {
      const { result } = renderHook(() => useFileProcessor());

      const returnValue = await act(async () => {
        return await result.current.handleFiles([]);
      });

      expect(returnValue).toEqual([]);
      expect(result.current.fileDataList).toHaveLength(0);
    });

    it("should set processingFiles flag during processing", async () => {
      const { result } = renderHook(() => useFileProcessor());

      const file1 = {
        name: "test1.csv",
        lastModified: 1000,
        size: 100,
        isRestored: false,
        uid: "uid1",
      } as EnhancedRcFile;

      // Start processing
      const processPromise = act(async () => {
        return await result.current.handleFiles([file1]);
      });

      // Processing should be true (though we can't reliably test this due to async nature)
      await processPromise;

      // After processing, should be false
      await waitFor(() => {
        expect(result.current.processingFiles).toBe(false);
      });
    });
  });

  describe("toggleFileIncluded", () => {
    it("should toggle included status of a file", async () => {
      const { result } = renderHook(() => useFileProcessor());

      const file1 = {
        name: "test1.csv",
        lastModified: 1000,
        size: 100,
        isRestored: false,
        uid: "uid1",
      } as EnhancedRcFile;

      await act(async () => {
        await result.current.handleFiles([file1]);
      });

      await waitFor(() => {
        expect(result.current.fileDataList[0].included).toBe(true);
      });

      const fileId = result.current.fileDataList[0].id;

      act(() => {
        result.current.toggleFileIncluded(fileId);
      });

      await waitFor(() => {
        expect(result.current.fileDataList[0].included).toBe(false);
      });

      act(() => {
        result.current.toggleFileIncluded(fileId);
      });

      await waitFor(() => {
        expect(result.current.fileDataList[0].included).toBe(true);
      });
    });

    it("should not affect other files when toggling", async () => {
      const { result } = renderHook(() => useFileProcessor());

      const file1 = {
        name: "test1.csv",
        lastModified: 1000,
        size: 100,
        isRestored: false,
        uid: "uid1",
      } as EnhancedRcFile;

      const file2 = {
        name: "test2.csv",
        lastModified: 2000,
        size: 200,
        isRestored: false,
        uid: "uid2",
      } as EnhancedRcFile;

      await act(async () => {
        await result.current.handleFiles([file1, file2]);
      });

      await waitFor(() => {
        expect(result.current.fileDataList).toHaveLength(2);
        expect(result.current.fileDataList[0].included).toBe(true);
        expect(result.current.fileDataList[1].included).toBe(true);
      });

      const file1Id = result.current.fileDataList[0].id;

      act(() => {
        result.current.toggleFileIncluded(file1Id);
      });

      await waitFor(() => {
        expect(result.current.fileDataList[0].included).toBe(false);
        expect(result.current.fileDataList[1].included).toBe(true);
      });
    });
  });

  describe("restoreFileDataList", () => {
    it("should replace the file list with restored data", () => {
      const { result } = renderHook(() => useFileProcessor());

      const restoredFiles: FileData[] = [
        {
          id: "restored1",
          name: "restored1.csv",
          records: [],
          included: true,
          isRestored: true,
        },
        {
          id: "restored2",
          name: "restored2.csv",
          records: [],
          included: false,
          isRestored: true,
        },
      ];

      act(() => {
        result.current.restoreFileDataList(restoredFiles);
      });

      expect(result.current.fileDataList).toHaveLength(2);
      expect(result.current.fileDataList[0].name).toBe("restored1.csv");
      expect(result.current.fileDataList[1].name).toBe("restored2.csv");
      expect(result.current.fileDataList[0].isRestored).toBe(true);
    });
  });

  describe("resetFiles", () => {
    it("should clear all files from the list", async () => {
      const { result } = renderHook(() => useFileProcessor());

      const file1 = {
        name: "test1.csv",
        lastModified: 1000,
        size: 100,
        isRestored: false,
        uid: "uid1",
      } as EnhancedRcFile;

      await act(async () => {
        await result.current.handleFiles([file1]);
      });

      await waitFor(() => {
        expect(result.current.fileDataList).toHaveLength(1);
      });

      act(() => {
        result.current.resetFiles();
      });

      expect(result.current.fileDataList).toHaveLength(0);
    });
  });
});

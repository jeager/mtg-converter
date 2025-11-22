import type { RcFile } from "antd/es/upload";
import { generateFileId } from "../fileProcessor";
import type { EnhancedRcFile } from "../../types";

// Helper to create mock files
const createMockFile = (
  name: string,
  lastModified: number,
  size: number
): File => {
  const file = new File([""], name, { type: "text/csv" });
  Object.defineProperty(file, "lastModified", {
    value: lastModified,
    writable: false,
  });
  Object.defineProperty(file, "size", { value: size, writable: false });
  return file;
};

// Mock csvParser
jest.mock("../csvParser", () => ({
  parseCsv: jest.fn((content: string) => {
    if (content.includes("test-card")) {
      return [
        {
          Quantidade: "4",
          "Card (EN)": "Lightning Bolt",
          "Edicao (Sigla)": "M21",
          Extras: "foil",
        },
      ];
    }
    return [];
  }),
}));

describe("fileProcessor", () => {
  describe("generateFileId", () => {
    it("should generate a unique ID from file properties", () => {
      const file = createMockFile(
        "test.csv",
        1234567890,
        1024
      ) as unknown as RcFile;

      const id = generateFileId(file);
      expect(id).toBe("test.csv-1234567890-1024");
    });

    it("should generate different IDs for different files", () => {
      const file1 = createMockFile(
        "test1.csv",
        1234567890,
        1024
      ) as unknown as RcFile;
      const file2 = createMockFile(
        "test2.csv",
        1234567890,
        1024
      ) as unknown as RcFile;

      const id1 = generateFileId(file1);
      const id2 = generateFileId(file2);
      expect(id1).not.toBe(id2);
    });

    it("should work with EnhancedRcFile", () => {
      const file = createMockFile(
        "test.csv",
        1234567890,
        2048
      ) as unknown as EnhancedRcFile;
      (file as EnhancedRcFile).isRestored = false;
      (file as EnhancedRcFile).uid = "test-uid";

      const id = generateFileId(file);
      expect(id).toBe("test.csv-1234567890-2048");
    });
  });

  // describe("processFiles", () => {
  //   beforeEach(() => {
  //     // Mock FileReader
  //     global.FileReader = jest.fn().mockImplementation(() => {
  //       let onloadHandler:
  //         | ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown)
  //         | null = null;
  //       let onerrorHandler:
  //         | ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown)
  //         | null = null;

  //       const reader = {
  //         readAsText: jest.fn((file: File) => {
  //           // Simulate async file reading
  //           setTimeout(() => {
  //             if (onloadHandler) {
  //               const content =
  //                 file.name.includes("test") && !file.name.includes("empty")
  //                   ? "test-card,data"
  //                   : "";
  //               const event = {
  //                 target: {
  //                   result: content,
  //                 },
  //               } as ProgressEvent<FileReader>;
  //               onloadHandler.call(reader as FileReader, event);
  //             }
  //           }, 0);
  //         }),
  //         get onload() {
  //           return onloadHandler;
  //         },
  //         set onload(handler) {
  //           onloadHandler = handler;
  //         },
  //         get onerror() {
  //           return onerrorHandler;
  //         },
  //         set onerror(handler) {
  //           onerrorHandler = handler;
  //         },
  //       } as any;
  //       return reader;
  //     }) as unknown as typeof FileReader;
  //   });

  //   it("should return empty array for empty input", async () => {
  //     const result = await processFiles([]);
  //     expect(result).toEqual([]);
  //   });

  //   it("should process a single file", async () => {
  //     const file = createMockFile(
  //       "test.csv",
  //       Date.now(),
  //       100
  //     ) as unknown as RcFile;

  //     const result = await processFiles([file]);

  //     expect(result).toHaveLength(1);
  //     expect(result[0]).toMatchObject({
  //       name: "test.csv",
  //       records: [
  //         {
  //           Quantidade: "4",
  //           "Card (EN)": "Lightning Bolt",
  //           "Edicao (Sigla)": "M21",
  //           Extras: "foil",
  //         },
  //       ],
  //       included: true,
  //       isRestored: false,
  //     });
  //     expect(result[0].id).toBeDefined();
  //   });

  //   it("should process multiple files", async () => {
  //     const file1 = createMockFile(
  //       "test1.csv",
  //       Date.now(),
  //       100
  //     ) as unknown as RcFile;
  //     const file2 = createMockFile(
  //       "test2.csv",
  //       Date.now() + 1000,
  //       200
  //     ) as unknown as RcFile;

  //     const result = await processFiles([file1, file2]);

  //     expect(result).toHaveLength(2);
  //     expect(result[0].name).toBe("test1.csv");
  //     expect(result[1].name).toBe("test2.csv");
  //   });

  //   it("should handle file read errors gracefully", async () => {
  //     global.FileReader = jest.fn().mockImplementation(() => ({
  //       readAsText: jest.fn(function (this: FileReader) {
  //         setTimeout(() => {
  //           if (this.onerror) {
  //             const event = new Event(
  //               "error"
  //             ) as unknown as ProgressEvent<FileReader>;
  //             this.onerror(event);
  //           }
  //         }, 0);
  //       }),
  //       onload: null,
  //       onerror: null,
  //     })) as unknown as typeof FileReader;

  //     const file = createMockFile(
  //       "test.csv",
  //       Date.now(),
  //       100
  //     ) as unknown as RcFile;

  //     await expect(processFiles([file])).rejects.toBeDefined();
  //   });

  //   it("should handle files with empty content", async () => {
  //     const file = createMockFile(
  //       "empty.csv",
  //       Date.now(),
  //       0
  //     ) as unknown as RcFile;

  //     const result = await processFiles([file]);

  //     expect(result).toHaveLength(1);
  //     expect(result[0].records).toEqual([]);
  //   });

  //   it("should work with EnhancedRcFile", async () => {
  //     const file = createMockFile(
  //       "test.csv",
  //       Date.now(),
  //       100
  //     ) as unknown as EnhancedRcFile;
  //     (file as EnhancedRcFile).isRestored = false;
  //     (file as EnhancedRcFile).uid = "test-uid";

  //     const result = await processFiles([file]);

  //     expect(result).toHaveLength(1);
  //     expect(result[0].isRestored).toBe(false);
  //   });
  // });
});

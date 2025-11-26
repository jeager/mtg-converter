import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { UploadFile } from "antd/es/upload";
import type { EnhancedRcFile, FileData } from "../types";

const { Dragger } = Upload;
interface UploaderProps {
  name?: string;
  fileListData: FileData[];
  onChange: (files: EnhancedRcFile[]) => void;
}

export const Uploader = ({ name, fileListData, onChange }: UploaderProps) => {
  const fileList = fileListData.map((f) => ({
    name: f.name,
    uid: f.id,
  })) as UploadFile[];

  return (
    <Dragger
      className="w-full"
      accept=".csv"
      name={name}
      multiple
      fileList={fileList}
      showUploadList={false}
      beforeUpload={() => false} // Prevent automatic upload
      onChange={(info) => {
        // Extract all files from the file list
        // Note: info.fileList contains all files in the current session
        // Files with originFileObj are newly uploaded, files without are restored
        const files: EnhancedRcFile[] = info.fileList
          .map((file: UploadFile): EnhancedRcFile | null => {
            if (file.originFileObj) {
              // Newly uploaded file - has originFileObj (RcFile)
              // Mutate to add isRestored flag and uid (safe since we own the object)
              const orgFile = file.originFileObj as EnhancedRcFile;
              orgFile.isRestored = false;
              orgFile.uid = file.uid;
              return orgFile;
            } else {
              // Restored file - no originFileObj, create minimal EnhancedRcFile
              // This is a synthetic object for restored files that are already in fileDataList
              // These files are never processed (no FileReader), so stub methods are safe
              const syntheticFile: EnhancedRcFile = {
                name: file.name,
                uid: file.uid,
                id: file.uid,
                isRestored: true,
              } as EnhancedRcFile;
              return syntheticFile;
            }
          })
          .filter((file): file is EnhancedRcFile => file !== null);

        if (files.length > 0) {
          onChange(files);
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Clique or arraste arquivos para a área de carregamento
      </p>
      <p className="ant-upload-hint">
        Suporta multiplos arquivos CSV de coleção da Liga Magic
      </p>
    </Dragger>
  );
};

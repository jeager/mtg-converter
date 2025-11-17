import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { RcFile, UploadFile } from "antd/es/upload";

const { Dragger } = Upload;

export const Uploader = ({
  name,
  onChange,
}: {
  name?: string;
  onChange: (files: RcFile[]) => void;
}) => (
  <Dragger
    className="w-full"
    accept=".csv"
    name={name}
    multiple
    showUploadList={false}
    beforeUpload={() => false} // Prevent automatic upload
    onChange={(info) => {
      // Extract all RcFile objects from the file list
      const files = info.fileList
        .map((file: UploadFile) => file.originFileObj as RcFile)
        .filter((file): file is RcFile => file !== undefined);

      if (files.length > 0) {
        onChange(files);
      }
    }}
  >
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">
      Click or drag files to this area to upload
    </p>
    <p className="ant-upload-hint">Support for multiple CSV files</p>
  </Dragger>
);

import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import type { RcFile } from "antd/es/upload";

const { Dragger } = Upload;

export const Uploader = ({
  name,
  onChange,
}: {
  name?: string;
  onChange: (file: RcFile) => void;
}) => (
  <Dragger
    accept=".csv"
    name={name}
    beforeUpload={(file) => {
      onChange(file);
      return false; // Prevent automatic upload
    }}
  >
    <p className="ant-upload-drag-icon">
      <InboxOutlined />
    </p>
    <p className="ant-upload-text">Click or drag file to this area to upload</p>
    <p className="ant-upload-hint">
      Support for a single or bulk upload. Strictly prohibited from uploading
      company data or other banned files.
    </p>
  </Dragger>
);

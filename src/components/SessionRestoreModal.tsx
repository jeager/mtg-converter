import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { SessionData } from "../utils/storage";

interface SessionRestoreModalProps {
  open: boolean;
  sessionData: SessionData | null;
  onRestore: () => void;
  onStartNew: () => void;
}

/**
 * Formats a timestamp to a readable date string
 */
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const SessionRestoreModal = ({
  open,
  sessionData,
  onRestore,
  onStartNew,
}: SessionRestoreModalProps) => {
  if (!sessionData) return null;

  const fileCount = sessionData.fileDataList.length;
  const totalCards = sessionData.fileDataList.reduce(
    (sum, file) => sum + file.records.length,
    0
  );

  return (
    <Modal
      open={open}
      title={
        <span>
          <ExclamationCircleOutlined className="mr-2 text-yellow-500" />
          Restore Previous Session?
        </span>
      }
      onOk={onRestore}
      onCancel={onStartNew}
      okText="Restore Session"
      cancelText="Start New Session"
      okButtonProps={{ type: "primary" }}
      cancelButtonProps={{ danger: true }}
      closable={false}
      maskClosable={false}
    >
      <div className="py-4">
        <p className="mb-4">
          We found a previous session from{" "}
          <strong>{formatDate(sessionData.timestamp)}</strong>.
        </p>
        <div className="bg-gray-50 p-4 rounded">
          <p className="mb-2">
            <strong>Previous session details:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>{fileCount} file{fileCount !== 1 ? "s" : ""} uploaded</li>
            <li>{totalCards} total card{totalCards !== 1 ? "s" : ""}</li>
          </ul>
        </div>
        <p className="mt-4 text-gray-600">
          Would you like to restore this session or start fresh?
        </p>
      </div>
    </Modal>
  );
};


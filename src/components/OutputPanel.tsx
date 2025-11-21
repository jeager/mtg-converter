import { useState } from "react";
import { Alert, Button, Flex, Input } from "antd";
import { CopyOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface OutputPanelProps {
  parsedFile: string;
}

const ALERT_DURATION = 10000; // 10 seconds

export const OutputPanel = ({ parsedFile }: OutputPanelProps) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(parsedFile);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), ALERT_DURATION);
  };

  return (
    <>
      {showAlert && (
        <Flex className="absolute bottom-5 z-10 right-10">
          <Alert
            message="Copied to clipboard!"
            type="success"
            showIcon
            closable
            onClose={() => setShowAlert(false)}
          />
        </Flex>
      )}
      <Flex vertical className="p-20">
        <Flex className="!mb-5">
          <Button icon={<CopyOutlined />} onClick={handleCopy}>
            Copy
          </Button>
        </Flex>
        <TextArea value={parsedFile} rows={15} cols={20} readOnly />
      </Flex>
    </>
  );
};

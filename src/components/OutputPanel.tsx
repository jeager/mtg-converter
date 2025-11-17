import { Alert, Button, Flex } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import React from "react";
import TextArea from "antd/es/input/TextArea";

interface OutputPanelProps {
  parsedFile: string;
}

export const OutputPanel = ({ parsedFile }: OutputPanelProps) => {
  const [showAlert, setShowAlert] = React.useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(parsedFile);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 10000);
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

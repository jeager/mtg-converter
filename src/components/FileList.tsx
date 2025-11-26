import { Card, Flex, Switch, Typography } from "antd";
import type { FileData } from "../types";

interface FileListProps {
  files: FileData[];
  onToggleIncluded: (fileId: string) => void;
}

export const FileList = ({ files, onToggleIncluded }: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 w-full !mb-5">
      {files.map((file) => (
        <Card
          key={file.id}
          className="w-full h-full [&_.ant-card-body]:h-full [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col"
        >
          <Flex vertical className="h-full justify-between">
            <Flex vertical className="w-full">
              <Typography.Text strong className="text-base">
                {file.name}
              </Typography.Text>
              <Typography.Text type="secondary" className="text-sm">
                {file.records.length} card
                {file.records.length !== 1 ? "s" : ""}
              </Typography.Text>
            </Flex>
            <Flex align="center" gap="small" vertical className="mt-auto">
              <Typography.Text
                type={file.included ? undefined : "secondary"}
                className="text-sm"
              >
                {file.included ? "Incluída" : "Excluída"}
              </Typography.Text>
              <Switch
                checked={file.included}
                onChange={() => onToggleIncluded(file.id)}
              />
            </Flex>
          </Flex>
        </Card>
      ))}
    </div>
  );
};

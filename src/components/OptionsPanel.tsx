import { Button, Checkbox, Dropdown, Flex, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { CONDITION_MAP, CONDITION_OPTIONS } from "../constants";
import type { ConversionOptions } from "../types";

interface OptionsPanelProps {
  options: ConversionOptions;
  onOptionsChange: (options: ConversionOptions) => void;
  onReset: () => void;
  hasFiles: boolean;
}

export const OptionsPanel = ({
  options,
  onOptionsChange,
  onReset,
  hasFiles,
}: OptionsPanelProps) => {
  const handleOptionChange = <K extends keyof ConversionOptions>(
    key: K,
    value: ConversionOptions[K]
  ) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <Flex vertical className="justify-center align-middle w-full !p-5 !mb-10">
      <Flex justify="space-between" align="center" className="!mb-4">
        <h2 className="text-2xl font-bold">Options</h2>
        {hasFiles && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onReset}
          >
            Reset
          </Button>
        )}
      </Flex>
      <Flex gap="large" wrap>
        <Flex align="center" gap="small">
          <Checkbox
            checked={options.forceCondition}
            onChange={(e) =>
              handleOptionChange("forceCondition", e.target.checked)
            }
          >
            Force Condition
          </Checkbox>
          {options.forceCondition && (
            <Dropdown
              menu={{
                selectable: true,
                onSelect: (e) => handleOptionChange("condition", e.key),
                selectedKeys: [options.condition],
                items: CONDITION_OPTIONS.map((opt) => ({
                  key: opt.key,
                  label: opt.label,
                })),
              }}
            >
              <Typography.Link className="text-lg">
                {
                  CONDITION_MAP[
                    options.condition as keyof typeof CONDITION_MAP
                  ]
                }
              </Typography.Link>
            </Dropdown>
          )}
        </Flex>
        <Checkbox
          checked={options.ignoreEdition}
          onChange={(e) => handleOptionChange("ignoreEdition", e.target.checked)}
        >
          Ignore Edition
        </Checkbox>
      </Flex>
    </Flex>
  );
};

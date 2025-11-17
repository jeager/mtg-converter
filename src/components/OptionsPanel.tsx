import { Checkbox, Dropdown, Flex, Typography } from "antd";
import { CONDITION_MAP, CONDITION_OPTIONS } from "../constants";
import type { ConversionOptions } from "../types";

interface OptionsPanelProps {
  options: ConversionOptions;
  onOptionsChange: (options: ConversionOptions) => void;
}

export const OptionsPanel = ({
  options,
  onOptionsChange,
}: OptionsPanelProps) => {
  return (
    <Flex vertical className="justify-center align-middle w-full !p-5 !mb-10">
      <h2 className="text-2xl font-bold mb-4">Options</h2>
      <Flex>
        <Checkbox
          checked={options.forceCondition}
          onChange={(e) =>
            onOptionsChange({
              ...options,
              forceCondition: e.target.checked,
            })
          }
        >
          Force Condition
        </Checkbox>
        {options.forceCondition && (
          <Dropdown
            className="ml-2 mr-5"
            menu={{
              selectable: true,
              onSelect: (e) =>
                onOptionsChange({ ...options, condition: e.key }),
              selectedKeys: [options.condition],
              items: CONDITION_OPTIONS.map((opt) => ({
                key: opt.key,
                label: opt.label,
              })),
            }}
          >
            <Typography.Link className="text-lg">
              {CONDITION_MAP[options.condition as keyof typeof CONDITION_MAP]}
            </Typography.Link>
          </Dropdown>
        )}
        <Checkbox
          checked={options.ignoreEdition}
          onChange={(e) =>
            onOptionsChange({
              ...options,
              ignoreEdition: e.target.checked,
            })
          }
          className="ml-10"
        >
          Ignore Edition
        </Checkbox>
      </Flex>
    </Flex>
  );
};

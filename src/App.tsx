import {
  Alert,
  Button,
  Checkbox,
  Divider,
  Dropdown,
  Flex,
  Typography,
} from "antd";
import { Uploader } from "./components";
import type { RcFile } from "antd/es/upload";
import { parse } from "csv-parse/sync";

type RecordType = {
  Quantidade: string;
  "Card (EN)": string;
  "Edicao (Sigla)": string;
  Extras?: string;
};
import React from "react";
import TextArea from "antd/es/input/TextArea";
import { CopyOutlined } from "@ant-design/icons";

const CONDITION_MAP = {
  nm: "Near Mint",
  sp: "Slightly Played",
  mp: "Moderately Played",
  hp: "Heavily Played",
  dm: "Damaged",
};

function App() {
  const [parsedFile, setParsedFile] = React.useState<string>("");
  const [options, setOptions] = React.useState<{
    condition: string;
    ignoreEdition: boolean;
    forceCondition: boolean;
  }>({
    condition: "nm",
    ignoreEdition: false,
    forceCondition: false,
  });
  const [showAlert, setShowAlert] = React.useState<boolean>(false);
  const readFile = (file: RcFile) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const content = e.target.result as string;
        const records = parseCsv(content);
        const ligaRecods = records.map(convertToLigaFormat);
        setParsedFile(ligaRecods.join("\n"));
        // Process the content as needed
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
    reader.readAsText(file); // Ensure the file is read as text
  };

  const parseCsv = (content: string) => {
    try {
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
      });
      return records;
    } catch (error) {
      console.error("Error reading or parsing the CSV file:", error);
      return [];
    }
  };

  const convertToLigaFormat = (record: RecordType) => {
    let card = `${record["Quantidade"]} ${record["Card (EN)"]} [QUALIDADE=${
      options.condition
    }] ${options.ignoreEdition ? "" : `[EDICAO=${record["Edicao (Sigla)"]}]`}`;
    if (record["Extras"]) {
      if (record["Extras"].split(",").length) {
        card += ` [EXTRAS=${record["Extras"]}]`;
      }
    }
    return card;
  };

  return (
    <>
      <Flex vertical className="!p-5">
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
        <Flex justify="center" className="w-full">
          <h1 className="text-4xl font-bold !mb-8">MTG Converter</h1>
        </Flex>
        <Flex
          vertical
          className="justify-center align-middle w-full !p-5 !mb-10"
        >
          <h2 className="text-2xl font-bold mb-4">Options</h2>
          <Flex>
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  forceCondition: e.target.checked,
                }))
              }
            >
              Force Condition
            </Checkbox>
            {/* Only show if Force Condition is checked */}
            {options.forceCondition && (
              <Dropdown
                className="ml-2 mr-5"
                menu={{
                  selectable: true,
                  onSelect: (e) =>
                    setOptions((prev) => ({ ...prev, condition: e.key })),
                  selectedKeys: [options.condition],
                  items: [
                    { key: "nm", label: "Near Mint" },
                    { key: "sp", label: "Slightly Played" },
                    { key: "mp", label: "Moderately Played" },
                    { key: "hp", label: "Heavily Played" },
                    { key: "dm", label: "Damaged" },
                  ],
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
            <Checkbox
              onChange={(e) =>
                setOptions((prev) => ({
                  ...prev,
                  ignoreEdition: e.target.checked,
                }))
              }
              className="ml-10"
            >
              Ignore Edition
            </Checkbox>
          </Flex>
        </Flex>
        <Flex justify="center" className="w-full !mb-10">
          <Uploader onChange={readFile} />
        </Flex>
        <Divider />
        <Flex vertical className="p-20">
          <Flex className="!mb-5">
            <Button
              icon={<CopyOutlined />}
              className=""
              onClick={() => {
                navigator.clipboard.writeText(parsedFile);
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 10000);
              }}
            >
              Copy
            </Button>
          </Flex>
          <TextArea value={parsedFile} rows={15} cols={20} />
        </Flex>
      </Flex>
    </>
  );
}

export default App;

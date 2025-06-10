import { Divider, Flex } from "antd";
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

function App() {
  const [parsedFile, setParsedFile] = React.useState<string>("");
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
    const card = `${record["Quantidade"]} ${record["Card (EN)"]} [QUALIDADE=SP] [EDICAO=${record["Edicao (Sigla)"]}]`;
    if (record["Extras"]) {
      if (record["Extras"].split(",").length) {
        card.concat(` [EXTRAS=${record["Extras"]}]`);
      }
    }
    return card;
  };

  return (
    <>
      <Flex vertical>
        <Flex justify="center" className="p-5 w-full">
          <h1 className="text-4xl font-bold mb-8">MTG Converter</h1>
        </Flex>
        <Uploader onChange={readFile} />
        <Divider />
        <Flex className="p-20">
          <TextArea value={parsedFile} rows={15} cols={20} />
        </Flex>
      </Flex>
    </>
  );
}

export default App;

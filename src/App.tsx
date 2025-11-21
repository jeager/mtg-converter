import { useEffect } from "react";
import { Divider, Flex, Spin } from "antd";

import { FileList, OptionsPanel, OutputPanel, Uploader } from "./components";
import { useConversionOptions } from "./hooks/useConversionOptions";
import { useFileProcessor } from "./hooks/useFileProcessor";

function App() {
  const { options, setOptions, parsedFile, reprocessRecords } =
    useConversionOptions();
  const { processingFiles, fileDataList, handleFiles, toggleFileIncluded } =
    useFileProcessor(options.addToList);

  useEffect(() => {
    reprocessRecords(fileDataList);
  }, [fileDataList, reprocessRecords]);

  return (
    <Flex vertical className="!p-5">
      <Flex justify="center" className="w-full">
        <h1 className="text-4xl font-bold !mb-8">MTG Converter</h1>
      </Flex>

      <OptionsPanel options={options} onOptionsChange={setOptions} />

      <Flex justify="center" className="w-full !mb-10">
        <Spin
          wrapperClassName="w-full"
          spinning={processingFiles}
          tip="Processing files..."
        >
          <Uploader onChange={handleFiles} />
        </Spin>
      </Flex>

      <FileList files={fileDataList} onToggleIncluded={toggleFileIncluded} />

      <Divider />

      <OutputPanel parsedFile={parsedFile} />
    </Flex>
  );
}

export default App;

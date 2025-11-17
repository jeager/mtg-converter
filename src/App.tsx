import { Divider, Flex, Spin } from "antd";
import { Uploader, OptionsPanel, OutputPanel } from "./components";
import { useFileProcessor } from "./hooks/useFileProcessor";
import { useConversionOptions } from "./hooks/useConversionOptions";

function App() {
  const { processingFiles, storedRecords, handleFiles } = useFileProcessor();
  const { options, setOptions, parsedFile } =
    useConversionOptions(storedRecords);

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

      <Divider />

      <OutputPanel parsedFile={parsedFile} />
    </Flex>
  );
}

export default App;

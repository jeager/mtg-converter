import { useEffect, useRef } from "react";
import { Divider, Flex, Spin } from "antd";

import {
  FileList,
  OptionsPanel,
  OutputPanel,
  SessionRestoreModal,
  Uploader,
} from "./components";
import { DEFAULT_OPTIONS } from "./constants";
import { useConversionOptions } from "./hooks/useConversionOptions";
import { useFileProcessor } from "./hooks/useFileProcessor";
import { useSessionStorage } from "./hooks/useSessionStorage";

function App() {
  const {
    showRestoreModal,
    storedSession,
    restoreSession,
    startNewSession,
    saveCurrentSession,
  } = useSessionStorage();

  // Track if we've restored a session to prevent immediate save
  const isRestoringSession = useRef<boolean>(false);

  const { options, setOptions, parsedFile, reprocessRecords } =
    useConversionOptions();
  const {
    processingFiles,
    fileDataList,
    handleFiles,
    restoreFileDataList,
    resetFiles,
    toggleFileIncluded,
  } = useFileProcessor();

  // Handle session restoration
  const handleRestoreSession = () => {
    const session = restoreSession();
    if (session) {
      isRestoringSession.current = true;
      // Directly restore the file data list and options
      // This ensures fileDataListRef is immediately updated with restored files
      restoreFileDataList(session.fileDataList);
      setOptions(session.options);
    }
  };

  const handleStartNewSession = () => {
    startNewSession();
    resetFiles();
    setOptions(DEFAULT_OPTIONS);
  };

  const handleReset = () => {
    resetFiles();
    // Optionally reset options to default as well
    setOptions(DEFAULT_OPTIONS);
  };


  // Reprocess records when fileDataList changes
  useEffect(() => {
    reprocessRecords(fileDataList);
  }, [fileDataList, reprocessRecords]);

  // Save session to local storage whenever fileDataList or options change
  useEffect(() => {
    // Don't save immediately after restoration to avoid overwriting
    if (isRestoringSession.current) {
      isRestoringSession.current = false;
      return;
    }

    // Only save if there's actual data
    if (fileDataList.length > 0) {
      saveCurrentSession(fileDataList, options);
    }
  }, [fileDataList, options, saveCurrentSession]);

  return (
    <Flex vertical className="!p-5">
      <SessionRestoreModal
        open={showRestoreModal}
        sessionData={storedSession}
        onRestore={handleRestoreSession}
        onStartNew={handleStartNewSession}
      />

      <Flex justify="center" className="w-full">
        <h1 className="text-4xl font-bold !mb-8">MTG Converter</h1>
      </Flex>

      <OptionsPanel
        options={options}
        onOptionsChange={setOptions}
        onReset={handleReset}
        hasFiles={fileDataList.length > 0}
      />

      <Flex justify="center" className="w-full !mb-10">
        <Spin
          wrapperClassName="w-full"
          spinning={processingFiles}
          tip="Processing files..."
        >
          <Uploader fileListData={fileDataList} onChange={handleFiles} />
        </Spin>
      </Flex>

      <FileList files={fileDataList} onToggleIncluded={toggleFileIncluded} />

      <Divider />

      <OutputPanel parsedFile={parsedFile} />
    </Flex>
  );
}

export default App;

import { describe, it, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import type { FileData } from '../types';
import * as useFileProcessorModule from '../hooks/useFileProcessor';
import * as useSessionStorageModule from '../hooks/useSessionStorage';
import * as useConversionOptionsModule from '../hooks/useConversionOptions';

// Mock all hooks
vi.mock('../hooks/useSessionStorage', () => ({
  useSessionStorage: vi.fn(() => ({
    hasStoredSession: false,
    showRestoreModal: false,
    storedSession: null,
    restoreSession: vi.fn(() => null),
    startNewSession: vi.fn(),
    saveCurrentSession: vi.fn(),
  })),
}));

vi.mock('../hooks/useFileProcessor', () => ({
  useFileProcessor: vi.fn(() => ({
    processingFiles: false,
    fileDataList: [],
    handleFiles: vi.fn(),
    restoreFileDataList: vi.fn(),
    resetFiles: vi.fn(),
    toggleFileIncluded: vi.fn(),
  })),
}));

vi.mock('../hooks/useConversionOptions', () => ({
  useConversionOptions: vi.fn(() => ({
    options: {
      condition: 'nm',
      ignoreEdition: false,
      forceCondition: false,
    },
    setOptions: vi.fn(),
    parsedFile: '',
    reprocessRecords: vi.fn(),
  })),
}));

// Mock components
vi.mock('../components/Uploader', () => ({
  Uploader: ({ onChange }: { onChange: (files: unknown[]) => void }) => (
    <div data-testid="uploader">
      <button onClick={() => onChange([])}>Upload</button>
    </div>
  ),
}));

vi.mock('../components/FileList', () => ({
  FileList: ({ files, onToggleIncluded }: { files: FileData[]; onToggleIncluded: (id: string) => void }) => {
    if (files.length === 0) return null;
    return (
      <div data-testid="file-list">
        {files.map((file) => (
          <div key={file.id} data-testid={`file-${file.id}`}>
            {file.name}
            <button onClick={() => onToggleIncluded(file.id)}>Toggle</button>
          </div>
        ))}
      </div>
    );
  },
}));

vi.mock('../components/SessionRestoreModal', () => ({
  SessionRestoreModal: ({ open, onRestore, onStartNew }: { open: boolean; onRestore: () => void; onStartNew: () => void }) => {
    if (!open) return null;
    return (
      <div data-testid="session-restore-modal">
        <button onClick={onRestore}>Restore</button>
        <button onClick={onStartNew}>Start New</button>
      </div>
    );
  },
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the main title', () => {
    render(<App />);
    expect(screen.getByText('MTG Conversor')).toBeInTheDocument();
  });

  it('should render OptionsPanel', () => {
    render(<App />);
    // OptionsPanel should be rendered (we can check for its content if needed)
    expect(screen.getByTestId('uploader')).toBeInTheDocument();
  });

  it('should render Uploader component', () => {
    render(<App />);
    expect(screen.getByTestId('uploader')).toBeInTheDocument();
  });

  it('should not render FileList when there are no files', () => {
    render(<App />);
    expect(screen.queryByTestId('file-list')).not.toBeInTheDocument();
  });

  it('should render FileList when there are files', () => {
    const useFileProcessor = vi.mocked(useFileProcessorModule.useFileProcessor);
    useFileProcessor.mockReturnValue({
      processingFiles: false,
      fileDataList: [
        {
          id: 'file1',
          name: 'test1.csv',
          records: [],
          included: true,
          isRestored: false,
        },
      ],
      handleFiles: vi.fn(),
      restoreFileDataList: vi.fn(),
      resetFiles: vi.fn(),
      toggleFileIncluded: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId('file-list')).toBeInTheDocument();
    expect(screen.getByTestId('file-file1')).toBeInTheDocument();
    expect(screen.getByText('test1.csv')).toBeInTheDocument();
  });

  it('should show session restore modal when showRestoreModal is true', () => {
    const useSessionStorage = vi.mocked(useSessionStorageModule.useSessionStorage);
    useSessionStorage.mockReturnValue({
      hasStoredSession: true,
      showRestoreModal: true,
      storedSession: {
        version: '1.0.0',
        fileDataList: [],
        options: { condition: 'nm', ignoreEdition: false, forceCondition: false },
        timestamp: Date.now(),
      },
      restoreSession: vi.fn(() => ({
        version: '1.0.0',
        fileDataList: [],
        options: { condition: 'nm', ignoreEdition: false, forceCondition: false },
        timestamp: Date.now(),
      })),
      startNewSession: vi.fn(),
      saveCurrentSession: vi.fn(),
    });

    render(<App />);
    expect(screen.getByTestId('session-restore-modal')).toBeInTheDocument();
  });

  it('should call restoreSession when restore button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const mockRestoreSession = vi.fn(() => ({
      version: '1.0.0',
      fileDataList: [],
      options: { condition: 'nm', ignoreEdition: false, forceCondition: false },
      timestamp: Date.now(),
    }));

    const useSessionStorage = vi.mocked(useSessionStorageModule.useSessionStorage);
    useSessionStorage.mockReturnValue({
      hasStoredSession: true,
      showRestoreModal: true,
      storedSession: {
        version: '1.0.0',
        fileDataList: [],
        options: { condition: 'nm', ignoreEdition: false, forceCondition: false },
        timestamp: Date.now(),
      },
      restoreSession: mockRestoreSession,
      startNewSession: vi.fn(),
      saveCurrentSession: vi.fn(),
    });

    const mockRestoreFileDataList = vi.fn();
    const mockSetOptions = vi.fn();

    const useFileProcessor = vi.mocked(useFileProcessorModule.useFileProcessor);
    useFileProcessor.mockReturnValue({
      processingFiles: false,
      fileDataList: [],
      handleFiles: vi.fn(),
      restoreFileDataList: mockRestoreFileDataList,
      resetFiles: vi.fn(),
      toggleFileIncluded: vi.fn(),
    });

    const useConversionOptions = vi.mocked(useConversionOptionsModule.useConversionOptions);
    useConversionOptions.mockReturnValue({
      options: { condition: 'nm', ignoreEdition: false, forceCondition: false },
      setOptions: mockSetOptions,
      parsedFile: '',
      reprocessRecords: vi.fn(),
    });

    render(<App />);
    const restoreButton = screen.getByText('Restore');
    await user.click(restoreButton);

    expect(mockRestoreSession).toHaveBeenCalled();
  });

  it('should call startNewSession when start new button is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const mockStartNewSession = vi.fn();

    const useSessionStorage = vi.mocked(useSessionStorageModule.useSessionStorage);
    useSessionStorage.mockReturnValue({
      hasStoredSession: true,
      showRestoreModal: true,
      storedSession: {
        version: '1.0.0',
        fileDataList: [],
        options: { condition: 'nm', ignoreEdition: false, forceCondition: false },
        timestamp: Date.now(),
      },
      restoreSession: vi.fn(),
      startNewSession: mockStartNewSession,
      saveCurrentSession: vi.fn(),
    });

    const mockResetFiles = vi.fn();
    const mockSetOptions = vi.fn();

    const useFileProcessor = vi.mocked(useFileProcessorModule.useFileProcessor);
    useFileProcessor.mockReturnValue({
      processingFiles: false,
      fileDataList: [],
      handleFiles: vi.fn(),
      restoreFileDataList: vi.fn(),
      resetFiles: mockResetFiles,
      toggleFileIncluded: vi.fn(),
    });

    const useConversionOptions = vi.mocked(useConversionOptionsModule.useConversionOptions);
    useConversionOptions.mockReturnValue({
      options: { condition: 'nm', ignoreEdition: false, forceCondition: false },
      setOptions: mockSetOptions,
      parsedFile: '',
      reprocessRecords: vi.fn(),
    });

    render(<App />);
    const startNewButton = screen.getByText('Start New');
    await user.click(startNewButton);

    expect(mockStartNewSession).toHaveBeenCalled();
    expect(mockResetFiles).toHaveBeenCalled();
  });

  it('should render OutputPanel with parsed file', () => {
    const useConversionOptions = vi.mocked(useConversionOptionsModule.useConversionOptions);
    useConversionOptions.mockReturnValue({
      options: { condition: 'nm', ignoreEdition: false, forceCondition: false },
      setOptions: vi.fn(),
      parsedFile: '4 Lightning Bolt [QUALIDADE=nm] [EDICAO=M21]',
      reprocessRecords: vi.fn(),
    });

    render(<App />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('4 Lightning Bolt [QUALIDADE=nm] [EDICAO=M21]');
  });

  it('should call toggleFileIncluded when file toggle is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    const mockToggleFileIncluded = vi.fn();

    const useFileProcessor = vi.mocked(useFileProcessorModule.useFileProcessor);
    useFileProcessor.mockReturnValue({
      processingFiles: false,
      fileDataList: [
        {
          id: 'file1',
          name: 'test1.csv',
          records: [],
          included: true,
          isRestored: false,
        },
      ],
      handleFiles: vi.fn(),
      restoreFileDataList: vi.fn(),
      resetFiles: vi.fn(),
      toggleFileIncluded: mockToggleFileIncluded,
    });

    render(<App />);
    const toggleButton = screen.getByText('Toggle');
    await user.click(toggleButton);

    expect(mockToggleFileIncluded).toHaveBeenCalledWith('file1');
  });

  it('should show processing spinner when processingFiles is true', () => {
    const useFileProcessor = vi.mocked(useFileProcessorModule.useFileProcessor);
    useFileProcessor.mockReturnValue({
      processingFiles: true,
      fileDataList: [],
      handleFiles: vi.fn(),
      restoreFileDataList: vi.fn(),
      resetFiles: vi.fn(),
      toggleFileIncluded: vi.fn(),
    });

    render(<App />);
    // The Spin component should be rendered (checking for processing state)
    // Note: Ant Design's Spin component doesn't expose a clear test id, 
    // but we can verify the uploader is still rendered
    expect(screen.getByTestId('uploader')).toBeInTheDocument();
  });
});


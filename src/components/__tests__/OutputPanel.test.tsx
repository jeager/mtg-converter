import { describe, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OutputPanel } from "../OutputPanel";

describe("OutputPanel", () => {
  it("should render the parsed file content", () => {
    const parsedFile = "4 Lightning Bolt [QUALIDADE=nm] [EDICAO=M21]";
    render(<OutputPanel parsedFile={parsedFile} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue(parsedFile);
    expect(textarea).toHaveAttribute("readOnly");
  });

  it("should render empty textarea when parsedFile is empty", () => {
    render(<OutputPanel parsedFile="" />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("");
  });

  it("should copy content to clipboard when Copy button is clicked", async () => {
    const user = userEvent.setup({ delay: null });
    const parsedFile = "4 Lightning Bolt [QUALIDADE=nm] [EDICAO=M21]";
    act(() => {
      render(<OutputPanel parsedFile={parsedFile} />);
    });

    // Mock clipboard API
    const writeTextMock = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    expect(writeTextMock).toHaveBeenCalledWith(parsedFile);
  });

  it("should show success alert after copying", async () => {
    const user = userEvent.setup({ delay: null });
    const parsedFile = "4 Lightning Bolt [QUALIDADE=nm] [EDICAO=M21]";
    render(<OutputPanel parsedFile={parsedFile} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    // Alert should appear
    await waitFor(() => {
      expect(screen.getByText(/copiado/i)).toBeInTheDocument();
    });
  });

  it("should allow closing alert manually", async () => {
    const user = userEvent.setup({ delay: null });
    const parsedFile = "4 Lightning Bolt [QUALIDADE=nm] [EDICAO=M21]";
    render(<OutputPanel parsedFile={parsedFile} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    // Alert should appear
    await waitFor(() => {
      expect(screen.getByText(/copiado/i)).toBeInTheDocument();
    });

    // Find and click the close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    // Alert should be gone
    await waitFor(() => {
      expect(
        screen.queryByText(/copied to clipboard!/i)
      ).not.toBeInTheDocument();
    });
  });

  it("should handle multiple copy operations", async () => {
    const user = userEvent.setup({ delay: null });
    const parsedFile = "4 Lightning Bolt [QUALIDADE=nm] [EDICAO=M21]";
    render(<OutputPanel parsedFile={parsedFile} />);

    // Mock clipboard API
    const writeTextMock = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    const copyButton = screen.getByRole("button", { name: /copy/i });

    await user.click(copyButton);
    expect(writeTextMock).toHaveBeenCalledTimes(1);

    await user.click(copyButton);
    expect(writeTextMock).toHaveBeenCalledTimes(2);
  });
});

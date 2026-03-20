import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../test/setup";
import { UploadModal } from "./UploadModal";

describe("UploadModal component", () => {
  const reloadMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("location", { reload: reloadMock });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    reloadMock.mockClear();
  });

  it("renders trigger element", () => {
    render(
      <UploadModal>
        <button>Test Trigger</button>
      </UploadModal>,
    );
    expect(screen.getByText("Test Trigger")).toBeInTheDocument();
  });

  it("opens modal on trigger click", async () => {
    render(
      <UploadModal>
        <button>Test Trigger</button>
      </UploadModal>,
    );
    await userEvent.click(screen.getByText("Test Trigger"));

    expect(screen.getByText("Upload Universe Definition")).toBeInTheDocument();
    expect(
      screen.getByText("Waiting for file selection..."),
    ).toBeInTheDocument();
  });

  it("shows error for invalid file name", async () => {
    const { container } = render(
      <UploadModal>
        <button>Test Trigger</button>
      </UploadModal>,
    );

    await userEvent.click(screen.getByText("Test Trigger"));

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File([""], "invalid.csv", { type: "text/csv" });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(
        screen.getByText(
          /Unable to generate metadata as filename is not valid/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows selected file details for valid file name", async () => {
    const { container } = render(
      <UploadModal>
        <button>Test Trigger</button>
      </UploadModal>,
    );

    await userEvent.click(screen.getByText("Test Trigger"));

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["1,2,3"], "equity_vanilla_option_hkg.csv", {
      type: "text/csv",
    });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(
        screen.getByText("equity_vanilla_option_hkg.csv"),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByText(
        /Unable to generate metadata as filename is not valid/i,
      ),
    ).not.toBeInTheDocument();

    const confirmButton = screen.getByRole("button", {
      name: "Confirm Upload",
    });
    expect(confirmButton).not.toBeDisabled();
  });

  it("submits file successfully and reloads page", async () => {
    let postData: {
      service?: string;
      region?: string;
      [key: string]: unknown;
    } | null = null;
    server.use(
      http.post(
        "http://localhost:3000/universeDefinitions",
        async ({ request }) => {
          postData = (await request.json()) as {
            service?: string;
            region?: string;
            [key: string]: unknown;
          };
          return HttpResponse.json({ success: true }, { status: 201 });
        },
      ),
    );

    const { container } = render(
      <UploadModal>
        <button>Test Trigger</button>
      </UploadModal>,
    );

    await userEvent.click(screen.getByText("Test Trigger"));

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["1,2,3"], "equity_vanilla_option_hkg.csv", {
      type: "text/csv",
    });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Confirm Upload" }),
      ).not.toBeDisabled();
    });

    await userEvent.click(
      screen.getByRole("button", { name: "Confirm Upload" }),
    );

    await waitFor(() => {
      expect(postData).toBeTruthy();
    });

    expect(postData?.service).toBe("equity_vanilla_option");
    expect(postData?.region).toBe("HKG");
    expect(reloadMock).toHaveBeenCalled();
  });

  it("shows error on failed upload", async () => {
    server.use(
      http.post("http://localhost:3000/universeDefinitions", () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );

    const { container } = render(
      <UploadModal>
        <button>Test Trigger</button>
      </UploadModal>,
    );

    await userEvent.click(screen.getByText("Test Trigger"));

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(["1,2,3"], "equity_vanilla_option_hkg.csv", {
      type: "text/csv",
    });
    await userEvent.upload(fileInput, file);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Confirm Upload" }),
      ).not.toBeDisabled();
    });

    await userEvent.click(
      screen.getByRole("button", { name: "Confirm Upload" }),
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to save data/i)).toBeInTheDocument();
    });

    expect(reloadMock).not.toHaveBeenCalled();
  });
});

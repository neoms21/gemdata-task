import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs component", () => {
  const renderBreadcrumbs = (initialEntries: string[]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Breadcrumbs />
      </MemoryRouter>,
    );
  };

  it("renders 'Dashboard' on the root path", () => {
    renderBreadcrumbs(["/"]);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Universe Definition" })).not.toBeInTheDocument();
  });

  it("renders correct crumbs for '/universe-definition'", () => {
    renderBreadcrumbs(["/universe-definition"]);
    
    // Dashboard should be a link
    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/");

    // Universe Definition should be text (last segment)
    expect(screen.getByText("Universe Definition")).toBeInTheDocument();
  });

  it("renders correctly for custom nested paths", () => {
    renderBreadcrumbs(["/settings/user-profile"]);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    
    // Settings should be a link
    const settingsLink = screen.getByRole("link", { name: "Settings" });
    expect(settingsLink).toBeInTheDocument();
    expect(settingsLink).toHaveAttribute("href", "/settings");

    // User profile should be text (last segment) and formatted
    expect(screen.getByText("User profile")).toBeInTheDocument();
  });

  it("navigates back to dashboard when clicking Dashboard link", () => {
    renderBreadcrumbs(["/universe-definition"]);
    const dashboardLink = screen.getByRole("link", { name: "Dashboard" });
    expect(dashboardLink).toHaveAttribute("href", "/");
  });
});

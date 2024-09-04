/**
 * This test file contains tests for the App component.
 */

import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import ErrorBoundary from "~/components/ErrorBoundary";
import App from "../App";
import AppWrapper from "../components/AppWrapper";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  test("should render and interact with the App component correctly", async () => {
    render(<App />, { wrapper: AppWrapper });

    // Check the elements on the main page
    await waitFor(() => {
      // Check that the title is "NTQ Redmine"
      expect(document.querySelector("title")?.textContent).toBe("NTQ Redmine");

      // Check that the "My page" text is present
      expect(screen.getByText("My page")).toBeInTheDocument();

      // Check that the "Projects" text is present
      expect(screen.getByText("Projects")).toBeInTheDocument();

      // Check that the "Help" text is present
      expect(screen.getByText("Help")).toBeInTheDocument();

      // Check that the "Latest projects" text is present
      expect(screen.getByText("Latest projects")).toBeInTheDocument();

      // Check that the "NTQ Redmine" text is present
      expect(screen.getByText("NTQ Redmine")).toBeInTheDocument();
    });

    // Click on the "Projects" link and check the page title
    userEvent.click(screen.getByRole("link", { name: "Projects" }));
    await waitFor(() => {
      // Check that the title is "Projects - NTQ Redmine"
      expect(document.querySelector("title")?.textContent).toBe("Projects - NTQ Redmine");
    });

    // Click on the "My page" link and check the page title
    userEvent.click(screen.getByRole("link", { name: "My page" }));
    await waitFor(() => {
      // Check that the title is "My page - NTQ Redmine"
      expect(document.querySelector("title")?.textContent).toBe("My page - NTQ Redmine");
    });

    // Check that the user clicks the "Personalize this page" and checks the elements in the page

    //Check that the remove calendar block
    await userEvent.click(screen.getByText("Personalize this page"));
    await userEvent.click(screen.getByTestId("btn-close-calendar"));

    await waitFor(() => {
      // Check that the "add" text is present
      expect(screen.getByText(/add/i)).toBeInTheDocument();

      // Check that the "back" text is present
      expect(screen.getByText(/back/i)).toBeInTheDocument();

      // Check that the "My page block:" text is present
      expect(screen.getByText("My page block:")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Back"));

    await waitFor(() => {
      // Check that the "calendar" text is not present on the page
      const headingElement = screen.queryByText(/calendar/i);
      expect(headingElement).toBeNull();
    });

    // Check that the user clicks the "Personalize this page" and add "Calendar" block
    await userEvent.click(screen.getByText(/Personalize this page/i));

    await userEvent.selectOptions(
      screen.getByTestId("blockSelect"), // Phần tử select
      screen.getByRole("option", { name: "Calendar" }), // Tùy chọn
    );
    await userEvent.click(screen.getByText(/Add/i));
    await userEvent.click(screen.getByText(/Back/i));
    await userEvent.click(screen.getByText(/Personalize this page/i));
    await waitFor(() => {
      // Check that the "calendar" text is present on the page
      expect(screen.getByText(/calendar/i)).toBeInTheDocument();
    });

    // Remove all blocks
    await userEvent.click(screen.getByTestId("btn-close-watched-issues"));
    await userEvent.click(screen.getByTestId("btn-close-reported-issues"));
    await userEvent.click(screen.getByTestId("btn-close-issues-assigned"));
    await userEvent.click(screen.getByTestId("btn-close-spent-time"));
    await userEvent.click(screen.getByTestId("btn-close-latest-news"));
    await userEvent.click(screen.getByTestId("btn-close-documents"));
    await userEvent.click(screen.getByText(/Back/i));
    await waitFor(() => {
      // Check that the "watched issues" text is not present on the page
      const headingElement = screen.queryByText(/watched issues/i);
      expect(headingElement).toBeNull();

      // Check that the "reported issues" text is not present on the page
      const headingElement2 = screen.queryByText(/reported issues/i);
      expect(headingElement2).toBeNull();

      // Check that the "issues assigned to me" text is not present on the page
      const headingElement3 = screen.queryByText(/issues assigned to me/i);
      expect(headingElement3).toBeNull();

      // Check that the "spent time" text is not present on the page

      const headingElement4 = screen.queryByText(/spent time/i);
      expect(headingElement4).toBeNull();

      // Check that the "latest news" text is not present on the page
      const headingElement5 = screen.queryByText(/latest news/i);
      expect(headingElement5).toBeNull();

      // Check that the "documents" text is not present on the page
      const headingElement6 = screen.queryByText(/documents/i);
      expect(headingElement6).toBeNull();
    });
    screen.debug(document.body.parentElement as HTMLElement, 999999999);
  });

  test("should render not found page", async () => {
    window.history.pushState({}, "", "/non-existent-path");
    render(<App />, { wrapper: AppWrapper });

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  test("should render error boundary", () => {
    const ErrorComponent = () => {
      throw new Error("Test Error");
    };
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
      { wrapper: AppWrapper },
    );

    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("Quay lại trang chủ")).toBeInTheDocument();
  });

  test("should render login page", async () => {
    window.history.pushState({}, "", "/login");
    render(<App />, { wrapper: AppWrapper });
    expect(screen.getByText(/Login:/i)).toBeInTheDocument();
    expect(screen.getByText(/Password:/i)).toBeInTheDocument();
  });

  test("should render lost password page", async () => {
    window.history.pushState({}, "", "/lost-password");
    render(<App />, { wrapper: AppWrapper });

    expect(screen.getByText(/Lost Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
  });

  test("should render project page", async () => {
    render(<App />, { wrapper: AppWrapper });

    // Click on the "Projects" link and check the page title
    await userEvent.click(screen.getByRole("link", { name: "Projects" }));
    await waitFor(() => {
      // Check that the title is "Projects - NTQ Redmine"
      expect(document.querySelector("title")?.textContent).toBe("Projects - NTQ Redmine");
      expect(screen.getByText("[Fresher]_ ReactJS Fresher")).toBeInTheDocument();

      screen.debug(document.body.parentElement as HTMLElement, 999999999);
    });
    await userEvent.click(screen.getByText("[Fresher]_ ReactJS Fresher"));
  });

  test("should render spent time page", async () => {
    render(<App />, { wrapper: AppWrapper });

    await userEvent.click(screen.getByText(/My page/i));
    await userEvent.click(screen.getByText(/Personalize this page/i));
    await userEvent.selectOptions(screen.getByTestId("blockSelect"), screen.getByRole("option", { name: "Spent time" }));
    await userEvent.click(screen.getByText(/Add/i));
    await userEvent.click(screen.getByRole("link", { name: /Spent time/i }));
    await userEvent.click(screen.getByText(/Detail/i));
    await userEvent.click(screen.getByText(/Report/i));
    await userEvent.click(screen.getByText(/Apply/i));
    await userEvent.click(screen.getByText(/log time/i));
    screen.debug(document.body.parentElement as HTMLElement, 999999999);
    await userEvent.selectOptions(screen.getByTestId("projectOption"), screen.getByTestId("projectOption project 1"));
    await userEvent.selectOptions(screen.getByTestId("activity"), screen.getByTestId("activity project 2"));
    await userEvent.selectOptions(screen.getByTestId("productCategory"), screen.getByTestId("productCategory project 3"));
    await userEvent.click(screen.getByText(/Create and continue/i));
  });

  // test("should render time entry page", async () => {
  //   render(<App />, { wrapper: AppWrapper });

  //   await userEvent.click(screen.getByText(/My page/i));

  //   // await userEvent.click(screen.getByText(/Personalize this page/i));

  //   // await userEvent.selectOptions(screen.getByTestId("blockSelect"), screen.getByRole("option", { name: "Spent time" }));
  //   // await userEvent.click(screen.getByText(/Add/i));
  //   // await userEvent.click(screen.getByRole("link", { name: /Spent time/i }));
  //   // await userEvent.click(screen.getByText(/Options/i));
  //   screen.debug(document.body.parentElement as HTMLElement, 999999999);
  // });

  test("should render option spent time page", async () => {
    render(<App />, { wrapper: AppWrapper });

    await userEvent.click(screen.getByText(/My page/i));
    await userEvent.click(screen.getByText(/Personalize this page/i));
    await userEvent.selectOptions(screen.getByTestId("blockSelect"), screen.getByRole("option", { name: "Spent time" }));
    await userEvent.click(screen.getByText(/Add/i));
    await userEvent.click(screen.getByRole("link", { name: /Spent time/i }));
    await userEvent.click(screen.getByText(/Options/i));
    await userEvent.click(screen.getByText(/similar/i));
    await userEvent.click(screen.getByText(/→/i));
    await userEvent.click(screen.getByText(/similar/i));
    await userEvent.click(screen.getByText(/←/i));
    await userEvent.click(screen.getByText(/similar/i));
    await userEvent.click(screen.getByText(/→/i));
    await userEvent.click(screen.getByText(/similar/i));
    await userEvent.click(screen.getByText(/↑/i));
    await userEvent.click(screen.getByText(/similar/i));
    await userEvent.click(screen.getByText(/↓/i));
    await userEvent.click(screen.getByText(/similar/i));
    await userEvent.click(screen.getByText(/⇊/i));
    await userEvent.dblClick(screen.getByText(/similar/i));
    await userEvent.dblClick(screen.getByText(/similar/i));
    await userEvent.click(screen.getByText(/version/i));
    // screen.debug(document.body.parentElement as HTMLElement, 999999999);
  });

  test("should render activity page", async () => {
    render(<App />, { wrapper: AppWrapper });
    await userEvent.click(screen.getByRole("link", { name: "Projects" }));
    await waitFor(() => {
      const element = screen.getByTestId("desired-element");
      screen.debug(document.body.parentElement as HTMLElement, 999999999);
      expect(element).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("[Fresher]_ ReactJS Fresher"));
    // await userEvent.click(screen.getByText(/Activity/i));
  });

  test("should render activity page", async () => {
    render(<App />, { wrapper: AppWrapper });
    await userEvent.click(screen.getByRole("link", { name: "Projects" }));
  });

  // screen.debug(document.body.parentElement as HTMLElement, 999999999);
});

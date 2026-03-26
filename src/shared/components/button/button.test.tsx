import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Button from "./Button";

describe("Button component", () => {
  it("should render without crashing", () => {
    render(<Button />);
    expect(screen.getByText("Button")).toBeDefined();
  });
});

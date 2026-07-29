import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PinCardSkeleton } from "@/features/pins/components/PinCardSkeleton";
import { getPinPlaceholderColor } from "@/features/pins/placeholderColors";

describe("Pin presentation helpers", () => {
  it("cycles placeholder colors deterministically", () => {
    expect(getPinPlaceholderColor(0)).toBe("#124873");
    expect(getPinPlaceholderColor(9)).toBe("#124873");
    expect(getPinPlaceholderColor(10)).toBe("#8f433b");
  });

  it("uses a stable skeleton size", () => {
    const { container } = render(<PinCardSkeleton />);

    expect(container.firstElementChild).toHaveClass("h-80", "w-full");
  });
});

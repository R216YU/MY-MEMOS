import { describe, expect, it } from "vitest";
import { generateRandomInteger } from "./example-utils";

describe("generateRandomInteger", () => {
  it("should generate a random integer between min and max", () => {
    const min = 1;
    const max = 10;
    const result = generateRandomInteger(min, max);
    expect(result).to.be.at.least(min);
    expect(result).to.be.at.most(max);
  });
});

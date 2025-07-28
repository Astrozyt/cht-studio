import { describe, it, expect } from "vitest";
import { parseLogic } from "../src/ohmConverter";

describe("ohmConverter", () => {
  it("parses combinations of expressions and function calls", () => {
    const input =
      "${a} = '1' and not(${b} = 'test') or selected(${c}, 'value') and ${d} != 'hello'";
    const expectedOutput = {
      or: [
        {
          and: [
            { "==": [{ var: "a" }, "1"] },
            { "!": { "==": [{ var: "b" }, "test"] } },
          ],
        },
        {
          and: [
            { selected: [{ var: "c" }, "value"] },
            { "!=": [{ var: "d" }, "hello"] },
          ],
        },
      ],
    };
    const result = parseLogic(input);
    expect(result).toEqual(expectedOutput);
  });
});

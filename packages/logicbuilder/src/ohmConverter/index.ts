import { logicGrammar, semantics } from "./grammar";

export function parseLogic(input: string) {
  const match = logicGrammar.match(input);
  if (!match.succeeded()) {
    throw new Error("Parse failed: " + match.message);
  }
  return semantics(match).toAST();
}

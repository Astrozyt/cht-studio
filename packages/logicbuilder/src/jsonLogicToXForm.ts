export const jsonLogicToXFormExpr = (logic): string => {
  if (!logic || typeof logic !== "object") return "";

  const op = Object.keys(logic)[0];
  const args = logic[op];

  switch (op) {
    case "and":
      return args.map(jsonLogicToXFormExpr).join(" and ");
    case "or":
      return args.map(jsonLogicToXFormExpr).join(" or ");
    case "==":
      return `${jsonLogicToXFormExpr(args[0])} = ${jsonLogicToXFormExpr(
        args[1]
      )}`;
    case "!=":
      return `${jsonLogicToXFormExpr(args[0])} != ${jsonLogicToXFormExpr(
        args[1]
      )}`;
    case "<":
    case ">":
    case "<=":
    case ">=":
      return `${jsonLogicToXFormExpr(args[0])} ${op} ${jsonLogicToXFormExpr(
        args[1]
      )}`;
    case "var":
      return `\${${args}}`;
    default:
      return JSON.stringify(logic); // fallback
  }
};

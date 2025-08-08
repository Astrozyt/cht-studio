import * as ohm from "ohm-js";

export const logicGrammar = ohm.grammar(`
Logic {
  Expr =
      OrExpr
    | ComparisonExpr
    | FunctionCall
    | Field
    | IfExpr
    | Value

  OrExpr =
    AndExpr ("or" AndExpr)* --or

  AndExpr =
    ComparisonExpr ("and" ComparisonExpr)* --and

  ComparisonExpr =
    AddExpr (Comparator AddExpr)? --compare

  AddExpr =
    MulExpr (("+" | "-") MulExpr)* --binary

  MulExpr =
    Primary (("*" | "/") Primary)* --binary

  Primary =
      "(" Expr ")" --parens
    | FunctionCall
    | Field
    | Value

  Field =
    "$" "{" identifier "}"

  Comparator =
    "!=" | "=" | "<=" | ">=" | "<" | ">"

  Value =
      "'" valuechars* "'" --string
    | number              --number

  number =
    digit+ ("." digit+)?  

  valuechars =
    ~"'" any

  identifier =
    letter (letter | digit | "_")*

  FunctionCall =
      "selected" _ "(" _ Expr _ "," _ Value _ ")"              --selected
    | "not" _ "(" _ Expr _ ")"                                 --not
    | "if" _ "(" _ Expr _ "," _ Expr _ "," _ Expr _ ")"        --if
    | "int" _ "(" _ Expr _ ")"                                 --int
    | "decimal-date-time" _ "(" _ Expr _ ")"                   --decimalDateTime
    | "coalesce" _ "(" _ ExprList _ ")"                        --coalesce
    | "count-selected" _ "(" _ Expr _ ")"                      --countSelected
    | "substr" _ "(" _ Expr _ "," _ Expr _ "," _ Expr _ ")"    --substr
    | "string-length" _ "(" _ Expr _ ")"                       --stringLength
    | "today" _ "(" _ ")"                                      --today
    | "now" _ "(" _ ")"                                        --now

  IfExpr =
    "if" _ "(" Expr "," Expr "," Expr ")" --if

  ExprList =
    ListOf<Expr, ",">

  _ =
    " "*
}

`);

export const semantics = logicGrammar.createSemantics().addOperation("toAST", {
  _iter(...children) {
    return children.map((c) => c.toAST());
  },
  Expr(e) {
    return e.toAST();
  },

  OrExpr_or(first, _, rest) {
    if (rest.numChildren === 0) return first.toAST();

    const terms = [first.toAST()];
    for (let i = 0; i < rest.numChildren; i++) {
      // Each child is a sequence: ("or" AndExpr)
      // We want the second part (index 1) which is the AndExpr
      terms.push(rest.child(i).toAST());
    }
    return { or: terms };
  },

  AndExpr_and(first, _, rest) {
    if (rest.numChildren === 0) return first.toAST();

    const terms = [first.toAST()];
    for (let i = 0; i < rest.numChildren; i++) {
      // Each child is a sequence: ("and" ComparisonExpr)
      // We want the second part (index 1) which is the ComparisonExpr
      terms.push(rest.child(i).toAST());
    }
    return { and: terms };
  },

  ComparisonExpr_compare(left, compAndRight, _) {
    if (compAndRight.numChildren === 0) {
      return left.toAST();
    }

    const comp = compAndRight.child(0);
    const right = compAndRight.child(1);

    const opMap = {
      "=": "==",
      "!=": "!=",
      "<": "<",
      "<=": "<=",
      ">": ">",
      ">=": ">=",
    };

    const op = opMap[comp.sourceString.trim()];
    if (!op) throw new Error("Unsupported comparator: " + comp.sourceString);

    return {
      [op]: [left.toAST(), right.toAST()],
    };
  },

  Primary_parens(_lp, expr, _rp) {
    return expr.toAST();
  },

  AddExpr_binary(first, ops, rest) {
    if (rest.children.length === 0) return first.toAST();

    return rest.children.reduce((acc, pair) => {
      const op = pair.child(0).sourceString;
      const right = pair.child(1).toAST();
      return {
        [op]: [acc, right],
      };
    }, first.toAST());
  },

  MulExpr_binary(first, ops, rest) {
    if (rest.children.length === 0) return first.toAST();

    return rest.children.reduce((acc, pair) => {
      const op = pair.child(0).sourceString;
      const right = pair.child(1).toAST();
      return {
        [op]: [acc, right],
      };
    }, first.toAST());
  },

  FunctionCall_not(_not, _ws, _lp, _1, expr, _2, _rp) {
    return { "!": expr.toAST() };
  },

  FunctionCall_selected(
    _sel,
    _ws,
    _lp,
    _1,
    field,
    _2,
    _comma,
    _3,
    val,
    _4,
    _rp
  ) {
    return { selected: [field.toAST(), val.toAST()] };
  },

  FunctionCall_if(
    _if,
    _ws,
    _lp,
    _1,
    cond,
    _2,
    _comma1,
    _3,
    thenExpr,
    _4,
    _comma2,
    _5,
    elseExpr,
    _6,
    _rp
  ) {
    return {
      if: [cond.toAST(), thenExpr.toAST(), elseExpr.toAST()],
    };
  },

  FunctionCall_int(_int, _ws, _lp, _1, expr, _2, _rp) {
    return { int: expr.toAST() };
  },

  FunctionCall_decimalDateTime(_fn, _ws, _lp, _1, expr, _2, _rp) {
    return { "decimal-date-time": expr.toAST() };
  },

  FunctionCall_countSelected(_fn, _ws, _lp, _1, expr, _2, _rp) {
    return { "count-selected": expr.toAST() };
  },

  FunctionCall_today(_fn, _ws, _lp, _1, _rp) {
    return { today: [] };
  },

  FunctionCall_now(_fn, _ws, _lp, _1, _rp) {
    return { now: [] };
  },

  FunctionCall_coalesce(_fn, _ws, _lp, _1, exprList, _2, _rp) {
    return { coalesce: exprList.toAST() };
  },

  FunctionCall_substr(
    _fn,
    _ws,
    _lp,
    _1,
    str,
    _2,
    _comma1,
    _3,
    start,
    _4,
    _comma2,
    _5,
    length,
    _6,
    _rp
  ) {
    return { substr: [str.toAST(), start.toAST(), length.toAST()] };
  },

  FunctionCall_stringLength(_fn, _ws, _lp, _1, expr, _2, _rp) {
    return { "string-length": expr.toAST() };
  },

  IfExpr_if(_if, _ws, _lp, cond, _comma1, thenExpr, _comma2, elseExpr, _rp) {
    return {
      if: [cond.toAST(), thenExpr.toAST(), elseExpr.toAST()],
    };
  },

  Field(_d, _o, id, _c) {
    return { var: id.sourceString };
  },

  Value_string(_q, chars, _q2) {
    return chars.sourceString;
  },

  Value_number(num) {
    return parseFloat(num.sourceString);
  },

  ExprList(exprs) {
    return exprs.asIteration().children.map((e) => e.toAST());
  },

  identifier(first, rest) {
    return first.sourceString + rest.sourceString;
  },

  valuechars(chars) {
    return chars.sourceString;
  },
});

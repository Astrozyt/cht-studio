use serde_json::Value;

use crate::{Rule, RuleGroup, RuleNode};

pub fn rqb_group_to_jsonlogic(g: &RuleGroup) -> Value {
    let mut items: Vec<Value> = Vec::new();

    for node in &g.rules {
        match node {
            RuleNode::Group(sub) => items.push(rqb_group_to_jsonlogic(sub)),
            RuleNode::Rule(r) => {
                if let Some(jl) = rqb_rule_to_jsonlogic(r) {
                    items.push(jl);
                }
            }
        }
    }

    // Empty group -> true
    let conj = g.combinator.to_ascii_lowercase();
    let mut expr = match (conj.as_str(), items.len()) {
        ("and", 0) | ("or", 0) => Value::Bool(true),
        ("and", 1) | ("or", 1) => items.remove(0),
        ("and", _) => jsonlogic("and", items),
        ("or", _) => jsonlogic("or", items),
        _ => jsonlogic("and", items), // default
    };

    if g.not.unwrap_or(false) {
        expr = jsonlogic_unary("!", expr);
    }
    expr
}

fn rqb_rule_to_jsonlogic(r: &Rule) -> Option<Value> {
    // left side: {"var":"ctx.<field>" }  (prefix with ctx. if missing)
    let mut left = r.field.clone();
    if !left.starts_with("ctx.") {
        left = format!("ctx.{left}");
    }
    let lvar = jsonlogic_var(left);

    // value: coerce "123" → 123 when purely numeric
    let rv = r.value.clone().unwrap_or(Value::Null);
    let right = coerce_numberish(rv);

    let op = r.operator.as_str();
    let out = match op {
        "=" | "==" => jsonlogic_bin("==", lvar, right),
        "!=" => jsonlogic_bin("!=", lvar, right),
        ">" => jsonlogic_bin(">", lvar, right),
        ">=" => jsonlogic_bin(">=", lvar, right),
        "<" => jsonlogic_bin("<", lvar, right),
        "<=" => jsonlogic_bin("<=", lvar, right),

        "contains" => jsonlogic_bin("in", right, lvar), // JSONLogic: {"in":[needle, haystack]}
        "beginsWith" => jsonlogic_bin("startsWith", lvar, right),
        "endsWith" => jsonlogic_bin("endsWith", lvar, right),

        "in" => {
            // right should be array; if not, wrap
            let arr = match right {
                Value::Array(_) => right,
                x => Value::Array(vec![x]),
            };
            // JSONLogic: {"in":[lvar, ["a","b"]]} means lvar ∈ array
            jsonlogic_bin("in", lvar, arr)
        }
        "notIn" => {
            let base = jsonlogic_bin(
                "in",
                lvar,
                match right {
                    Value::Array(_) => right,
                    x => Value::Array(vec![x]),
                },
            );
            jsonlogic_unary("!", base)
        }

        "is_null" => jsonlogic_bin("==", lvar, Value::Null),
        "is_not_null" => jsonlogic_bin("!=", lvar, Value::Null),
        "is_empty" => jsonlogic_call(
            "==",
            vec![jsonlogic_call("length", vec![lvar]), Value::from(0)],
        ),
        "is_not_empty" => jsonlogic_call(
            ">",
            vec![jsonlogic_call("length", vec![lvar]), Value::from(0)],
        ),

        _ => return None, // unknown op -> drop
    };
    Some(out)
}

/* ---- tiny JSONLogic builders ---- */
fn jsonlogic(op: &str, args: Vec<Value>) -> Value {
    let mut map = serde_json::Map::new();
    map.insert(op.to_string(), Value::Array(args));
    Value::Object(map)
}

fn jsonlogic_bin(op: &str, a: Value, b: Value) -> Value {
    jsonlogic(op, vec![a, b])
}

fn jsonlogic_unary(op: &str, a: Value) -> Value {
    let mut map = serde_json::Map::new();
    map.insert(op.to_string(), a);
    Value::Object(map)
}

fn jsonlogic_var(path: String) -> Value {
    let mut map = serde_json::Map::new();
    map.insert("var".to_string(), Value::String(path));
    Value::Object(map)
}

fn jsonlogic_call(op: &str, args: Vec<Value>) -> Value {
    jsonlogic(op, args)
}

fn coerce_numberish(v: Value) -> Value {
    match v {
        Value::String(s) => {
            if let Ok(n) = s.parse::<i64>() {
                Value::from(n)
            } else if let Ok(f) = s.parse::<f64>() {
                // keep integers as i64 above; fall back to f64
                Value::from(f)
            } else {
                Value::String(s)
            }
        }
        other => other,
    }
}

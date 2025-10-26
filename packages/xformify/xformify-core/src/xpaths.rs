use regex::Regex;
use serde_json::Value;

pub fn sanitize_name(s: &str) -> String {
    let s = s.trim().to_lowercase().replace(' ', "_");
    Regex::new(r"[^\w\-]")
        .unwrap()
        .replace_all(&s, "")
        .into_owned()
}

fn value_to_xpath_literal(v: &Value) -> String {
    match v {
        Value::String(s) => format!("'{}'", s.replace('\'', "''")),
        Value::Number(n) => n.to_string(),
        Value::Bool(b) => if *b { "true()" } else { "false()" }.to_string(),
        Value::Null => "null".to_string(),
        Value::Array(a) => format!(
            "[{}]",
            a.iter()
                .map(value_to_xpath_literal)
                .collect::<Vec<_>>()
                .join(", ")
        ),
        Value::Object(_) => "null".to_string(), // or error out if you don't expect objects
    }
}

pub fn compile_logic_to_xpath(
    path_for: &dyn Fn(&str) -> String,
    logic: &crate::types::Logic,
) -> Option<String> {
    if logic.rules.is_empty() {
        return None;
    }
    let op = if logic.combinator == "or" {
        "or"
    } else {
        "and"
    };
    let mut parts = Vec::new();
    for r in &logic.rules {
        let left = path_for(&r.field);
        let right: String = match r.value.as_ref() {
            Some(v) => value_to_xpath_literal(v),
            None => "null".to_string(),
        };
        let op_map = match r.operator.as_str() {
            "=" => "=",
            "!=" => "!=",
            ">" => ">",
            "<" => "<",
            ">=" => ">=",
            "<=" => "<=",
            "contains" => "contains",
            _ => "=",
        };
        let expr = if op_map == "contains" {
            format!("contains({left}, {right})")
        } else {
            format!("{left} {op_map} {right}")
        };
        parts.push(expr);
    }
    Some(parts.join(&format!(" {op} ")))
}

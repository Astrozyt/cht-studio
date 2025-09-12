use regex::Regex;

pub fn sanitize_name(s: &str) -> String {
    let s = s.trim().to_lowercase().replace(' ', "_");
    Regex::new(r"[^\w\-]")
        .unwrap()
        .replace_all(&s, "")
        .into_owned()
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
        let right = match &r.value {
            serde_json::Value::String(s) => format!("'{}'", s.replace('\'', "''")),
            serde_json::Value::Number(n) => n.to_string(),
            serde_json::Value::Bool(b) => {
                if *b {
                    "true()".into()
                } else {
                    "false()".into()
                }
            }
            _ => "''".into(),
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

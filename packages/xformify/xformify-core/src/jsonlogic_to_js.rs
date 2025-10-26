use serde_json::Value;

/// Convert a JsonLogic node to a JS expression string.
/// The expression assumes a `data` object exists in scope:
///   { contact, reports, ctx, contactSummary: ctx?.contactSummary }
///
/// Additionally, the wrapper (below) injects a `get(root, path)` helper used here.
pub fn jsonlogic_to_js(v: &Value) -> String {
    // literals
    fn lit(v: &Value) -> String {
        match v {
            Value::Null => "null".into(),
            Value::Bool(b) => b.to_string(),
            Value::Number(n) => n.to_string(),
            Value::String(s) => format!("{:?}", s), // JS string literal
            Value::Array(_) | Value::Object(_) => {
                // For arrays/objects used as raw literals
                serde_json::to_string(v).unwrap()
            }
        }
    }
    fn paren(s: String) -> String {
        format!("({})", s)
    }

    // Convert dotted path to get(data, "a.b.c") calls
    fn var_to_js(arg: &Value) -> String {
        match arg {
            // "var": "a.b.c"
            Value::String(p) => {
                if p.is_empty() {
                    "data".into()
                } else {
                    format!("get(data,{:?})", p)
                }
            }
            // "var": ["a.b.c", default]
            Value::Array(arr) if !arr.is_empty() => {
                let path = &arr[0];
                let def = arr.get(1);
                match path {
                    Value::String(p) if p.is_empty() => {
                        if let Some(d) = def {
                            format!("(data ?? {})", lit(d))
                        } else {
                            "data".into()
                        }
                    }
                    Value::String(p) => {
                        if let Some(d) = def {
                            format!("( (tmp => tmp===undefined||tmp===null ? {} : tmp)(get(data,{:?})) )", lit(d), p)
                        } else {
                            format!("get(data,{:?})", p)
                        }
                    }
                    _ => "undefined".into(),
                }
            }
            _ => "data".into(),
        }
    }

    // Main
    match v {
        Value::Object(map) if map.len() == 1 => {
            let (op, args) = map.iter().next().unwrap();
            // Normalize args into Vec<&Value>
            let arr: Vec<&Value> = match args {
                Value::Array(a) => a.iter().collect(),
                _ => vec![args],
            };

            // arity helpers
            let bin = |sym: &str| -> String {
                let a = jsonlogic_to_js(arr.get(0).unwrap_or(&&Value::Null));
                let b = jsonlogic_to_js(arr.get(1).unwrap_or(&&Value::Null));
                format!("({} {} {})", a, sym, b)
            };

            match op.as_str() {
                // logic
                "and" => {
                    let parts: Vec<String> =
                        arr.iter().map(|x| paren(jsonlogic_to_js(x))).collect();
                    parts.join(" && ")
                }
                "or" => {
                    let parts: Vec<String> =
                        arr.iter().map(|x| paren(jsonlogic_to_js(x))).collect();
                    parts.join(" || ")
                }
                "!" => format!(
                    "(!{})",
                    paren(jsonlogic_to_js(arr.get(0).unwrap_or(&&Value::Null)))
                ),
                "!!" => format!(
                    "(!!{})",
                    paren(jsonlogic_to_js(arr.get(0).unwrap_or(&&Value::Null)))
                ),

                // comparisons
                "==" => bin("==="),
                "!=" => bin("!=="),
                ">" => bin(">"),
                ">=" => bin(">="),
                "<" => bin("<"),
                "<=" => bin("<="),

                // arithmetic
                "+" => {
                    let parts: Vec<String> =
                        arr.iter().map(|x| paren(jsonlogic_to_js(x))).collect();
                    parts.join(" + ")
                }
                "-" => bin("-"),
                "*" => bin("*"),
                "/" => bin("/"),
                "%" => bin("%"),

                // membership / contains
                // JsonLogic "in": ["needle", "haystack"]
                "in" => {
                    let needle = jsonlogic_to_js(arr.get(0).unwrap_or(&&Value::Null));
                    let hay = arr.get(1).cloned().unwrap_or(&Value::Null);
                    match hay {
                        Value::String(_) => {
                            format!("(String({})).includes({})", jsonlogic_to_js(hay), needle)
                        }
                        Value::Array(_) => {
                            format!("({}).includes({})", jsonlogic_to_js(hay), needle)
                        }
                        _ => format!("false"),
                    }
                }

                // ternary if: {"if":[cond, then, else]} or chain {"if":[c1,t1,c2,t2, ..., else]}
                "if" => {
                    if arr.is_empty() {
                        return "undefined".into();
                    }
                    let mut js = String::new();
                    let mut i = 0usize;
                    while i + 2 < arr.len() {
                        let c = jsonlogic_to_js(arr[i]);
                        let t = jsonlogic_to_js(arr[i + 1]);
                        js.push_str(&format!("({}) ? ({}) : (", c, t));
                        i += 2;
                    }
                    let last = if i < arr.len() {
                        jsonlogic_to_js(arr[i])
                    } else {
                        "undefined".into()
                    };
                    js.push_str(&last);
                    for _ in 0..(arr.len() / 2) {
                        js.push(')');
                    }
                    js
                }

                // min/max
                "min" => {
                    let parts: Vec<String> = arr.iter().map(|x| jsonlogic_to_js(x)).collect();
                    format!("Math.min({})", parts.join(", "))
                }
                "max" => {
                    let parts: Vec<String> = arr.iter().map(|x| jsonlogic_to_js(x)).collect();
                    format!("Math.max({})", parts.join(", "))
                }

                // strings
                "cat" => {
                    let parts: Vec<String> =
                        arr.iter().map(|x| paren(jsonlogic_to_js(x))).collect();
                    parts.join(" + ")
                }
                "substr" => {
                    // ["str", start, len?]
                    let s = jsonlogic_to_js(arr.get(0).unwrap_or(&&Value::Null));
                    let start = jsonlogic_to_js(arr.get(1).unwrap_or(&&Value::Null));
                    if let Some(lenv) = arr.get(2) {
                        let len = jsonlogic_to_js(lenv);
                        format!("(String({})).substr({}, {})", s, start, len)
                    } else {
                        format!("(String({})).substr({})", s, start)
                    }
                }

                // variables
                "var" => var_to_js(args),

                // fallback
                _ => {
                    // Unknown op -> return undefined to stay safe
                    "undefined".into()
                }
            }
        }

        // Non-op nodes (literals / arrays / objects)
        Value::Array(a) => {
            // In expressions, arrays appear as literals or op args; keep as JSON literal
            serde_json::to_string(a).unwrap()
        }
        Value::Object(_) => serde_json::to_string(v).unwrap(),
        _ => lit(v),
    }
}

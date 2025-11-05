use serde_json::{self as sj, Value};
use std::path::PathBuf;

use crate::{jsonlogic_taskexporter::rqb_group_to_jsonlogic, AppliesIf, Task};
use regex::{Captures, Regex};

type TaskJsonInput = Vec<Task>;

/// Render the array of tasks as a JS module where `appliesIf` is a function.
/// Expects tasks where `applies_if` has already been normalized to:
///   - None  => omit field
///   - Some(AppliesIf::EmptyString(expr)) => JS expression string
///   - Some(AppliesIf::Group(_)) => should have been converted earlier
fn write_tasks_js(tasks: &[Task]) -> Result<String, String> {
    let mut out = String::new();
    out.push_str("module.exports = [\n");

    for (i, t) in tasks.iter().enumerate() {
        // Serialize to Value so we can drop/override `appliesIf`
        let mut v = sj::to_value(t).map_err(|e| e.to_string())?;

        // Pull out appliesIf (if present) and remove it from the value map
        let applies_if_expr: Option<String> = match t.applies_if.as_ref() {
            Some(AppliesIf::EmptyString(expr)) if !expr.trim().is_empty() => {
                Some(expr.trim().to_string())
            }
            // Group should have been converted earlier; if any slipped through, drop it
            _ => None,
        };

        if let Value::Object(map) = &mut v {
            map.remove("appliesIf"); // we’ll print it manually as a function
        }

        prune_keys(&mut v, &["priority"]);

        // Pretty-print the rest of the object (without appliesIf)
        let mut body = sj::to_string_pretty(&v).map_err(|e| e.to_string())?;

        // Drop the surrounding braces so we can inject the function cleanly
        // body is like "{\n  ...\n}"
        if let Some(stripped) = body.strip_prefix("{").and_then(|s| s.strip_suffix("}")) {
            body = stripped.trim_matches('\n').to_string();
        }

        // Write object
        out.push_str("  {\n");

        // If we have appliesIf, print it first (nice to have at the top),
        // then a trailing comma if there are other fields.
        if let Some(expr) = applies_if_expr {
            out.push_str("    appliesIf: function (contact, reports, ctx) {\n");
            out.push_str("      return ");
            out.push_str(&expr);
            out.push_str(";\n");
            out.push_str("    }");
            if !body.trim().is_empty() {
                out.push_str(",\n");
            } else {
                out.push('\n');
            }
        }

        // Print the remaining JSON fields with proper indentation
        if !body.trim().is_empty() {
            // re-indent body by 2 spaces
            for line in body.lines() {
                out.push_str("    ");
                out.push_str(line);
                out.push('\n');
            }
        }

        out.push_str("  }");
        if i + 1 < tasks.len() {
            out.push_str(",\n");
        } else {
            out.push('\n');
        }
    }

    out.push_str("];\n");
    Ok(out)
}

fn prune_keys(v: &mut serde_json::Value, keys: &[&str]) {
    use serde_json::Value;
    match v {
        Value::Object(map) => {
            for val in map.values_mut() {
                prune_keys(val, keys);
            }
            for k in keys {
                map.remove(*k);
            }
        }
        Value::Array(arr) => {
            for x in arr {
                prune_keys(x, keys);
            }
        }
        _ => {}
    }
}

fn convert_get_to_ctx(js_expr: &str) -> String {
    // Matches: get(data,"<path>")
    // Example capture: ctx.contactSummary.last_bp_diastolic
    static GET_RE: once_cell::sync::Lazy<Regex> =
        once_cell::sync::Lazy::new(|| Regex::new(r#"get\(data,\s*"([^"]+)"\)"#).unwrap());

    // Replace all occurrences
    let replaced = GET_RE.replace_all(js_expr, |caps: &Captures| {
        let mut path = caps[1].to_string(); // e.g. "ctx.a.b"
        if let Some(rest) = path.strip_prefix("ctx.") {
            // drop leading "ctx."
            path = rest.to_string();
        } else if path == "ctx" {
            path.clear();
        }
        if path.is_empty() {
            "ctx".to_string()
        } else {
            format!("ctx?.{}", path.replace('.', "?."))
        }
    });

    replaced.into_owned()
}

pub fn xtaskify(configuration_path: PathBuf, export_path: PathBuf) -> Result<String, String> {
    // 1) Read
    let raw = std::fs::read_to_string(&configuration_path)
        .map_err(|e| format!("Failed to read {}: {}", configuration_path.display(), e))?;

    // 2) Parse array of tasks
    let mut tasks: TaskJsonInput = serde_json::from_str(&raw)
        .map_err(|e| format!("Failed to parse {}: {}", configuration_path.display(), e))?;

    // 3) Transform each task
    for t in &mut tasks {
        // 3a) Normalize appliesToType for contacts
        if t.applies_to.eq_ignore_ascii_case("contacts") {
            t.applies_to_type
                .iter_mut()
                .for_each(|s| *s = s.to_lowercase());
        }

        // 3b) Compile appliesIf
        t.applies_if = match t.applies_if.take() {
            None => None,
            Some(AppliesIf::EmptyString(s)) => {
                let trimmed = s.trim();
                if trimmed.is_empty() {
                    None
                } else if looks_like_json(trimmed) {
                    // JSONLogic in a string -> to JS expr
                    let val: Value = serde_json::from_str(trimmed).map_err(|e| e.to_string())?;
                    let js = crate::jsonlogic_to_js::jsonlogic_to_js(&val);
                    let js = convert_get_to_ctx(&js);
                    Some(AppliesIf::EmptyString(js))
                } else {
                    // Assume already a JS expr
                    Some(AppliesIf::EmptyString(trimmed.to_string()))
                }
            }
            Some(AppliesIf::Group(group)) => {
                // Convert RQB → JSONLogic → JS string
                let jl = rqb_group_to_jsonlogic(&group);
                let js = crate::jsonlogic_to_js::jsonlogic_to_js(&jl);
                let js = convert_get_to_ctx(&js); // <<< post-process here
                Some(AppliesIf::EmptyString(js))
            }
        };

        // 3c) Optional: coerce purely numeric values in rules to numbers
        // (Handled inside rqb_group_to_jsonlogic())
    }

    // 4) Convert to Value, drop nulls/empties
    let mut val = sj::to_value(&tasks).map_err(|e| format!("Serialize to Value failed: {e}"))?;
    drop_nulls_and_empty(&mut val);
    prune_keys(&mut val, &["priority"]);

    // Rehydrate into strongly-typed tasks so `write_tasks_js` can work unchanged
    let tasks_clean: TaskJsonInput = serde_json::from_value(val)
        .map_err(|e| format!("Failed to rehydrate cleaned tasks: {e}"))?;

    // 5) Produce JS module
    // 4) Build JS module source with appliesIf as a real function
    let js = write_tasks_js(&tasks_clean)?;
    //replace all " by ' in js
    let js = js.replace("\"", "'");
    let js = js.replace("'modifyContent': null,", "");
    // 5) Write to file
    let out = export_path.join("tasks.js");

    std::fs::write(&out, js).map_err(|e| format!("Failed to write {}: {}", out.display(), e))?;
    Ok(out.display().to_string())
}

/* ---------- helpers ---------- */

fn looks_like_json(s: &str) -> bool {
    let s = s.trim();
    (s.starts_with('{') && s.ends_with('}')) || (s.starts_with('[') && s.ends_with(']'))
}

/// Recursively remove nulls and empty strings; drop optional fields that ended up ""
fn drop_nulls_and_empty(v: &mut serde_json::Value) {
    use serde_json::Value;

    match v {
        Value::Object(map) => {
            // Recurse into values first
            for val in map.values_mut() {
                drop_nulls_and_empty(val);
            }
            // Then remove unwanted entries
            map.retain(|_, val| match val {
                Value::Null => false,
                Value::String(s) => !s.trim().is_empty(),
                Value::Array(a) => !a.is_empty(),
                _ => true,
            });
        }
        Value::Array(arr) => {
            // Reborrow to avoid moving `arr`
            for x in arr.iter_mut() {
                drop_nulls_and_empty(x);
            }
            arr.retain(|x| !x.is_null());
        }
        _ => {}
    }
}

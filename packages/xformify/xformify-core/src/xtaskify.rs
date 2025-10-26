use serde_json::{self as sj, Value};
use std::path::PathBuf;

use crate::{jsonlogic_taskexporter::rqb_group_to_jsonlogic, AppliesIf, Task};

type TaskJsonInput = Vec<Task>;

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
                    // Treat as JSONLogic
                    match serde_json::from_str::<Value>(trimmed) {
                        Ok(jsonlogic) => {
                            let js = crate::jsonlogic_to_js::jsonlogic_to_js(&jsonlogic);
                            Some(AppliesIf::EmptyString(js))
                        }
                        Err(e) => {
                            eprintln!(
                                "Warning: appliesIf looks like JSON but failed to parse: {e}"
                            );
                            Some(AppliesIf::EmptyString(trimmed.to_string()))
                        }
                    }
                } else {
                    // Already a JS expression string
                    Some(AppliesIf::EmptyString(trimmed.to_string()))
                }
            }
            Some(AppliesIf::Group(group)) => {
                // Convert RQB → JSONLogic → JS string
                let jl = rqb_group_to_jsonlogic(&group);
                let js = crate::jsonlogic_to_js::jsonlogic_to_js(&jl);
                Some(AppliesIf::EmptyString(js))
            }
        };

        // 3c) Optional: coerce purely numeric values in rules to numbers
        // (Handled inside rqb_group_to_jsonlogic())
    }

    // 4) Convert to Value, drop nulls/empties
    let mut val = sj::to_value(&tasks).map_err(|e| format!("Serialize to Value failed: {e}"))?;
    drop_nulls_and_empty(&mut val);

    // 5) Produce JS module
    let json = sj::to_string_pretty(&val).map_err(|e| e.to_string())?;
    let js = format!("module.exports = {};\n", json);

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

use crate::Task;
use std::path::PathBuf; // your struct with applies_if: Option<AppliesIf>

type TaskJsonInput = Vec<Task>;

pub fn xtaskify(configuration_path: PathBuf, export_path: PathBuf) -> Result<String, String> {
    println!("Entering xtaskify");

    // 1. Read the JSON file
    let raw_json_content = std::fs::read_to_string(&configuration_path)
        .map_err(|e| format!("Failed to read {}: {}", configuration_path.display(), e))?;
    println!("File read successfully");

    // 2. Parse array of tasks
    let json_input: TaskJsonInput = serde_json::from_str(&raw_json_content)
        .map_err(|e| format!("Failed to parse {}: {}", configuration_path.display(), e))?;
    println!("Parsed into Vec<Task> ({} tasks)", json_input.len());

    // 3. Transform each task’s applies_if if present
    let output_json_input: TaskJsonInput = json_input
        .into_iter()
        .map(|mut task| {
            if let Some(applies_if) = &task.applies_if {
                // Only transform non-empty / non-null applies_if
                match applies_if {
                    crate::AppliesIf::EmptyString(s) if s.trim().is_empty() => {
                        // leave it empty
                    }
                    crate::AppliesIf::EmptyString(s) => {
                        // parse stringified JSON logic (if you still have such cases)
                        match serde_json::from_str::<serde_json::Value>(s) {
                            Ok(val) => {
                                let js_condition = crate::jsonlogic_to_js::jsonlogic_to_js(&val);
                                task.applies_if = Some(crate::AppliesIf::EmptyString(js_condition));
                            }
                            Err(e) => {
                                eprintln!("Warning: failed to parse appliesIf string: {e}");
                            }
                        }
                    }
                    crate::AppliesIf::Group(group) => {
                        // already structured tree → convert to JS
                        let val = serde_json::to_value(group).unwrap_or_default();
                        let js_condition = crate::jsonlogic_to_js::jsonlogic_to_js(&val);
                        task.applies_if = Some(crate::AppliesIf::EmptyString(js_condition));
                    }
                }
            }
            task
        })
        .collect();

    // 4. Serialize to JSON
    let output_js = serde_json::to_string_pretty(&output_json_input)
        .map_err(|e| format!("Failed to serialize output JSON: {}", e))?;

    // 5. Write to file
    let out_path = export_path.join("tasks.js");
    std::fs::write(&out_path, &output_js)
        .map_err(|e| format!("Failed to write file {}: {}", out_path.display(), e))?;

    println!("Exported tasks to {}", out_path.display());
    Ok("".into())
}

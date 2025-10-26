use std::path::PathBuf;

use crate::Task;

type TaskJsonInput = Vec<Task>;

pub fn xtaskify(configuration_path: PathBuf, export_path: PathBuf) -> Result<String, String> {
    println!("Entering xtaskify");
    let raw_json_content = std::fs::read_to_string(&configuration_path)
        .map_err(|e| format!("Failed to read {}: {}", configuration_path.display(), e))?;
    println!("Post reading file");
    // let json_input: TaskJsonInput = serde_json::from_str(&raw_json_content)
    //     .map_err(|e| format!("Failed to parse {}: {}", configuration_path.display(), e))?;
    let json_input: TaskJsonInput = serde_json::from_str(&raw_json_content)
        .map_err(|e| format!("Failed to parse {}: {}", configuration_path.display(), e))?;
    print!("turned to JSON");
    // let json = serde_json::to_string(form).map_err(|e| e.to_string())?;
    // let xform = json_to_xform(&json).map_err(|e| e.to_string())?;
    let raw_applies_if = serde_json::from_str(json_input.applies_if.as_str())
        .map_err(|e| format!("Failed to parse applies_if JSON: {}", e))?;
    let js_condition = crate::jsonlogic_to_js::jsonlogic_to_js(&raw_applies_if);

    //create new TaskJSONInput, with all the same values but appliesIf is js_condition
    let output_json_input = TaskJsonInput {
        applies_if: js_condition,
        ..json_input
    };

    let output_js = serde_json::to_string_pretty(&output_json_input)
        .map_err(|e| format!("Failed to serialize output JSON: {}", e))?;

    // output_json_input.applies_if = js_condition;
    let output_js = serde_json::to_string_pretty(&output_js)
        .map_err(|e| format!("Failed to serialize output JSON: {}", e))?;

    // json_input.applies_if = js_condition;
    // let output_js = serde_json::to_string_pretty(&json_input)
    //     .map_err(|e| format!("Failed to serialize output JSON: {}", e))?;

    std::fs::write(&export_path.join("tasks").with_extension("js"), &output_js).map_err(|e| {
        format!(
            "Failed to write properties file {}: {}",
            export_path.display(),
            e
        )
    })?;

    Ok("".to_string())
}

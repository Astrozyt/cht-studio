/* XPropertify
In: ...
Out ex.: {
  "title": { "en": "Blood Pressure Follow-Up" },
  "context": { "person": true },
  "icon": "icon-healthcare-assessment"
}
*/
// use crate::Form;
// use std::fs;
// use std::path::Path;

use std::path::PathBuf;

// use anyhow::Ok;

use crate::{json_to_xform, Form};

// use std::result::Result::Ok;

pub fn x_all_forms(source_dir: PathBuf, export_dir: PathBuf) -> Result<String, String> {
    std::fs::create_dir_all(&export_dir).map_err(|e| {
        format!(
            "Failed to create export dir {}: {}",
            export_dir.display(),
            e
        )
    })?;

    let entries = std::fs::read_dir(&source_dir)
        .map_err(|e| format!("Failed to read {}: {}", source_dir.display(), e))?;

    for entry in entries.flatten() {
        let path = entry.path();
        if !path.is_file() {
            continue;
        }
        if !path.extension().map_or(false, |ext| ext == "json") {
            continue;
        }

        let json = match std::fs::read_to_string(&path) {
            Ok(s) => s,
            Err(e) => {
                eprintln!("Failed to read {}: {}", path.display(), e);
                continue;
            }
        };

        let form: Form = match serde_json::from_str(&json) {
            Ok(f) => f,
            Err(e) => {
                eprintln!("Failed to parse {}: {}", path.display(), e);
                continue;
            }
        };

        let props = serde_json::json!({
            "title": { "en": form.title.to_lowercase() },
            "icon": "icon-calendar",
            "context": {"person": true},  // e.g. { "person": true }
        });

        let xml_id = form.title.replace(' ', "_").to_lowercase();
        let xform_xml = match json_to_xform(&xml_id, &form) {
            Ok(x) => x,
            Err(e) => {
                eprintln!("json_to_xform failed for {}: {}", path.display(), e);
                continue;
            }
        };
        std::fs::write(&export_dir.join(&xml_id).with_extension("xml"), &xform_xml)
            .map_err(|e| format!("Failed to write XForm file {}: {}", export_dir.display(), e))?;

        std::fs::write(
            &export_dir.join(xml_id).with_extension("properties.json"),
            &props.to_string(),
        )
        .map_err(|e| {
            format!(
                "Failed to write properties file {}: {}",
                export_dir.display(),
                e
            )
        })?;
    }
    Ok("".to_string())
}

// pub fn xpropertify(
//     app: &dyn crate::AppContext,
//     form_id: &str,
//     form_title: &str,
// ) -> Result<String, String> {
//     //Read content of source path file to string
//     let data = std::fs::read_to_string(&source_path).map_err(|e| {
//         format!(
//             "Failed to read file {}: {}",
//             source_path.as_ref().display(),
//             e
//         )
//     })?;
//     println!(
//         "XPropertify: read data from {}",
//         source_path.as_ref().display()
//     );
//     let form: Form =
//         serde_json::from_str(&data).map_err(|e| format!("Failed to parse JSON: {}", e))?;
//     let base_dir = app.path().app_local_data_dir().map_err(|e| e.to_string())?;

//     let export_dir = base_dir.join();

//     let props = serde_json::json!({
//         "title": { "en": form_title },
//         "icon": "icon-calendar",
//         "context": {"person": true},  // e.g. { "person": true }
//     });
//     // let path = format!("{export_dir}/{form_id}.properties.json");
//     let out_path = export_dir
//         .as_ref()
//         .join(format!("{form_id}.properties.json"));
//     std::fs::write(
//         out_path,
//         serde_json::to_string_pretty(&props).map_err(|e| e.to_string())?,
//     )
//     .map_err(|e| e.to_string())?;
//     Ok("XPropertify conversion successful".to_string())
// }

use tauri::Manager;
use xformify_core::json_to_xform;
use xformify_core::x_all_forms;
use xformify_core::xtaskify;
use xformify_core::Form;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// Open the folder and return the file paths
#[tauri::command]
fn open_folder(path: &str) -> Vec<String> {
    let mut paths = Vec::new();
    if let Ok(entries) = std::fs::read_dir(path) {
        for entry in entries.flatten() {
            if let Ok(metadata) = entry.metadata() {
                if metadata.is_dir() {
                    if let Ok(folder_path) = entry.path().into_os_string().into_string() {
                        paths.push(folder_path);
                    }
                }
            }
        }
    } else {
        if let Err(e) = std::fs::create_dir_all(path) {
            eprintln!("Failed to create directory: {}", e);
        }
    }
    paths
}

// List xml files in the given path
#[tauri::command]
fn list_xml_files(path: &str) -> Vec<String> {
    let mut xml_files = Vec::new();
    if let Ok(entries) = std::fs::read_dir(path) {
        for entry in entries.flatten() {
            if let Ok(metadata) = entry.metadata() {
                if metadata.is_file()
                    && entry
                        .path()
                        .extension()
                        .map_or(false, |ext| ext == "xml" || ext == "json")
                {
                    if let Ok(file_path) = entry.path().into_os_string().into_string() {
                        xml_files.push(file_path);
                    }
                }
            }
        }
    }
    print!("xml_files: {:?}", xml_files);
    xml_files
}

#[tauri::command]
fn create_folder(name: &str) -> Result<(), String> {
    if let Err(e) = std::fs::create_dir_all(format!("./projects/{}", name)) {
        return Err(format!("Failed to create directory: {}", e));
    }

    Ok(())
}

#[tauri::command]
fn save_json_form(path: &str, content: &str) -> Result<(), String> {
    if let Err(e) = std::fs::write(path, content) {
        return Err(format!("Failed to save file: {}", e));
    }
    Ok(())
}

#[tauri::command]
fn xformify(app: tauri::AppHandle, rel_path: &str) -> Result<String, String> {
    // Resolve BaseDirectory::AppLocalData and join with the provided relative path
    let base_dir = app.path().app_local_data_dir().map_err(|e| e.to_string())?;

    let path = {
        let p = std::path::Path::new(rel_path);
        if p.is_absolute() {
            p.to_path_buf()
        } else {
            base_dir.join(p)
        }
    };

    let data = std::fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file {}: {}", path.display(), e))?;

    let form: xformify_core::Form =
        serde_json::from_str(&data).map_err(|e| format!("Failed to parse JSON: {}", e))?;
    let xml_id = form.title.replace(' ', "_").to_lowercase();
    let xform =
        json_to_xform(&xml_id, &form).map_err(|e| format!("Failed to convert to XForm: {}", e))?;
    // Save the generated XForm XML to a file
    let xform_path = path.with_extension("xml");
    std::fs::write(&xform_path, &xform)
        .map_err(|e| format!("Failed to write XForm file {}: {}", xform_path.display(), e))?;
    Ok(xform)
}

#[tauri::command]
fn xformify2(app: tauri::AppHandle, rel_path: &str) -> Result<String, String> {
    // Resolve BaseDirectory::AppLocalData and join with the provided relative path
    let base_dir = app.path().app_local_data_dir().map_err(|e| e.to_string())?;
    let app_forms_dir = base_dir.join(rel_path).join("forms/app");
    let contact_forms_dir = base_dir.join(rel_path).join("forms/contact");

    print!("   ||  app_forms_dir: {}", app_forms_dir.display());
    print!("   ||  contact_forms_dir: {}", contact_forms_dir.display());

    let app_export_dir = base_dir.join(rel_path).join("export/forms/app");
    let contact_export_dir = base_dir.join(rel_path).join("export/forms/contact");

    // Create app forms for export
    let _appformresult = match x_all_forms(app_forms_dir, app_export_dir) {
        Ok(result) => result,
        Err(e) => {
            eprintln!("Error processing app forms: {}", e);
            return Err(e);
        }
    };
    // Create contact forms for export
    let _contactformresult = match x_all_forms(contact_forms_dir, contact_export_dir) {
        Ok(result) => result,
        Err(e) => {
            eprintln!("Error processing contact forms: {}", e);
            return Err(e);
        }
    };
    // Generate task.js
    let _ = match xtaskify(
        base_dir.join(rel_path).join("configuration/tasks.json"),
        base_dir.join(rel_path).join("export"),
    ) {
        Ok(result) => result,
        Err(e) => {
            eprintln!("Error processing tasks: {}", e);
            return Err(e);
        }
    };
    // Generate contact-summary.templated.js
    // Generate app_settings.json
    // Copy assets
    // export
    // outside: run/upload with CLI

    Ok("XFormify2 conversion successful".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_sql::Builder::new().build())
        // .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![
            open_folder,
            create_folder,
            greet,
            list_xml_files,
            save_json_form,
            xformify,
            xformify2,
        ])
        // .invoke_handler(tauri::generate_handler![list_xml_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

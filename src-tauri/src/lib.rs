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
fn convert_to_xform(json: String) -> Result<String, String> {
    let parsed: serde_json::Value =
        serde_json::from_str(&json).map_err(|e| format!("JSON parse error: {}", e))?;

    // let xml =
    //     xform_to_xml::generate_xform(parsed).map_err(|e| format!("Conversion error: {}", e))?;

    // Dummy response for now
    let xml = "<h:html>Logic builder in progress</h:html>".to_string();
    Ok(xml)
}

// #[tauri::command]
// fn create_json_file(path: &str, content: &str) -> Result<(), String> {
//     use std::fs;
//     use std::path::PathBuf;
//     // use tauri::api::path::app_data_dir;

//     let base_dir =
//         app_data_dir(&tauri::Config::default()).ok_or("Failed to get app data directory")?;
//     let mut file_path = PathBuf::from(base_dir);
//     file_path.push("forms");
//     file_path.push(path);

//     if let Some(parent) = file_path.parent() {
//         fs::create_dir_all(parent).map_err(|e| format!("Failed to create directories: {}", e))?;
//     }

//     fs::write(&file_path, content).map_err(|e| format!("Failed to create file: {}", e))?;
//     // let path_obj = std::path::Path::new(path);
//     // if let Some(parent) = path_obj.parent() {
//     //     if !parent.exists() {
//     //         if let Err(e) = std::fs::create_dir_all(parent) {
//     //             return Err(format!("Failed to create directories: {}", e));
//     //         }
//     //     }
//     // } else {
//     //     return Err("Invalid path: no parent directory found".to_string());
//     // }

//     // if let Err(e) = std::fs::write(path_obj, content) {
//     //     return Err(format!("Failed to create file: {}", e));
//     // }
//     Ok(())
// }

#[tauri::command]
fn save_json_form(path: &str, content: &str) -> Result<(), String> {
    if let Err(e) = std::fs::write(path, content) {
        return Err(format!("Failed to save file: {}", e));
    }
    Ok(())
}

//Function to save xml file
// #[tauri::command]
// fn save_xml_file(path: &str, content: &str) -> Result<(), String> {
//     let mut file = std::fs::File::create(path).map_err(|e| e.to_string())?;
//     // file.write_all(content.as_bytes()).map_err(|e| e.to_string())?;
//     Ok(())
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        // .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![
            open_folder,
            create_folder,
            greet,
            list_xml_files,
            // create_json_file,
            save_json_form,
        ])
        // .invoke_handler(tauri::generate_handler![list_xml_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

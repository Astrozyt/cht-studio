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
                if metadata.is_file() && entry.path().extension().map_or(false, |ext| ext == "xml")
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
        // .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![
            open_folder,
            create_folder,
            greet,
            list_xml_files
        ])
        // .invoke_handler(tauri::generate_handler![list_xml_files])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

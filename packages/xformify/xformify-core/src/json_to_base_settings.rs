use serde::Serialize;
use std::{
    collections::HashMap,
    path::{Path, PathBuf},
};

use crate::{AppSettings, ContactType};

#[derive(Debug)]
struct Language {
    id: i32,
    short: String,
    name: String,
    is_default: bool,
}

struct Languages {
    languages: Vec<Language>,
}

//Load languages from sqlite db
fn read_locales_from_db(db_path: &Path) -> Result<(Vec<String>, Option<String>), String> {
    use rusqlite::{params, Connection};

    let conn = Connection::open(db_path.join("languages.sqlite"))
        .map_err(|e| format!("Failed to open DB {}: {}", db_path.display(), e))?;

    // Adjust table/columns to your schema
    let mut stmt = conn
        .prepare("SELECT * FROM languages ORDER BY short")
        .map_err(|e| format!("Prepare failed: {}", e))?;

    let rows = stmt
        .query_map(params![], |row| {
            Ok(Language {
                id: row.get::<_, i32>(0)?,
                short: row.get::<_, String>(1)?,
                name: row.get::<_, String>(2)?,
                is_default: row.get::<_, bool>(3)?,
            })
        })
        .map_err(|e| format!("Query failed: {}", e))?;

    let mut out = Vec::new();
    for r in rows {
        out.push(r.map_err(|e| e.to_string())?);
    }
    //Get entry where is_default is true
    let default_locale = out.iter().find(|l| l.is_default).map(|l| l.short.clone());
    let locales = out.into_iter().map(|l| l.short).collect::<Vec<_>>();
    Ok((locales, default_locale))
}

pub fn json_to_base_settings(
    appfolder_path: PathBuf,
    export_path: PathBuf,
) -> Result<String, String> {
    let mut settings = AppSettings::new();

    settings.locale = Some("en".to_string());
    settings.contact_types = vec![
        ContactType {
            id: "patient".to_string(),
            name_key: Some("Patient".to_string()),
            create_person: Some(true),
        },
        ContactType {
            id: "provider".to_string(),
            name_key: Some("Provider".to_string()),
            create_person: Some(false),
        },
    ];
    settings.permissions.insert(
        "admin".to_string(),
        vec![
            "create_contact".to_string(),
            "delete_contact".to_string(),
            "view_reports".to_string(),
        ],
    );
    settings.roles.insert(
        "admin".to_string(),
        crate::Role {
            name: "Administrator".to_string(),
            permissions: vec![
                "create_contact".to_string(),
                "delete_contact".to_string(),
                "view_reports".to_string(),
            ],
        },
    );

    let (locales, default_locale) =
        read_locales_from_db(&appfolder_path).map_err(|e| e.to_string())?;
    settings.locales = locales;
    settings.locale = default_locale;

    // Serialize to JSON
    let json = serde_json::to_string_pretty(&settings).map_err(|e| e.to_string())?;
    // Here you would write `json` to a file in `export_path`
    let _ = std::fs::create_dir_all(&export_path)
        .map_err(|e| format!("Failed to create export directory: {}", e))?;
    std::fs::write(export_path.join("base_settings.json"), &json)
        .map_err(|e| format!("Failed to write file: {}", e))?;
    println!("Generated base_settings.json:\n{}", json);
    Ok("Not implemented yet".into())
}

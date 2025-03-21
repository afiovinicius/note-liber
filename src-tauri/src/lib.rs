#[cfg_attr(mobile, tauri::mobile_entry_point)]
use serde_json::Value;
use std::env;
use std::fs;
use std::io::Write;
use std::path::Path;
use tauri::{AppHandle, Emitter};

const NOTE_VAULT: &str = "note-liber-vault";

#[tauri::command]
fn list_notes() -> Vec<String> {
    let home_dir = env::var("HOME").unwrap_or_else(|_| String::from("$HOME"));
    let documents_path = format!("{}/Documents/{}/", home_dir, NOTE_VAULT);

    let mut notes = Vec::new();
    if let Ok(entries) = fs::read_dir(documents_path) {
        for entry in entries.filter_map(Result::ok) {
            let path = entry.path();
            if path.is_file() && path.extension() == Some(std::ffi::OsStr::new("json")) {
                if let Some(filename) = path.file_name() {
                    if let Some(name) = filename.to_str() {
                        notes.push(name.to_string());
                    }
                }
            }
        }
    }

    notes.sort();
    notes.reverse();
    notes
}

#[tauri::command]
fn add_note(app: AppHandle, name: String) -> Result<Vec<String>, String> {
    let home_dir = env::var("HOME").unwrap_or_else(|_| String::from("$HOME"));
    let documents_path = format!("{}/Documents/{}/", home_dir, NOTE_VAULT);

    if !Path::new(&documents_path).exists() {
        fs::create_dir_all(&documents_path).map_err(|e| e.to_string())?;
    }

    let existing_notes = list_notes();
    if existing_notes.len() >= 15 {
        return Err(format!(
            "Limite de 15 notas atingido. Não é possível adicionar mais. ({}/15)",
            existing_notes.len()
        ));
    }

    let note_path = format!("{}/{}.json", documents_path, name);
    let content = format!(
        r#"{{"type": "doc", "content": [{{"type": "heading", "attrs": {{ "level": 1 }}, "content": [{{"type": "text", "text": "{}"}}]}}]}}"#,
        name
    );

    let mut file = fs::File::create(&note_path)
        .map_err(|e| e.to_string())
        .unwrap();
    file.write_all(content.as_bytes())
        .map_err(|e| e.to_string())
        .unwrap();

    let updated_notes = list_notes();

    app.emit("note_added", &updated_notes).unwrap();
    Ok(updated_notes)
}

#[tauri::command]
fn remove_note(app: AppHandle, name: String) -> Result<Vec<String>, String> {
    let home_dir = env::var("HOME").unwrap_or_else(|_| String::from("$HOME"));
    let documents_path = format!("{}/Documents/{}/", home_dir, NOTE_VAULT);

    let note_path = format!("{}/{}", documents_path, name);

    if Path::new(&note_path).exists() {
        fs::remove_file(&note_path).map_err(|e| format!("Erro ao remover o arquivo: {}", e))?;
        let updated_notes = list_notes();
        app.emit("note_removed", &updated_notes).unwrap();
        Ok(updated_notes)
    } else {
        Err(format!("A nota '{}' não foi encontrada.", name))
    }
}

#[tauri::command]
fn get_content_note(file_name: String) -> Value {
    let home_dir = env::var("HOME").unwrap_or_else(|_| String::from("$HOME"));
    let documents_path = format!("{}/Documents/{}", home_dir, NOTE_VAULT);
    let note_read = format!("{}/{}", documents_path, file_name);

    let content = fs::read_to_string(note_read)
        .unwrap_or_else(|_| r#"{"type": "doc", "content": []}"#.to_string());

    serde_json::from_str(&content).unwrap_or(Value::Object(Default::default()))
}

#[tauri::command]
fn update_content_note(app: AppHandle, file_name: String, new_content: Value) {
    let home_dir = env::var("HOME").unwrap_or_else(|_| String::from("$HOME"));
    let documents_path = format!("{}/Documents/{}/", home_dir, NOTE_VAULT);
    let note_update = format!("{}/{}", documents_path, file_name);

    let json_string = serde_json::to_string_pretty(&new_content).expect("Erro ao serializar JSON");

    fs::write(&note_update, json_string).expect("Erro ao atualizar o arquivo");

    app.emit("note_updated", new_content).unwrap();
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            add_note,
            list_notes,
            remove_note,
            get_content_note,
            update_content_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

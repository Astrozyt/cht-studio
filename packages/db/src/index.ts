import Database from "@tauri-apps/plugin-sql";
import { appLocalDataDir, join } from "@tauri-apps/api/path";
import { exists, mkdir } from "@tauri-apps/plugin-fs";

export { addContactSummaryRule, getContactSummaryDb, getContactSummaryRules, removeContactSummaryRule, updateContactSummaryRule } from "./contact-summary";

async function openLanguageDb(projectId: string) {
    const base = await appLocalDataDir();
    const projectDir = await join(base, "projects", projectId);
    if (!(await exists(projectDir))) {
        await mkdir(projectDir, { recursive: true });
    }
    const dbPath = await join(projectDir, "languages.sqlite");
    const db = await Database.load(`sqlite:${dbPath}`);
    await initLanguageDb(db);
    return db;
}

let languageDb: Database | null = null;

export async function getLanguageDb(projectId: string) {
    if (!languageDb) {
        languageDb = await openLanguageDb(projectId);
    }
    return languageDb;
}

export async function initLanguageDb(db: Database) {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      short TEXT NOT NULL UNIQUE,
      long TEXT NOT NULL UNIQUE,
      is_default INT NOT NULL DEFAULT 0
    );
  `);
}
export async function getLanguages(projectId: string) {
    const db = await getLanguageDb(projectId);
    const result = await db.select("SELECT short, long, is_default FROM languages", []);
    console.log("Fetched languages from DB:", result);
    return result as { short: string; long: string; is_default: number }[];
}
export async function addLanguage(projectId: string, short: string, long: string, is_default: boolean = false) {
    const db = await getLanguageDb(projectId);
    await db.execute("INSERT INTO languages (short, long, is_default) VALUES (?, ?, ?)", [short, long, is_default ? 1 : 0]);
}

export async function setDefaultLanguage(projectId: string, short: string) {
    const db = await getLanguageDb(projectId);
    await db.execute("UPDATE languages SET is_default = 1 WHERE short = ?", [short]).then(res => {
        console.log(`Language with short code '${short}' set as default in DB.`, res);
        return short;
    }).catch((err) => {
        console.error("Error setting default language:", err);
        throw err;
    });
}

export async function removeLanguage(projectId: string, short: string) {
    const db = await getLanguageDb(projectId);
    db.execute("DELETE FROM languages WHERE short = ?", [short]).then(() => {
        console.log(`Language with short code '${short}' removed from DB.`);
    }).catch((err) => {
        console.error("Error removing language:", err);
    });
}


//*** DC for project wide fields */

async function openProjectFieldDb(projectId: string) {
    const base = await appLocalDataDir();
    const projectDir = await join(base, "projects", projectId);
    if (!(await exists(projectDir))) {
        await mkdir(projectDir, { recursive: true });
    }
    const dbPath = await join(projectDir, "projectfields.sqlite");
    const db = await Database.load(`sqlite:${dbPath}`);
    await initProjectFieldDb(db);
    return db;
}

let projectFieldDb: Database | null = null;

export async function getProjectFieldDb(projectId: string) {
    if (!projectFieldDb) {
        projectFieldDb = await openProjectFieldDb(projectId);
    }
    return projectFieldDb;
}

export const initProjectFieldDb = async (db: Database) => {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS project_fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      form TEXT NOT NULL,
      name TEXT NOT NULL,
      label TEXT NOT NULL,
      type TEXT NOT NULL,
      inputType TEXT,
      operators TEXT,
      valueEditorType TEXT,
      valueList TEXT,
      required BOOLEAN NOT NULL,
      jsonpath TEXT,
      xformpath TEXT
    );
  `);
}

export const getFormFields = async (db: Database) => {
    const result = await db.select("SELECT * FROM project_fields", []);
    return result as { id: number, name: string; type: string; form: string; label: string; xformpath: string; jsonpath: string; inputType: string; operators: string; valueEditorType: string; values: string; required: boolean }[];
}

export const addFormField = async (project: string, { name, type, form, label, inputType, operators, valueEditorType, values, required, jsonpath, xformpath }: { name: string, type: string, form: string, jsonpath: string, xformpath: string, label: string, inputType: string, operators: string, valueEditorType: string, values: string, required: boolean }) => {
    const db = await getProjectFieldDb(project || "default");
    await db.execute("INSERT INTO project_fields (name, type, form, label, inputType, operators, valueEditorType, valueList, required, jsonpath, xformpath) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [name, type, form, label, inputType, operators, valueEditorType, values, required ? 1 : 0, jsonpath, xformpath]).then(() => {
        console.log(`Form field '${name}' added to DB.`);
    }).catch((err) => {
        console.error("Error adding form field:", err);
    });
}

export const removeFormField = async (db: Database, name: string, form: string) => {
    await db.execute("DELETE FROM project_fields WHERE name = ? AND form = ?", [name, form]);
}

export const removeAllProjectFields = async (db: Database, form: string) => {
    await db.execute("DELETE FROM project_fields WHERE form = ?", [form]);
}

export const updateFormField = async (db: Database, id: number, name: string, type: string, form: string, jsonpath: string, xformpath: string, label: string, inputType: string, operators: string, valueEditorType: string, values: string, required: boolean) => {
    await db.execute("UPDATE project_fields SET name = ?, type = ?, form = ?, label = ?, inputType = ?, operators = ?, valueEditorType = ?, values = ?, required = ?, jsonpath = ?, xformpath = ? WHERE id = ?", [name, type, form, label, inputType, operators, valueEditorType, values, required ? 1 : 0, jsonpath, xformpath, id]);
}
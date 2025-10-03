import { appLocalDataDir, join } from "@tauri-apps/api/path";
import Database from "@tauri-apps/plugin-sql";
// import { exists, mkdir } from "fs";

export async function getContactSummaryDb(projectId: string) {
    if (!contactSummaryDb) {
        contactSummaryDb = await openContactSummaryDb(projectId);
    }
    return contactSummaryDb;
}

const contactSummaryDbCache: { [projectId: string]: Database } = {};
let contactSummaryDb: Database | undefined = undefined;

async function openContactSummaryDb(projectId: string) {
    if (contactSummaryDbCache[projectId]) {
        return contactSummaryDbCache[projectId];
    }
    const base = await appLocalDataDir();
    const projectDir = await join(base, "projects", projectId);
    // if (!(await exists(projectDir))) {
    //     await mkdir(projectDir, { recursive: true });
    // }
    const dbPath = await join(projectDir, "contact-summary.sqlite");
    const db = await Database.load(`sqlite:${dbPath}`);
    await initContactSummaryDb(db);
    contactSummaryDbCache[projectId] = db;
    return db;
}

export async function initContactSummaryDb(db: Database) {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS contact_summary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      description TEXT,
      form TEXT,
      path TEXT,
      within_days INTEGER OPTIONAL,
      where_clause TEXT OPTIONAL,
      logic TEXT OPTIONAL
    );
  `);
}

export async function getContactSummaryRules(projectId: string) {
    const db = await getContactSummaryDb(projectId);
    const result = await db.select("SELECT * FROM contact_summary", []);
    console.log("Fetched contact summary rules from DB:", result);
    return result as any[];
}

export async function addContactSummaryRule(projectId: string, rule: any) {
    const db = await getContactSummaryDb(projectId);
    const {
        id,
        key,
        type,
        description,
        form,
        path,
        withinDays,
        where,
        logic
    } = rule;
    await db.execute(
        `INSERT INTO contact_summary 
      (id, key, type, description, form, path, within_days, where_clause, logic) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, key, type, description, form, path, withinDays, where, logic]
    );
}

export async function updateContactSummaryRule(projectId: string, id: number, patch: any) {
    console.log("Updating contact summary rule in DB:", id, patch);
    const db = await getContactSummaryDb(projectId);
    const {
        key,
        type,
        description,
        form,
        path,
        withinDays,
        where,
        logic
    } = patch;
    await db.execute(`UPDATE contact_summary SET key = ?, type = ?, description = ?, form = ?, path = ?, within_days = ?, where_clause = ?, logic = ? WHERE id = ?`, [key, type, description, form, path, withinDays, where, logic, id]);

}

export async function removeContactSummaryRule(projectId: string, id: number) {
    const db = await getContactSummaryDb(projectId);
    await db.execute("DELETE FROM contact_summary WHERE id = ?", [id]);
};

export const setAllContactSummaryRules = async (projectId: string, rules: any[]) => {
    const db = await getContactSummaryDb(projectId);
    const allRules = rules.map((rule) => {
        const {
            id,
            key,
            type,
            description,
            form,
            path,
            withinDays,
            where,
            logic
        } = rule;
        return db.execute(
            `INSERT INTO contact_summary 
      (id, key, type, description, form, path, within_days, where_clause, logic)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            id,
            key,
            type,
            description,
            form,
            path,
            withinDays,
            where,
            logic
        ]
        );
    });
    await Promise.all(allRules);
};

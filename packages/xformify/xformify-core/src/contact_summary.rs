use serde::Deserialize;
use serde_json as sj;
use std::path::PathBuf;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct RuleEntry {
    id: String,
    key: String,
    rule: String, // "last_value" | "days_since_last_form" | ...
    form: String, // e.g. "Erste.json"
    #[serde(default)]
    field_path: Option<String>, // e.g. "fields.Gruppe.Frage"
    r#type: String, // "number" | "string" | "boolean"
    #[serde(default)]
    within_days: Option<i64>, // e.g. 365
    #[serde(default)]
    fallback: Option<String>, // empty string treated as None
    #[serde(default)]
    description: Option<String>,
}

pub fn generate_contact_summary_from_json(
    json_path: PathBuf,
    export_path: PathBuf,
) -> Result<String, String> {
    // 1) read + parse
    println!("Generating contact summary from {}", json_path.display());
    let raw = std::fs::read_to_string(&json_path)
        .map_err(|e| format!("Failed to read {}: {}", json_path.display(), e))?;
    let mut rows: Vec<RuleEntry> = sj::from_str(&raw)
        .map_err(|e| format!("Failed to parse {}: {}", json_path.display(), e))?;

    // 2) build JS lines
    let mut ctx_lines: Vec<String> = Vec::new();
    let mut field_lines: Vec<String> = Vec::new();

    for r in rows.iter_mut() {
        let key = r.key.trim();
        if key.is_empty() {
            continue;
        }

        // normalize form: strip optional ".json"
        let form_id = r.form.trim().trim_end_matches(".json");
        let form_js = js_str(form_id);

        // normalize field path: drop leading "fields."
        let rel_path = r
            .field_path
            .as_deref()
            .map(|p| p.strip_prefix("fields.").unwrap_or(p))
            .unwrap_or("");

        let path_js = if rel_path.is_empty() {
            "null".to_string()
        } else {
            js_str(rel_path)
        };

        // normalize withinDays: 0/None => unbounded
        let within = r.within_days.unwrap_or(0);
        let within_js = if within > 0 {
            within.to_string()
        } else {
            "null".to_string()
        };

        // fallback
        let fb = r
            .fallback
            .as_ref()
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .map(|s| s.to_string());
        let fallback_js = fallback_js(&fb, &r.r#type);

        match r.rule.as_str() {
            "last_value" => {
                // compute + cast
                let cast = cast_expr("val", &r.r#type);
                let compute = format!("lastValue(reports, {form_js}, {path_js}, {within_js})");
                ctx_lines.push(format!(r#"const {key} = ((val) => {cast})({compute});"#));
                field_lines.push(format!(r#"{{ label: {lbl}, value: (c,r,ctx) => ctx.contactSummary?.{key} ?? {fallback_js} }}"#, lbl = js_str(key)));
            }
            "days_since_last_form" => {
                let compute = format!("daysSinceLastForm(reports, {form_js}, {within_js})");
                ctx_lines.push(format!(r#"const {key} = {compute};"#));
                field_lines.push(format!(r#"{{ label: {lbl}, value: (c,r,ctx) => ctx.contactSummary?.{key} ?? {fallback_js} }}"#, lbl = js_str(key)));
            }
            other => {
                // unknown rule -> expose null (and comment)
                ctx_lines.push(format!(
                    r#"const {key} = null /* unsupported rule: {} */;"#,
                    other
                ));
                field_lines.push(format!(
                    r#"{{ label: {lbl}, value: (c,r,ctx) => ctx.contactSummary?.{key} ?? '—' }}"#,
                    lbl = js_str(key)
                ));
            }
        }
    }

    // 3) assemble JS
    let js = format!(
        r#"//
// Auto-generated — contact-summary.templated.js
//
function pick(obj, path) {{
  if (!obj || !path) return undefined;
  return path.split('.').reduce((o, k) => (o === null ? undefined : o[k]), obj);
}}

function newestReport(reports, form, withinDays) {{
  const now = Date.now();
  const arr = (reports || [])
    .filter(r => r && r.form === form)
    .filter(r => {{
      if (!withinDays) return true;
      const t = new Date(r.reported_date).getTime();
      return Number.isFinite(t) && (now - t) <= withinDays * 86400000;
    }})
    .sort((a,b) => new Date(b.reported_date) - new Date(a.reported_date));
  return arr[0] || null;
}}

function lastValue(reports, form, fieldPath, withinDays) {{
  const rep = newestReport(reports, form, withinDays);
  if (!rep) return null;
  const val = fieldPath ? pick(rep.fields, fieldPath) : null;
  return val ?? null;
}}

function daysSinceLastForm(reports, form, withinDays) {{
  const rep = newestReport(reports, form, withinDays);
  if (!rep) return null;
  const t = new Date(rep.reported_date).getTime();
  if (!Number.isFinite(t)) return null;
  return Math.floor((Date.now() - t) / 86400000);
}}

module.exports = {{
  fields: [
    {fields}
  ],

  cards: [
    {{
      label: 'Contact summary',
      fields: [
        {fields}
      ]
    }}
  ],

  context: (_, reports) => {{
    {ctx_lines}
    return {{
      contactSummary: {{
        {ctx_exports}
      }}
    }};
  }},
}};
"#,
        fields = field_lines.join(",\n    "),
        ctx_lines = ctx_lines.join("\n    "),
        ctx_exports = ctx_lines
            .iter()
            .map(|l| l
                .trim_start_matches("const ")
                .split('=')
                .next()
                .unwrap()
                .trim())
            .collect::<Vec<_>>()
            .join(",\n        ")
    );

    let js = js.replace("\"", "'");
    // 4) write
    let out = export_path.join("contact-summary.templated.js");
    std::fs::write(&out, js).map_err(|e| format!("Failed to write {}: {}", out.display(), e))?;
    Ok(out.display().to_string())
}

/* ---- small helpers ---- */
fn js_str(s: &str) -> String {
    format!("{:?}", s)
}

fn fallback_js(fb: &Option<String>, typ: &str) -> String {
    match (typ, fb.as_deref()) {
        ("number", Some(v)) if !v.is_empty() => v.to_string(),
        ("boolean", Some(v)) if v == "true" || v == "false" => v.to_string(),
        ("string", Some(v)) if !v.is_empty() => js_str(v),
        _ => "null".to_string(),
    }
}

fn cast_expr(var: &str, typ: &str) -> String {
    match typ {
        "number" => format!("(Number.isFinite(Number({var})) ? Number({var}) : null)"),
        "boolean" => format!("(({var}) ? true : ({var}===0 ? false : Boolean({var})))"),
        _ => format!("({var}===null ? null : String({var}))"),
    }
}

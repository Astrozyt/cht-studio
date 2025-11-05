use std::collections::HashMap;

use serde::{Deserialize, Serialize};

// use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    pub name: String,
    pub title: String,
    pub icon: String,
    pub applies_to: String,           // "contacts" | "reports"
    pub applies_to_type: Vec<String>, // ["person"] or form ids
    #[serde(default)]
    pub applies_if: Option<AppliesIf>, // "", or RQB object
    pub events: Vec<Event>,
    pub actions: Vec<Action>,
    pub priority: Option<Priority>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum AppliesIf {
    EmptyString(String), // "", or legacy string
    Group(RuleGroup),    // react-querybuilder tree
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Event {
    pub id: String,
    pub start: i64,
    pub end: i64,
    pub days: i64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Action {
    #[serde(rename = "type")]
    pub r#type: String, // "report" | "contact"
    pub form: Option<String>,
    pub label: Option<String>,
    pub modify_content: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Priority {
    pub level: i64,
}

/* --- RQB-ish types --- */

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RuleGroup {
    pub combinator: String,   // "and" | "or"
    pub rules: Vec<RuleNode>, // mixed
    pub not: Option<bool>,
    pub id: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum RuleNode {
    Rule(Rule),
    Group(RuleGroup),
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Rule {
    pub id: Option<String>,
    pub field: String,
    pub operator: String,
    #[serde(default)]
    pub value: Option<serde_json::Value>, // string/number/bool/array/null
    pub value_source: Option<String>,
    pub disabled: Option<bool>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Form {
    pub title: String,
    pub root: String,
    pub body: Vec<Node>,
}

// #[derive(Debug, Deserialize, Serialize)]

// pub struct Event {
//     pub id: String,
//     pub start: u64,
//     pub end: u64,
//     pub days: u64,
// }

// #[derive(Debug, Deserialize, Serialize)]
// pub struct Action {
//     pub r#type: String,
//     pub form: String,
//     pub label: String,
//     pub modify_content: Option<String>,
// }

// #[derive(Debug, Serialize, Deserialize)]
// pub struct TaskJsonInput {
//     pub name: String,
//     pub title: String,
//     pub icon: String,
//     pub applies_to: String,
//     pub applies_to_type: Vec<String>,
//     pub applies_if: String,
//     pub events: Vec<Event>,
//     pub actions: Vec<Action>,
//     pub priority: u32,
// }

// #[derive(Debug, Serialize, Deserialize)]
// #[serde(rename_all = "camelCase")]
// pub struct Task {
//     pub name: String,
//     pub title: String,
//     pub icon: String,
//     pub applies_to: String,           // "contacts" | "reports"
//     pub applies_to_type: Vec<String>, // ["person"], etc.
//     pub applies_if: Option<AppliesIf>,
//     pub events: Vec<Event>,
//     pub actions: Vec<Action>,
//     pub priority: Option<Priority>,
// }

// #[derive(Debug, Serialize, Deserialize)]
// #[serde(untagged)]
// pub enum AppliesIf {
//     EmptyString(String), // "", or any string you may still emit
//     Group(RuleGroup),    // react-querybuilder tree
// }

// #[derive(Debug, Serialize, Deserialize)]
// pub struct Priority {
//     pub level: i64,
// }

#[derive(Debug, Deserialize, Serialize)]
pub struct Localized {
    pub lang: String,
    pub value: String,
}

// #[derive(Debug, Deserialize, Serialize)]
// pub struct Rule {
//     pub id: Option<String>,
//     pub field: String,
//     pub operator: String,
//     #[serde(default)]
//     pub value_source: Option<String>,
//     pub value: serde_json::Value,
//     pub disabled: Option<bool>,
// }

#[derive(Debug, Deserialize, Serialize)]
pub struct Logic {
    pub combinator: String, // "and" | "or"
    #[serde(default)]
    pub rules: Vec<Rule>,
    pub id: Option<String>,
}

#[derive(Debug, Default, Deserialize, Serialize)]
pub struct Bind {
    #[serde(default)]
    pub required: Option<String>, // "yes" | "no"
    #[serde(default)]
    pub relevant: Option<Logic>,
    #[serde(default)]
    pub constraint: Option<Logic>,
    #[serde(default)]
    pub constraint_msg: String,
    #[serde(default)]
    pub calculate: String,
    #[serde(default)]
    pub preload: String,
    #[serde(default)]
    pub preload_params: String,
    #[serde(default)]
    pub r#type: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ItemChoice {
    pub value: String,
    pub labels: Vec<Localized>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Node {
    pub uid: String,
    pub r#ref: String,
    pub labels: Vec<Localized>,
    #[serde(default)]
    pub hints: Vec<Localized>,
    #[serde(default)]
    pub items: Vec<ItemChoice>,
    pub tag: String, // "group" | "input" | "select1" | "select"
    #[serde(default)]
    pub bind: Bind,
    #[serde(default)]
    pub children: Vec<Node>,
    #[serde(default)]
    pub appearance: Option<String>,
}

// #[derive(Debug, Serialize, Deserialize)]
// #[serde(rename_all = "camelCase")]
// pub struct RuleGroup {
//     pub combinator: String,   // "and" | "or"
//     pub rules: Vec<RuleNode>, // mixed rules & groups
//     pub not: Option<bool>,
//     pub id: Option<String>,
// }

// #[derive(Debug, Serialize, Deserialize)]
// #[serde(untagged)]
// pub enum RuleNode {
//     Rule(Rule),
//     Group(RuleGroup),
// }

// #[derive(Debug, Serialize, Deserialize)]
// #[serde(rename_all = "camelCase")]
// pub struct Rule {
//     pub id: Option<String>,
//     pub field: String,
//     pub operator: String,
//     #[serde(default)]
//     pub value: Option<serde_json::Value>, // can be string/number/bool/array/null
//     pub value_source: Option<String>, // "value" | "field"
//     pub disabled: Option<bool>,
// }

#[derive(Debug, Default, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct AppSettings {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub locale: Option<String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub locales: Vec<String>,

    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub contact_types: Vec<ContactType>,

    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub roles: HashMap<String, Role>,

    #[serde(default, skip_serializing_if = "HashMap::is_empty")]
    pub permissions: HashMap<String, Vec<String>>,
    // … add other fields you care about, each with defaults/skips
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct ContactType {
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name_key: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub create_person: Option<bool>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct ContactFormEntry {
    pub create: String,
    pub edit: String,
}
#[derive(Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct ContactForms {
    pub contact_forms: Vec<ContactFormEntry>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "snake_case")]
pub struct Role {
    pub name: String,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub permissions: Vec<String>,
}

// ---------- Little "builder" API so you can fill step-by-step ----------
impl AppSettings {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn with_locale(mut self, l: impl Into<String>) -> Self {
        self.locale = Some(l.into());
        self
    }
    pub fn add_locale(mut self, l: impl Into<String>) -> Self {
        self.locales.push(l.into());
        self
    }
    pub fn add_contact_type(mut self, ct: ContactType) -> Self {
        self.contact_types.push(ct);
        self
    }
    pub fn upsert_role(mut self, key: impl Into<String>, role: Role) -> Self {
        self.roles.insert(key.into(), role);
        self
    }
    pub fn grant(mut self, perm: impl Into<String>, to_roles: Vec<String>) -> Self {
        self.permissions.insert(perm.into(), to_roles);
        self
    }
}

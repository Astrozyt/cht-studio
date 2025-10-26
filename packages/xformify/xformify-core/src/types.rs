use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct Form {
    pub title: String,
    pub root: String,
    pub body: Vec<Node>,
}

#[derive(Debug, Deserialize, Serialize)]

pub struct Event {
    pub id: String,
    pub start: u64,
    pub end: u64,
    pub days: u64,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Action {
    pub r#type: String,
    pub form: String,
    pub label: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaskJsonInput {
    pub name: String,
    pub title: String,
    pub icon: String,
    pub applies_to: String,
    pub applies_to_type: Vec<String>,
    pub applies_if: String,
    pub events: Vec<Event>,
    pub actions: Vec<Action>,
    pub priority: u32,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Localized {
    pub lang: String,
    pub value: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Rule {
    pub id: Option<String>,
    pub field: String,
    pub operator: String,
    #[serde(default)]
    pub value_source: Option<String>,
    pub value: serde_json::Value,
}

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

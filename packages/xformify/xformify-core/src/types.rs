use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Form {
    pub title: String,
    pub root: String,
    pub body: Vec<Node>,
}

#[derive(Debug, Deserialize)]
pub struct Localized {
    pub lang: String,
    pub value: String,
}

#[derive(Debug, Deserialize)]
pub struct Rule {
    pub id: Option<String>,
    pub field: String,
    pub operator: String,
    #[serde(default)]
    pub value_source: Option<String>,
    pub value: serde_json::Value,
}

#[derive(Debug, Deserialize)]
pub struct Logic {
    pub combinator: String, // "and" | "or"
    #[serde(default)]
    pub rules: Vec<Rule>,
    pub id: Option<String>,
}

#[derive(Debug, Default, Deserialize)]
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

#[derive(Debug, Deserialize)]
pub struct ItemChoice {
    pub value: String,
    pub labels: Vec<Localized>,
}

#[derive(Debug, Deserialize)]
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

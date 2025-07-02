use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct BodyNode {
    pub tag: String,
    #[serde(rename = "ref")]
    pub ref_: Option<String>,
    pub appearance: Option<String>,
    pub label_ref: Option<String>,
    pub labels: Option<Vec<LangText>>,
    pub hints: Option<Vec<LangText>>,
    pub hint_ref: Option<String>,
    pub items: Option<Vec<Item>>,
    pub children: Option<Vec<BodyNode>>,
    pub bind: Option<Bind>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct JSONXFormDoc {
    pub title: String,
    pub body: Vec<BodyNode>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Bind {
    pub nodeset: String,
    #[serde(flatten)]
    pub extra: HashMap<String, String>,
}

#[derive(Debug, Deserialize, Clone)]
pub struct LangText {
    pub id: String,
    pub lang: String,
    pub value: String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct Item {
    pub label_ref: Option<String>,
    #[serde(default)]
    pub item_labels: Vec<LangText>,
}

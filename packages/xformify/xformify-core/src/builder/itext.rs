use crate::types::{Localized, Node};
use std::collections::BTreeMap;

pub struct Itext {
    // id -> lang -> value
    pub map: BTreeMap<String, BTreeMap<String, String>>,
}

impl Itext {
    pub fn new() -> Self {
        Self {
            map: BTreeMap::new(),
        }
    }

    pub fn add(&mut self, id: &str, locs: &[Localized]) {
        let entry = self.map.entry(id.to_string()).or_default();
        for l in locs {
            entry.insert(l.lang.clone(), l.value.clone());
        }
    }

    pub fn collect_from_node(&mut self, id_base: &str, n: &Node) {
        self.add(&format!("lbl:{id_base}"), &n.labels);
        if !n.hints.is_empty() {
            self.add(&format!("hint:{id_base}"), &n.hints);
        }
        for it in &n.items {
            self.add(&format!("item:{id_base}:{}", it.value), &it.labels);
        }
    }
}

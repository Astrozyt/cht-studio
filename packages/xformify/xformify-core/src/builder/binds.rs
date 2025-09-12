use quick_xml::events::{BytesStart, Event};
use quick_xml::Writer;
use std::collections::HashMap;
use std::io::Write;

use crate::types::Node;
use crate::xpaths::{compile_logic_to_xpath, sanitize_name};

pub struct PathIndex {
    pub map: HashMap<String, String>, // ref -> abs xpath
}

impl PathIndex {
    pub fn new() -> Self {
        Self {
            map: HashMap::new(),
        }
    }
    pub fn index_nodes(&mut self, parent_path: &str, nodes: &[Node]) {
        for n in nodes {
            let name = sanitize_name(&n.r#ref);
            let path = format!("{}/{}", parent_path, name);
            self.map.insert(n.r#ref.clone(), path.clone());
            if !n.children.is_empty() {
                self.index_nodes(&path, &n.children);
            }
        }
    }
    pub fn path_for(&self, field_ref: &str) -> String {
        self.map
            .get(field_ref)
            .cloned()
            .unwrap_or_else(|| format!("/data/{}", sanitize_name(field_ref)))
    }
}

pub fn write_binds<W: Write>(
    w: &mut Writer<W>,
    idx: &PathIndex,
    nodes: &[Node],
) -> anyhow::Result<()> {
    for n in nodes {
        if n.children.is_empty() {
            write_bind(w, idx, n)?;
        } else {
            write_binds(w, idx, &n.children)?;
        }
    }
    Ok(())
}

fn write_bind<W: Write>(w: &mut Writer<W>, idx: &PathIndex, n: &Node) -> anyhow::Result<()> {
    let nodeset = idx.path_for(&n.r#ref);
    let mut attrs: Vec<(&str, String)> = vec![("nodeset", nodeset)];

    if let Some(t) = n.bind.r#type.as_deref() {
        attrs.push(("type", map_type(t).to_string()));
    }
    if matches!(n.bind.required.as_deref(), Some("yes")) {
        attrs.push(("required", "true()".into()));
    }
    if let Some(rel) = &n.bind.relevant {
        if let Some(xp) = compile_logic_to_xpath(&|f| idx.path_for(f), rel) {
            attrs.push(("relevant", xp));
        }
    }
    if let Some(c) = &n.bind.constraint {
        if let Some(xp) = compile_logic_to_xpath(&|f| idx.path_for(f), c) {
            attrs.push(("constraint", xp));
        }
    }
    if !n.bind.calculate.is_empty() {
        attrs.push(("calculate", n.bind.calculate.clone()));
    }
    if !n.bind.preload.is_empty() {
        attrs.push(("jr:preload", n.bind.preload.clone()));
        if !n.bind.preload_params.is_empty() {
            attrs.push(("jr:preloadParams", n.bind.preload_params.clone()));
        }
    }

    let mut e = BytesStart::new("bind");
    for (k, v) in attrs {
        e.push_attribute((k, v.as_str()));
    }
    w.write_event(Event::Empty(e))?;
    Ok(())
}

fn map_type(t: &str) -> &str {
    match t {
        "string" => "string",
        "int" => "int",
        "date" => "date",
        "select1" => "select1",
        "select" => "select",
        _ => "string",
    }
}

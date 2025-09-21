mod types;
pub use types::*;

mod xpaths;
mod builder {
    pub mod binds;
    pub mod body;
    pub mod instance;
    pub mod itext;
}

use anyhow::Result;
use quick_xml::events::{BytesStart, BytesText, Event};
use quick_xml::Writer;
use std::collections::BTreeSet;
use std::io::Cursor;

use builder::binds::{write_binds, PathIndex};
use builder::body::write_body;
use builder::instance::write_instance;
use builder::itext::Itext;

pub fn json_to_xform(xml_id: &str, form: &Form) -> Result<String, anyhow::Error> {
    // Collect itext
    let mut it = Itext::new();
    fn walk(it: &mut Itext, prefix: &str, n: &Node) {
        let name = crate::xpaths::sanitize_name(&n.r#ref);
        let id = if prefix.is_empty() {
            name
        } else {
            format!("{prefix}:{name}")
        };
        it.collect_from_node(&id, n);
        for c in &n.children {
            walk(it, &id, c);
        }
    }
    for n in &form.body {
        walk(&mut it, "", n);
    }

    // Path index
    let mut idx = PathIndex::new();
    idx.index_nodes("/data", &form.body);

    // Writer
    let mut buf = Cursor::new(Vec::new());
    let mut w = Writer::new_with_indent(&mut buf, b' ', 2);

    // <h:html …>
    let mut html = BytesStart::new("h:html");
    for (k, v) in [
        ("xmlns", "http://www.w3.org/2002/xforms"),
        ("xmlns:h", "http://www.w3.org/1999/xhtml"),
        ("xmlns:ev", "http://www.w3.org/2001/xml-events"),
        ("xmlns:xsd", "http://www.w3.org/2001/XMLSchema"),
        ("xmlns:jr", "http://openrosa.org/javarosa"),
    ] {
        html.push_attribute((k, v));
    }
    w.write_event(Event::Start(html))?;

    // <h:head>
    start(&mut w, "h:head", &[])?;
    simple(&mut w, "h:title", &[], &form.title)?;

    // <model>
    start(&mut w, "model", &[])?;
    write_itext(&mut w, &it)?;
    write_instance(&mut w, xml_id, &form.body)?;
    write_binds(&mut w, &idx, &form.body)?;
    end(&mut w, "model")?;
    end(&mut w, "h:head")?;

    // <h:body>
    start(&mut w, "h:body", &[])?;
    write_body(&mut w, &form.body, "/data", "")?;
    end(&mut w, "h:body")?;

    // </h:html>
    end(&mut w, "h:html")?;

    Ok(String::from_utf8(buf.into_inner())?)
}

// #[derive(thiserror::Error, Debug)]
// pub enum XformError {
//     #[error("invalid input: {0}")]
//     Invalid(String),
//     #[error("internal: {0}")]
//     Internal(String),
// }

fn write_itext<W: std::io::Write>(w: &mut Writer<W>, it: &Itext) -> anyhow::Result<()> {
    start(w, "itext", &[])?;
    let mut langs: BTreeSet<String> = BTreeSet::new();
    for m in it.map.values() {
        for lang in m.keys() {
            langs.insert(lang.clone());
        }
    }
    for lang in langs {
        start(w, "translation", &[("lang", &lang)])?;
        for (id, locs) in &it.map {
            if let Some(v) = locs.get(&lang) {
                start(w, "text", &[("id", id)])?;
                simple(w, "value", &[], v)?;
                end(w, "text")?;
            }
        }
        end(w, "translation")?;
    }
    end(w, "itext")?;
    Ok(())
}

fn start<W: std::io::Write>(
    w: &mut Writer<W>,
    name: &str,
    attrs: &[(&str, &str)],
) -> anyhow::Result<()> {
    let mut e = BytesStart::new(name);
    for (k, v) in attrs {
        e.push_attribute((*k, *v));
    }
    w.write_event(Event::Start(e))?;
    Ok(())
}

fn end<W: std::io::Write>(w: &mut Writer<W>, name: &str) -> anyhow::Result<()> {
    w.write_event(Event::End(BytesStart::new(name).to_end()))?;
    Ok(())
}

fn simple<W: std::io::Write>(
    w: &mut Writer<W>,
    name: &str,
    attrs: &[(&str, &str)],
    text: &str,
) -> anyhow::Result<()> {
    let mut e = BytesStart::new(name);
    for (k, v) in attrs {
        e.push_attribute((*k, *v));
    }
    w.write_event(Event::Start(e.clone()))?;
    if !text.is_empty() {
        w.write_event(Event::Text(BytesText::new(text)))?;
    }
    w.write_event(Event::End(e.to_end()))?;
    Ok(())
}

// #[cfg(test)]
// mod tests {
//     mod roundtrip;
//     mod smoke;
// }

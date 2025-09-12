use quick_xml::events::{BytesStart, BytesText, Event};
use quick_xml::Writer;
use std::io::Write;

use crate::types::Node;
use crate::xpaths::sanitize_name;

pub fn write_body<W: Write>(
    w: &mut Writer<W>,
    nodes: &[Node],
    base: &str,
    id_prefix: &str,
) -> anyhow::Result<()> {
    for n in nodes {
        let name = sanitize_name(&n.r#ref);
        let path = format!("{}/{}", base, name);

        let id_base = if id_prefix.is_empty() {
            name.clone()
        } else {
            format!("{id_prefix}:{name}")
        };

        match n.tag.as_str() {
            "group" => {
                start(w, "group", &[("ref", &path)])?;
                label_hint(w, &format!("lbl:{id_base}"), &format!("hint:{id_base}"))?;
                write_body(w, &n.children, &path, &id_base)?;
                end(w, "group")?;
            }
            "input" => {
                start(w, "input", &[("ref", &path)])?;
                label_hint(w, &format!("lbl:{id_base}"), &format!("hint:{id_base}"))?;
                end(w, "input")?;
            }
            "select1" | "select" => {
                let tag = n.tag.as_str();
                let mut attrs: Vec<(&str, &str)> = vec![("ref", &path)];
                if let Some(app) = &n.appearance {
                    attrs.push(("appearance", app.as_str()));
                }
                start(w, tag, &attrs)?;
                label_hint(w, &format!("lbl:{id_base}"), &format!("hint:{id_base}"))?;
                for it in &n.items {
                    start(w, "item", &[])?;
                    simple(
                        w,
                        "label",
                        &[("ref", &format!("jr:itext('item:{id_base}:{}')", it.value))],
                        "",
                    )?;
                    simple(w, "value", &[], &it.value)?;
                    end(w, "item")?;
                }
                end(w, tag)?;
            }
            _ => { /* ignore unknown tags for now */ }
        }
    }
    Ok(())
}

fn label_hint<W: Write>(w: &mut Writer<W>, lbl_id: &str, hint_id: &str) -> anyhow::Result<()> {
    simple(w, "label", &[("ref", &format!("jr:itext('{lbl_id}')"))], "")?;
    simple(w, "hint", &[("ref", &format!("jr:itext('{hint_id}')"))], "")?;
    Ok(())
}

fn start<W: Write>(w: &mut Writer<W>, name: &str, attrs: &[(&str, &str)]) -> anyhow::Result<()> {
    let mut e = BytesStart::new(name);
    for (k, v) in attrs {
        e.push_attribute((*k, *v));
    }
    w.write_event(Event::Start(e))?;
    Ok(())
}

fn end<W: Write>(w: &mut Writer<W>, name: &str) -> anyhow::Result<()> {
    w.write_event(Event::End(BytesStart::new(name).to_end()))?;
    Ok(())
}

fn simple<W: Write>(
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

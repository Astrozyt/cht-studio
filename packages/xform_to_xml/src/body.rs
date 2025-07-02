// src/body.rs

use crate::types::BodyNode;
use quick_xml::events::{BytesEnd, BytesStart, Event};
use quick_xml::Writer;
use std::io::Cursor;

pub fn write_body_node(
    writer: &mut Writer<Cursor<Vec<u8>>>,
    node: &BodyNode,
) -> quick_xml::Result<()> {
    let mut start = BytesStart::new(node.tag.as_str());

    if let Some(r) = &node.ref_ {
        start.push_attribute(("ref", r.as_str()));
    }
    if let Some(app) = &node.appearance {
        start.push_attribute(("appearance", app.as_str()));
    }

    let has_children = node.children.as_ref().map_or(false, |v| !v.is_empty());

    if has_children {
        writer.write_event(Event::Start(start.to_owned()))?;
        for child in node.children.as_ref().unwrap() {
            write_body_node(writer, child)?;
        }
        writer.write_event(Event::End(BytesEnd::new(node.tag.as_str())))?;
    } else {
        writer.write_event(Event::Empty(start))?;
    }
    Ok(())
}

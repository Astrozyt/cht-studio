use quick_xml::events::{BytesEnd, BytesStart, BytesText, Event};
use quick_xml::Writer;
use std::io::Cursor;

use crate::types::BodyNode;

pub fn write_body_node(
    writer: &mut Writer<Cursor<Vec<u8>>>,
    node: &BodyNode,
) -> quick_xml::Result<()> {
    let mut tag = BytesStart::new(node.tag.as_str());

    // Attributes
    if let Some(r) = &node.ref_ {
        tag.push_attribute(("ref", r.as_str()));
    }
    if let Some(a) = &node.appearance {
        tag.push_attribute(("appearance", a.as_str()));
    }

    writer.write_event(Event::Start(tag))?;

    // Optional label
    if let Some(label_ref) = &node.label_ref {
        let mut label_tag = BytesStart::new("label");
        let labelref = &format!("jr:itext('{}')", label_ref);
        label_tag.push_attribute(("ref", labelref.as_str()));
        writer.write_event(Event::Empty(label_tag))?;
    }

    // Optional hint
    if let Some(hint_ref) = &node.hint_ref {
        let mut hint_tag = BytesStart::new("hint");
        let hintref = &format!("jr:itext('{}')", hint_ref);
        hint_tag.push_attribute(("ref", hintref.as_str()));
        writer.write_event(Event::Empty(hint_tag))?;
    }

    // Optionally write <item> for select/select1
    if node.tag == "select" || node.tag == "select1" {
        if let Some(items) = &node.items {
            for item in items {
                let mut item_tag = BytesStart::new("item");
                writer.write_event(Event::Start(item_tag.clone()))?;

                // if let Some(item_labels) = &item.item_labels {
                for label in &item.item_labels {
                    let mut label_tag = BytesStart::new("label");
                    label_tag.push_attribute(("lang", label.lang.as_str()));
                    writer.write_event(Event::Start(label_tag))?;
                    writer.write_event(Event::Text(BytesText::new(&label.value)))?;
                    writer.write_event(Event::End(BytesEnd::new("label")))?;
                }
                // }

                // Hardcoded value attribute fallback for now
                let mut value_tag = BytesStart::new("value");
                writer.write_event(Event::Start(value_tag))?;
                writer.write_event(Event::Text(BytesText::new("value")))?; // You might have `value` field later
                writer.write_event(Event::End(BytesEnd::new("value")))?;

                writer.write_event(Event::End(BytesEnd::new("item")))?;
                // }
            }
        }
    }

    // Children
    if let Some(children) = &node.children {
        for child in children {
            write_body_node(writer, child)?;
        }
    }

    writer.write_event(Event::End(BytesEnd::new(node.tag.as_str())))?;
    Ok(())
}

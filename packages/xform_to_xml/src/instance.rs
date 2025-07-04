use std::{collections::BTreeMap, io::Cursor};

use quick_xml::{
    events::{BytesEnd, BytesStart, Event},
    Writer,
};

use crate::types::Bind;

#[derive(Debug, Default)]
pub struct InstanceNode {
    children: BTreeMap<String, InstanceNode>,
}

impl InstanceNode {
    pub fn insert_path(&mut self, path: &str) {
        let parts: Vec<&str> = path.trim_start_matches('/').split('/').collect();
        let mut current = self;
        for part in parts {
            current = current.children.entry(part.to_string()).or_default();
        }
    }
}

impl InstanceNode {
    pub fn render(
        &self,
        writer: &mut Writer<Cursor<Vec<u8>>>,
        name: &str,
    ) -> quick_xml::Result<()> {
        let mut start = BytesStart::new(name);
        writer.write_event(Event::Start(start.clone()))?;

        for (child_name, child_node) in &self.children {
            child_node.render(writer, child_name)?;
        }

        writer.write_event(Event::End(BytesEnd::new(name)))?;
        Ok(())
    }
}

pub fn render_instance(
    writer: &mut Writer<Cursor<Vec<u8>>>,
    binds: &[Bind],
) -> quick_xml::Result<()> {
    use quick_xml::events::Event;

    let mut root = InstanceNode::default();

    for bind in binds {
        root.insert_path(&bind.nodeset);
    }

    writer.write_event(Event::Start(BytesStart::new("instance")))?;
    root.render(writer, "data")?; // "data" is the root instance element
    writer.write_event(Event::End(BytesEnd::new("instance")))?;

    Ok(())
}

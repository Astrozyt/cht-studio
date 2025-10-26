use quick_xml::events::{BytesStart, Event};
use quick_xml::Writer;
use std::io::Write;

use crate::types::Node;
use crate::xpaths::sanitize_name;

pub fn write_instance<W: Write>(
    w: &mut Writer<W>,
    root_id: &str,
    nodes: &[Node],
) -> anyhow::Result<()> {
    start_elem(w, "instance", &[])?;
    start_elem(w, "data", &[("id", root_id), ("version", "1")])?;
    for n in nodes {
        write_node(w, n)?;
    }
    end_elem(w, "data")?;
    end_elem(w, "instance")?;
    Ok(())
}

fn write_node<W: Write>(w: &mut Writer<W>, n: &Node) -> anyhow::Result<()> {
    let name = sanitize_name(&n.r#ref);
    start_elem(w, &name, &[])?;
    for c in &n.children {
        write_node(w, c)?;
    }
    end_elem(w, &name)?;
    Ok(())
}

fn start_elem<W: Write>(
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

fn end_elem<W: Write>(w: &mut Writer<W>, name: &str) -> anyhow::Result<()> {
    w.write_event(Event::End(BytesStart::new(name).to_end()))?;
    Ok(())
}

pub fn write_external_instances<W: std::io::Write>(w: &mut Writer<W>) -> anyhow::Result<()> {
    // <instance id="contact" src="jr://instance/contact"/>
    let mut inst_contact = BytesStart::new("instance");
    inst_contact.push_attribute(("id", "contact"));
    inst_contact.push_attribute(("src", "jr://instance/contact"));
    w.write_event(Event::Empty(inst_contact))?;

    // <instance id="contact-summary" src="jr://instance/contact-summary"/>
    let mut inst_cs = BytesStart::new("instance");
    inst_cs.push_attribute(("id", "contact-summary"));
    inst_cs.push_attribute(("src", "jr://instance/contact-summary"));
    w.write_event(Event::Empty(inst_cs))?;

    Ok(())
}

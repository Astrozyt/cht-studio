use std::io::Cursor;

use quick_xml::events::{BytesDecl, BytesEnd, BytesStart, BytesText, Event};
use quick_xml::Writer;
mod bind;
mod body;
mod translations;
mod types;

use crate::bind::render_bind;
use crate::types::{Bind, BodyNode, JSONXFormDoc};

pub fn generate_xform(inputDoc: JSONXFormDoc) -> Result<String, Box<dyn std::error::Error>> {
    let mut writer = Writer::new(Cursor::new(Vec::new()));
    // Add <?xml version="1.0"?>
    writer.write_event(Event::Decl(BytesDecl::new("1.0", Some("UTF-8"), None)))?;

    // Start with the <h:html> declaration
    let mut root = BytesStart::new("h:html");
    root.push_attribute(("xmlns", "http://www.w3.org/2002/xforms"));
    root.push_attribute(("xmlns:h", "http://www.w3.org/1999/xhtml"));
    root.push_attribute(("xmlns:ev", "http://www.w3.org/2001/xml-events"));
    root.push_attribute(("xmlns:xsd", "http://www.w3.org/2001/XMLSchema"));
    root.push_attribute(("xmlns:jr", "http://openrosa.org/javarosa"));
    root.push_attribute(("xmlns:orx", "http://openrosa.org/xforms"));
    writer.write_event(Event::Start(root))?;

    // Start element of <h:head>
    writer.write_event(Event::Start(BytesStart::new("h:head")))?;

    // Start element of <h:title>
    writer.write_event(Event::Start(BytesStart::new("h:title")))?;
    let title_text = BytesText::new(&inputDoc.title);
    writer.write_event(Event::Text(title_text))?;
    writer.write_event(Event::End(BytesEnd::new("h:title")))?;
    writer.write_event(Event::Start(BytesStart::new("model")))?;
    // Write binds
    let mut all_binds = Vec::<Bind>::new();
    for node in &inputDoc.body {
        crate::bind::collect_binds(node, &mut all_binds);
    }
    for b in &all_binds {
        render_bind(&mut writer, b)?;
    }
    writer.write_event(Event::End(BytesEnd::new("model")))?;
    writer.write_event(Event::End(BytesEnd::new("h:head")))?;
    // Start element of <h:body>
    writer.write_event(Event::Start(BytesStart::new("h:body")))?;
    // Write body nodes
    writer.write_event(Event::Text(BytesText::new("Body content goes here")))?;
    writer.write_event(Event::End(BytesEnd::new("h:body")))?;
    // End element of <h:html>
    writer.write_event(Event::End(BytesEnd::new("h:html")))?;

    Ok(("Form generated successfully".to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn debug_generate_xform() -> Result<(), Box<dyn std::error::Error>> {
        if std::env::var("RUST_TEST_THREADS").is_err() {
            std::env::set_var("RUST_TEST_THREADS", "1");
        }
        let raw_mock = include_str!("tests/fixtures/bp_confirm_selftransformed.json");
        let mock_data: JSONXFormDoc = serde_json::from_str(raw_mock)?;
        let result = generate_xform(mock_data)?;
        println!("\n[Generated XML]:\n{}\n", result);
        assert!(result.contains("<h:html"));

        Ok(())
    }
}

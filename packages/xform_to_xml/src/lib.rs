use quick_xml::events::{BytesDecl, BytesEnd, BytesStart, Event};
use quick_xml::Writer;

pub fn generate_xform(data: serde_json::Value) -> Result<String, Box<dyn std::error::Error>> {
    let mut writer = Writer::new_with_indent(Vec::new(), b' ', 2);

    writer.write_event(Event::Decl(BytesDecl::new("1.0", Some("UTF-8"), None)))?;

    let root = BytesStart::new("h:html");
    writer.write_event(Event::Start(root))?;

    let mut head_start = BytesStart::new("h:head");
    writer.write_event(Event::Start(head_start))?;

    let mut title_start = BytesStart::new("h:title");
    writer.write_event(Event::Start(title_start))?;
    // TODO: write children based on your JSON structure

    writer.write_event(Event::End(BytesEnd::new("h:html")))?;

    let result = String::from_utf8(writer.into_inner())?;
    Ok(result)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn debug_generate_xform() -> Result<(), Box<dyn std::error::Error>> {
        if std::env::var("RUST_TEST_THREADS").is_err() {
            std::env::set_var("RUST_TEST_THREADS", "1");
        }

        let mock_data = json!({
            "model": {
                "bind": [
                    { "nodeset": "/data/name", "type": "string", "required": true }
                ]
            },
            "body": [
                { "tag": "input", "ref": "/data/name" }
            ]
        });

        let result = generate_xform(mock_data)?;
        println!("\n[Generated XML]:\n{}\n", result);
        assert!(result.contains("<h:html"));

        Ok(())
    }
}

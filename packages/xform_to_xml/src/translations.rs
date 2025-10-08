use std::{collections::HashMap, io::Cursor};

use quick_xml::{
    events::{BytesEnd, BytesStart, BytesText, Event},
    Writer,
};

use crate::types::BodyNode;

pub type ITextMap = HashMap<String, Vec<(String, String)>>; // lang => [(id, value)]

pub fn collect_itexts(node: &BodyNode, out: &mut ITextMap) {
    if let Some(labels) = &node.labels {
        for label in labels {
            out.entry(label.lang.clone())
                .or_default()
                .push((label.id.clone(), label.value.clone()));
        }
    }

    if let Some(hints) = &node.hints {
        for hint in hints {
            out.entry(hint.lang.clone())
                .or_default()
                .push((hint.id.clone(), hint.value.clone()));
        }
    }

    if let Some(children) = &node.children {
        for c in children {
            collect_itexts(c, out);
        }
    }
}

pub fn render_itexts(
    writer: &mut Writer<Cursor<Vec<u8>>>,
    itexts: &ITextMap,
) -> quick_xml::Result<()> {
    writer.write_event(Event::Start(BytesStart::new("itext")))?;

    for (lang, entries) in itexts {
        let mut trans = BytesStart::new("translation");
        trans.push_attribute(("lang", lang.as_str()));
        writer.write_event(Event::Start(trans))?;

        for (id, value) in entries {
            let mut text_tag = BytesStart::new("text");
            text_tag.push_attribute(("id", id.as_str()));
            writer.write_event(Event::Start(text_tag))?;

            writer.write_event(Event::Start(BytesStart::new("value")))?;
            writer.write_event(Event::Text(BytesText::new(value.as_str())))?;
            writer.write_event(Event::End(BytesEnd::new("value")))?;

            writer.write_event(Event::End(BytesEnd::new("text")))?;
        }

        writer.write_event(Event::End(BytesEnd::new("translation")))?;
    }

    writer.write_event(Event::End(BytesEnd::new("itext")))?;
    Ok(())
}

// mod tests {

//     use super::*;

//     #[test]
//     fn test_translations() {
//         if std::env::var("RUST_TEST_THREADS").is_err() {
//             std::env::set_var("RUST_TEST_THREADS", "1");
//         }
//         let raw_mock = include_str!("tests/old_fixtures/small_bindTest.json");
//         let mock_data: BodyNode = serde_json::from_str(raw_mock).unwrap();

//         let mut itexts = ITextMap::new();
//         collect_itexts(&mock_data, &mut itexts);
//         println!("\n[Generated Translations]:\n{:?}\n", itexts);

//         assert_eq!(itexts.len(), 2);
//         assert!(itexts.contains_key("en"));
//         assert!(itexts.contains_key("se"));
//         assert_eq!(itexts["en"].len(), 5);
//         assert_eq!(itexts["se"].len(), 6);

//         let mut writer = Writer::new(Cursor::new(Vec::new()));
//         render_itexts(&mut writer, &itexts).unwrap();
//         let result = String::from_utf8(writer.into_inner().into_inner()).unwrap();
//         println!("\n[Generated XML]:\n{}\n", result);
//         assert!(result.contains("<itext>"));
//         assert!(result.contains("<translation lang=\"en\">"));
//         assert!(result.contains("<text id=\"/bp_confirm/inputs:label\">"));
//         // assert!(result.contains("<value>Confirm</value>"));
//         assert!(result.contains("<translation lang=\"se\">"));
//         assert!(result.contains("<text id=\"/bp_confirm/inputs:label\">"));
//         assert!(result.contains("<value>What is the patient&apos;s name?</value>"));
//         ()
//     }
// }

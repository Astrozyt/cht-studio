use quick_xml::{
    events::{BytesStart, Event},
    Writer,
};
use std::io::Cursor;

use crate::types::{Bind, BodyNode};

pub fn collect_binds(node: &BodyNode, out: &mut Vec<Bind>) {
    if let Some(b) = &node.bind {
        // out.push(b.clone());
        let mut extra = b.extra.clone();
        let nodeset = b.nodeset.clone();

        out.push(Bind { nodeset, extra });
    }
    if let Some(children) = &node.children {
        for c in children {
            collect_binds(c, out);
        }
    }
}

pub fn render_bind(writer: &mut Writer<Cursor<Vec<u8>>>, bind: &Bind) -> quick_xml::Result<()> {
    let mut tag = BytesStart::new("bind");
    tag.push_attribute(("nodeset", bind.nodeset.as_str()));

    for (key, value) in &bind.extra {
        let name = if key == "constraintMsg" {
            "jr:constraintMsg"
        } else {
            key.as_str()
        };
        tag.push_attribute((name, value.as_str()));
    }

    writer.write_event(Event::Empty(tag))
}

// #[cfg(test)]
// mod tests {

//     use super::*;

//     #[test]
//     fn test_collect_binds() {
//         if std::env::var("RUST_TEST_THREADS").is_err() {
//             std::env::set_var("RUST_TEST_THREADS", "1");
//         }
//         let raw_mock = include_str!("tests/fixtures/small_bindTest.json");
//         let mock_data: BodyNode = serde_json::from_str(raw_mock).unwrap();
//         let mut binds = Vec::new();
//         collect_binds(&mock_data, &mut binds);
//         println!("\n[Generated XML]:\n{:?}\n", binds);

//         assert_eq!(binds.len(), 5);
//         assert_eq!(binds[2].nodeset, "/bp_confirm/inputs/contact/_id");
//         assert!(binds[2].extra["type"] == "db:person");
//     }
// }

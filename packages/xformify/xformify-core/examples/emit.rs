use std::{env, fs};

// Example: emit an XForm from a JSON description

fn main() {
    let path = env::args()
        .nth(1)
        .expect("usage: cargo run -p xformify-core --example emit <form.json> [xml_id]");
    let xml_id = env::args()
        .nth(2)
        .unwrap_or_else(|| "example_form".to_string());
    let s = fs::read_to_string(path).expect("read");
    let form: xformify_core::Form = serde_json::from_str(&s).expect("parse");
    let xml = xformify_core::json_to_xform(&xml_id, &form).expect("xform");
    println!("{xml}");
}

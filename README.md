# CHT Studio

> [!WARNING]  
> **Work in Progress — Early Open Source Release**  
> CHT Studio is currently under active development as part of an academic Master's thesis.  
> Features, structure, and APIs may change without notice.  
> Contributions, feedback, and curiosity are very welcome — but please expect incomplete functionality and frequent updates.
> Feedback and contributions are warmly welcome!



**A desktop application for building, testing, and managing [Community Health Toolkit](https://communityhealthtoolkit.org/) (CHT) applications locally.**

**No more fumbling with Excel sheets, no more testing JS in production after 'it worked on my machine'**

CHT Studio provides a graphical interface to configure and preview CHT projects without requiring a running CHT server. It’s designed to help developers, researchers, and implementers prototype forms, contacts, and tasks faster — all from their desktop.

---

## Features

* **Project management**

  * Organize multiple CHT projects locally.
* **Graphical Form Builder**

  * Create and test CHT forms visually.
  * Creates forms as **JSON** and **(locally testable) XForm XML**.
* **Base settings editor**

  * Configure [contact types](https://docs.communityhealthtoolkit.org/building/contact-management/contacts/) with create/edit forms.
  * *Work in progress.*
* **Task editor**

  * Define and parse [tasks](https://docs.communityhealthtoolkit.org/building/tasks/) to JavaScript.
  * *Work in progress.*
* **CHT app export**

  * Bundle a ready-to-run CHT app.
  * *Planned feature.*
* **Local testing environment**

  * Simulate and validate full CHT apps offline.
  * *Planned feature.*
* **Git integration**

  * Sync and deploy app versions automatically via Git.

---

## Repository Structure

```
studio/
├── package.json          # Root project definition
├── Cargo.toml            # Rust dependencies for Tauri backend
├── src-tauri/            # Tauri + Rust backend
│   └── src/lib.rs        # Custom Rust commands callable from the frontend
├── src/                  # Vite + React + TypeScript frontend
│   ├── components/
│   ├── pages/
│   └── main.tsx
└── packages/             # Standalone sub-apps used by Studio
    ├── formbuilder/      # CHT form builder
    ├── xform-runner/     # Enketo-based form previewer
    └── others/           # Supporting modules
```

> Each `packages/*` directory is a self-contained application that can also run independently — useful for isolated development and testing.

---

## Contributing

Contributions are **very welcome** — whether documentation, refactoring, or new features.
Please note: **CHT Studio is part of a Master’s Thesis project**, so merge timing and feature priorities might occasionally follow academic milestones.

You can:

* Open **issues** for bugs, ideas, or feedback.
* Create **pull requests** for fixes or enhancements.
* Improve **docs and examples** to help others onboard faster.

A full `CONTRIBUTING.md` with coding and branching guidelines will follow soon.

---

## Local Setup

### Prerequisites

* [Rust](https://rust-lang.org/tools/install) (via `rustup` recommended)
* [Node.js](https://nodejs.org/)
* [pnpm](https://pnpm.io/)

### Installation

```bash
# Clone the repository
git clone https://github.com/Astrozyt/studio
cd cht-studio

# Install dependencies
pnpm install
```

### Development

#### In the project root

```bash
# Run the full Tauri desktop app
pnpm tauri dev

# Run only the frontend in browser mode (limited, no file access)
pnpm dev
```

#### In a sub-package (e.g. /packages/formbuilder)

```bash
pnpm install
pnpm dev
```

Running packages individually is ideal for focused development and faster iteration.

---

## Roadmap

* [ ] Complete contact & task editors
* [ ] Add CHT app export pipeline
* [ ] Enable local simulation & validation
* [ ] Integrate GitOps-based remote deployment
* [ ] Publish Tauri bundles for all platforms

---

## License

*Choose one: MIT / Apache-2.0 / MPL-2.0 — to be added soon.*

---

## Credits

Built with ❤️ by @Astrozyt and contributors.
Inspired by the incredible work of the [Community Health Toolkit](https://communityhealthtoolkit.org/) community.

---

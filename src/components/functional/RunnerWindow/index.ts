import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const RUNNER_WINDOW_LABEL = "runner";

export const openRunner = (xmlToDisplay?: string) => {

    const runnerUrl = import.meta.env.DEV
        ? `${location.origin}/runner/index.html`
        : "app://localhost/runner/index.html";

    const runnerWindow = new WebviewWindow(RUNNER_WINDOW_LABEL, { url: runnerUrl, width: 1100, height: 800, title: "XForm Runner" });
    runnerWindow.once("tauri://created", () => {
        console.log("Runner window created");
    });

    runnerWindow.once("tauri://error", (e) => {
        console.error("Runner window failed to create", e);
    });

    const unlisten = runnerWindow.listen("runner:ready", () => {
        console.log("Runner window is ready");
        unlisten.then((f) => f());
        runnerWindow.emit("runner:load-xform", { id: "1234", mode: "preview", xformXml: xmlToDisplay });
    });
}
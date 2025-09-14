// studio/src/runnerBridge.ts
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

const RUNNER_LABEL = "runner";

function runnerUrl() {
    return import.meta.env.DEV
        ? `${location.origin}/runner/index.html`
        : "app://localhost/runner/index.html";
}

export async function openRunnerWithXform(payload: {
    id?: string;
    xformXml?: string;
    xformJson?: unknown;
    mode?: "preview" | "validate" | "fill";
}) {
    // Reuse window if it exists; otherwise create it
    let win = WebviewWindow.getByLabel(RUNNER_LABEL);
    if (!win) {
        win = new WebviewWindow(RUNNER_LABEL, {
            url: runnerUrl(),
            width: 1100,
            height: 800,
            title: "XForm Runner",
            resizable: true,
        });
        if (import.meta.env.DEV) win.openDevtools();
    }

    // Wait for the runner's "ready" once, then send the payload
    const unlisten = await win.listen("runner:ready", async () => {
        unlisten();
        await win!.emit("runner:load-xform", payload);
    });

    // Safety net: if we missed "ready" (window already mounted), send after a short delay
    setTimeout(() => win!.emit("runner:load-xform", payload), 1200);
}

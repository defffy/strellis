import { LitElement, unsafeCSS, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import styles from "./strellis-controls.scss?inline";
import type { StrellisEditor } from "../strellis-editor/strellis-editor";

const TEMPLATE_OPTIONS = [{ name: "default", href: "/" }];

/**
 * The controls component for Strellis editor.
 */
@customElement("strellis-controls")
export class StrellisControls extends LitElement {
  static styles = unsafeCSS(styles);

  @property()
  strudelRepl: any | null = null;

  @state()
  playState: "running" | "stopped" = "stopped";

  async connectedCallback() {
    super.connectedCallback();
    // Listen for key events to trigger run and stop actions
    window.addEventListener("keydown", async (e: KeyboardEvent) => {
      // Ctrl+Enter to run code
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        await this._handlePlayState();
      }

      // Ctrl+S to stop code
      // TODO: Pick a better keybinding that doesn't conflict with browser shortcuts
      // or codemirror's default keybindings
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        this._handleToggleSettingsPanel();
      }
    });
  }

  async _handleRun() {
    this._handleStop(); // Stop any running code before starting new execution

    const editors = document.querySelectorAll("strellis-editor");
    let entryPointHTML = "";

    // First, find and process the HTML file to get the base template
    for (const strellisEditor of editors) {
      const filename = strellisEditor.getAttribute("filename");
      if (filename === "index.html") {
        entryPointHTML = strellisEditor.getValue();
        break;
      }
    }

    // Then process all other files to inject their content
    for (const strellisEditor of editors) {
      const filename = strellisEditor.getAttribute("filename");
      const language = strellisEditor.getAttribute("language");

      if (filename === "strudel.js") {
        await this._handleExecuteStrudelCode();
        continue;
      }

      if (language === "javascript") {
        const jsContent = strellisEditor.getValue();
        // Check if the JavaScript code contains import statements (ES modules)
        const hasImports = /^\s*import\s+/m.test(jsContent);
        const scriptTag = hasImports
          ? `<script type="module">${jsContent}</script>`
          : `<script>${jsContent}</script>`;

        entryPointHTML = entryPointHTML.replace(
          `<script src="${filename}"></script>`,
          scriptTag,
        );
      }

      if (language === "css") {
        entryPointHTML = entryPointHTML.replace(
          `<link rel="stylesheet" href="${filename}">`,
          `<style>${strellisEditor.getValue()}</style>`,
        );
      }
    }

    this.dispatchEvent(
      new CustomEvent("run-code", {
        detail: { html: entryPointHTML },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleStop() {
    this.dispatchEvent(
      new CustomEvent("stop-code", { bubbles: true, composed: true }),
    );
    this._disconnectStrudel();
  }

  _handlePlayState() {
    if (this.playState === "stopped") {
      this._handleRun();
      this.playState = "running";
    } else if (this.playState === "running") {
      this._handleStop();
      this.playState = "stopped";
    }
  }

  async _handleExecuteStrudelCode() {
    // Function to execute Strudel code from editor
    const strudelEditor = document.querySelector(
      'strellis-editor[filename="strudel.js"]',
    ) as StrellisEditor;

    if (strudelEditor && strudelEditor.editor) {
      const code = strudelEditor.getValue();
      try {
        const existingRepl = document.querySelector("strudel-editor");

        if (existingRepl) {
          this.strudelRepl = existingRepl as HTMLElement;
        } else {
          this.strudelRepl = document.createElement("strudel-editor");
          document.body.appendChild(this.strudelRepl);
        }

        // this.strudelRepl.setAttribute('code', code)
        this.strudelRepl.editor.setCode(code);
        await this.strudelRepl.editor.evaluate(code);
      } catch (error) {
        console.error("Strudel execution error:", error);
      }
    }
  }

  _disconnectStrudel() {
    if (this.strudelRepl) {
      this.strudelRepl.editor.stop();
      this.strudelRepl.removeAttribute("code");
    }
  }

  _handleToggleSettingsPanel() {
    this.dispatchEvent(
      new CustomEvent("toggle-settings-panel", {
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="container">
        <div class="container__branding">
          <h1>Strellis Live</h1>
        </div>
        <div class="container__buttons">
          <button @click=${this._handlePlayState}>
            ${this.playState === "stopped"
              ? "Run (CTRL + Enter)"
              : "Stop (CTRL + s)"}
          </button>
          <button @click=${this._handleToggleSettingsPanel}>
            Settings(CTRL + /)
          </button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "strellis-controls": StrellisControls;
  }
}

declare global {
  function initStrudel(): Promise<void> | void;
  function hush(): void;
}

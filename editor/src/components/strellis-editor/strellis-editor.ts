import { LitElement, unsafeCSS, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import styles from "./strellis-editor.scss?inline";
import { minimalSetup } from "codemirror";
import { lineNumbers, EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";

/**
 * Text editor
 */
@customElement("strellis-editor")
export class StrellisEditor extends LitElement {
  static styles = unsafeCSS(styles);

  @property()
  editor!: monaco.editor.IStandaloneCodeEditor;

  @property({ type: String, reflect: true })
  language: string = "javascript";

  @property({ type: String, reflect: true, attribute: "default-value" })
  defaultValue: string = "";

  @query(".monaco-container")
  container!: HTMLDivElement;

  @property({ type: Boolean, reflect: true })
  selected: boolean = false;

  @query(".vim-status-container")
  vimStatusBar!: HTMLDivElement;

  @state()
  vimModeEnabled: boolean = false;

  @state()
  vimMode!: VimAdapterInstance;

  connectedCallback() {
    super.connectedCallback();

    // Set initial selected state based on attribute
    if (
      this.getAttribute("selected") === "true" ||
      this.getAttribute("selected") === ""
    ) {
      this._setHiddenStyles(false);
    } else {
      this._setHiddenStyles(true);
    }

    window.addEventListener("toggle-vim-mode", () => {
      this.vimModeEnabled = !this.vimModeEnabled;
      this._setVimMode();
      console.log(`Vim mode ${this.vimModeEnabled ? "enabled" : "disabled"}`);
    });

    window.addEventListener("sidebar-file-selected", (e: Event) => {
      const customEvent = e as CustomEvent;
      const filename = customEvent.detail.filename;

      if (filename === this.getAttribute("filename")) {
        this._setHiddenStyles(false);
      } else {
        this._setHiddenStyles(true);
      }
    });
  }

  firstUpdated() {
    this.editor = new EditorView({
      doc: this.defaultValue,
      extensions: [minimalSetup, lineNumbers(), javascript()],
      parent: this.container,
    });

    console.log(this.editor);

    this._setVimMode();
  }

  _setVimMode() {
    if (this.vimModeEnabled) {
      this.vimMode = initVimMode(this.editor, this.vimStatusBar);
    } else if (!this.vimModeEnabled && this.vimMode) {
      this.vimMode.dispose();
      this.vimStatusBar.innerHTML = "";
    }
  }

  _setHiddenStyles(hidden: boolean) {
    if (hidden) {
      this.style.setProperty("z-index", "-1");
      this.style.setProperty("visibility", "hidden");
      this.style.setProperty("opacity", "0");
    } else {
      this.style.setProperty("z-index", "10");
      this.style.setProperty("visibility", "visible");
      this.style.setProperty("opacity", "1");
    }
  }

  public getValue() {
    return this.editor.state.doc.toString();
  }

  public editorValue() {
    return this.editor.getValue();
  }

  render() {
    return html`
      <div class="monaco-container"></div>
      <div class="vim-status-container"></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "strellis-editor": StrellisEditor;
  }
}

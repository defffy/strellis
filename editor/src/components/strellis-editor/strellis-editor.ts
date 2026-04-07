import { LitElement, unsafeCSS, html } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import styles from "./strellis-editor.scss?inline";
import { minimalSetup } from "codemirror";
import { Compartment } from "@codemirror/state";
import { lineNumbers, EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { vim } from "@replit/codemirror-vim";

/**
 * Text editor
 */
@customElement("strellis-editor")
export class StrellisEditor extends LitElement {
  static styles = unsafeCSS(styles);

  @property()
  editor!: EditorView;

  @property({ type: String, reflect: true })
  language: string = "javascript";

  @property({ type: String, reflect: true, attribute: "default-value" })
  defaultValue: string = "";

  @query(".editor-container")
  container!: HTMLDivElement;

  @property({ type: Boolean, reflect: true })
  selected: boolean = false;

  @state()
  vimModeEnabled: boolean = localStorage.getItem("strellis-vim-mode") !== null
    ? localStorage.getItem("strellis-vim-mode") === "true"
    : true;

  @state()
  vimCompartment!: Compartment;

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

    this.vimCompartment = new Compartment();
  }

  firstUpdated() {
    this.editor = new EditorView({
      doc: this.defaultValue,
      extensions: [
        minimalSetup,
        lineNumbers(),
        this.vimCompartment.of([]),
        javascript(),
      ],
      parent: this.container,
    });

    this._setVimMode();
  }

  _setVimMode() {
    if (this.vimModeEnabled) {
      this.editor.dispatch({
        effects: this.vimCompartment.reconfigure(vim({ status: true })),
      });
    } else if (!this.vimModeEnabled) {
      this.editor.dispatch({
        effects: this.vimCompartment.reconfigure([]),
      });
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

  render() {
    return html` <div class="editor-container"></div> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "strellis-editor": StrellisEditor;
  }
}

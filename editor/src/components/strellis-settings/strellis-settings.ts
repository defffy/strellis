import { LitElement, unsafeCSS, html } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import styles from "./strellis-settings.scss?inline";
import type { StrellisEditor } from "../strellis-editor/strellis-editor";

const TEMPLATE_OPTIONS = [{ name: "default", href: "/" }];

/**
 * The controls component for Strellis editor.
 */
@customElement("strellis-settings")
export class StrellisSettings extends LitElement {
  static styles = unsafeCSS(styles);

  @state()
  vimModeEnabled = true;

  @state()
  sidebarEnabled = false;

  @property()
  strudelRepl: any | null = null;

  async connectedCallback() {
    super.connectedCallback();
    // Listen for key events to trigger run and stop actions
    window.addEventListener("keydown", async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "V") {
        e.preventDefault();
        this._handleToggleVim();
      }

      if (e.ctrlKey && e.key === "B") {
        e.preventDefault();
        this._handleToggleSidebar();
      }
    });
  }

  _handleToggleVim() {
    const toggleVimModeEvent = new CustomEvent("toggle-vim-mode", {
      bubbles: true,
      composed: true,
    });
    this.vimModeEnabled = !this.vimModeEnabled;
    this.dispatchEvent(toggleVimModeEvent);
  }

  _handleToggleSidebar() {
    const toggleSidebarEvent = new CustomEvent("toggle-sidebar", {
      bubbles: true,
      composed: true,
    });
    this.sidebarEnabled = !this.sidebarEnabled;
    this.dispatchEvent(toggleSidebarEvent);
  }

  _handleChooseTemplate(e: Event) {
    const url = (e.target as HTMLSelectElement).value;

    const BASE_URL = window.location.origin + "/strellis/";

    if (url) {
      window.location.href = `${BASE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    }
  }

  render() {
    return html`
      <div class="container">
        <button @click=${this._handleToggleSidebar}>
          ${this.sidebarEnabled ? "Hide" : "Show"} sidebar (CTRL + SHIFT + b)
        </button>
        <button @click=${this._handleToggleVim}>
          ${this.vimModeEnabled ? "Disable" : "Enable"} Vim Mode (CTRL + SHIFT +
          v)
        </button>
        <div class="template-selector-container">
          <button popovertarget="select-template">Select Template</button>
          <div
            id="select-template"
            class="template-selector-container__modal"
            popover
          >
            <h3>Choose a template:</h3>
            <div class="template-selector-container__modal__options">
              ${TEMPLATE_OPTIONS.map(
                (option) =>
                  html`<a href="/strellis${option.href}">${option.name}</a>`,
              )}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "strellis-settings": StrellisSettings;
  }
}

declare global {
  function initStrudel(): Promise<void> | void;
  function hush(): void;
}

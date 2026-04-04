import { LitElement, unsafeCSS, html } from "lit";
import { customElement, state, property, query } from "lit/decorators.js";
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

  @query("#toggle-sidebar")
  toggleSidebarCheckbox!: HTMLInputElement;

  @query("#toggle-vim")
  toggleVimCheckbox!: HTMLInputElement;

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
    this.toggleVimCheckbox.checked = this.vimModeEnabled;
    this.dispatchEvent(toggleVimModeEvent);
  }

  _handleToggleSidebar() {
    const toggleSidebarEvent = new CustomEvent("toggle-sidebar", {
      bubbles: true,
      composed: true,
    });
    this.sidebarEnabled = !this.sidebarEnabled;
    this.toggleSidebarCheckbox.checked = this.sidebarEnabled;
    this.dispatchEvent(toggleSidebarEvent);
  }

  _handleChooseTemplate(e: Event) {
    const url = (e.target as HTMLSelectElement).value;

    const BASE_URL = window.location.origin + "/strellis/";

    if (url) {
      window.location.href = `${BASE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    }
  }

  _handleCloseSettings() {
    const toggleSettingsPanelEvent = new CustomEvent("toggle-settings-panel", {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(toggleSettingsPanelEvent);
  }

  _chooseTemplate(e: Event) {
    const url = (e.target as HTMLSelectElement).value;

    const BASE_URL = window.location.origin;

    if (url) {
      window.location.href = `${BASE_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
    }
  }

  render() {
    return html`
      <div class="container">
        <button @click="${this._handleCloseSettings}">Close Settings</button>

        <div class="container__checkbox-group">
          <input
            type="checkbox"
            id="toggle-sidebar"
            name="toggle-sidebar"
            @change=${this._handleToggleSidebar}
          />
          <label for="toggle-sidebar"> Show sidebar (CTRL + SHIFT + b) </label>
        </div>

        <div class="container__checkbox-group">
          <input
            type="checkbox"
            id="toggle-vim"
            name="toggle-vim"
            @change=${this._handleToggleVim}
          />
          <label for="toggle-vim"> Enable Vim Mode (CTRL + SHIFT + v) </label>
        </div>

        <div class="template-selector-container">
          <h3>Choose a template:</h3>
          <select
            class="template-selector-container__modal__options"
            @change=${this._chooseTemplate}
          >
            ${TEMPLATE_OPTIONS.map(
              (option) =>
                html`<option value="/strellis${option.href}">
                  ${option.name}
                </option>`,
            )}
          </select>
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

import { LitElement, unsafeCSS, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./strellis-provider.scss?inline";

/**
 * A provider component for Strellis editor.
 */
@customElement("strellis-provider")
export class StrellisProvider extends LitElement {
  static styles = unsafeCSS(styles);

  @state()
  sidebarVisible = true;

  @state()
  settingsPanelVisible = false;

  connectedCallback(): void {
    super.connectedCallback();

    // Listen for custom events to toggle sidebar visibility
    this.addEventListener("toggle-sidebar", () => {
      this.sidebarVisible = !this.sidebarVisible;
    });

    this.addEventListener("toggle-settings-panel", () => {
      this.settingsPanelVisible = !this.settingsPanelVisible;
    });

    window.addEventListener("STRUDEL_EVENT", ((event: CustomEvent) => {
      const displayIframe = document?.querySelector("iframe");

      const { val, eventName } = event.detail;

      displayIframe?.contentWindow?.postMessage(
        { type: "STRUDEL_EVENT", value: val, eventName },
        "*",
      );
    }) as EventListener);
  }

  render() {
    return html`
      <div
        class=${classMap({
          container: true,
          "container--hide-sidebar": !this.sidebarVisible,
        })}
      >
        <div class="container__top">
          <slot name="controls"></slot>
        </div>

        <div
          class=${classMap({
            container__settings: true,
            "container__settings--visible": this.settingsPanelVisible,
          })}
        >
          <slot name="settings"></slot>
        </div>

        <div class="container__editor">
          <slot name="sidebar"></slot>

          <div class="container__editor-wrapper">
            <div class="container__editor-wrapper__editors">
              <slot name="editor"></slot>
            </div>
          </div>
        </div>

        <div class="container__display-panel">
          <slot name="display-panel"></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "strellis-provider": StrellisProvider;
  }
}

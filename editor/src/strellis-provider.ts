import { LitElement, unsafeCSS, html } from 'lit'
import { customElement, state} from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js';
import styles from './strellis-provider.scss?inline'

/**
 * A provider component for Strellis editor.
 */
@customElement('strellis-provider')
export class StrellisProvider extends LitElement {

  static styles = unsafeCSS(styles);

  @state()
  sidebarVisible = false;

  connectedCallback(): void {
    super.connectedCallback();
    
    // Listen for custom events to toggle sidebar visibility
    this.addEventListener('toggle-sidebar', () => {
      this.sidebarVisible = !this.sidebarVisible;
    });
  }

  render() {
    return html`
      <div class=${classMap({ container: true, 'container--hide-sidebar': !this.sidebarVisible })}>
        <div class="container__top">
          <slot name="controls"></slot>
        </div>

        <div class="container__editor">
          <slot name="sidebar"></slot>

          <div class="container__display-wrapper">
            <div class="container__display-wrapper_editors">
              <slot name="editor"></slot>
            </div>
            <slot name="display-panel"></slot>
          </div>
        </div>

        <div class="container__bottom">
          <slot name="console"></slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strellis-provider': StrellisProvider 
  }
}

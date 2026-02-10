import { LitElement, unsafeCSS, html } from 'lit'
import { customElement} from 'lit/decorators.js'
import styles from './strellis-provider.scss?inline'

/**
 * A provider component for Strellis editor.
 */
@customElement('strellis-provider')
export class StrellisProvider extends LitElement {

  static styles = unsafeCSS(styles);

  render() {
    return html`
      <div class="container">
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

        <!--
        <div class="container__bottom">
          <slot name="console"></slot>
        </div>
      </div>
      -->
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strellis-provider': StrellisProvider 
  }
}

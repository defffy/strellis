 import { LitElement, unsafeCSS, html } from 'lit'
import { customElement} from 'lit/decorators.js'
import styles from './strellis-controls.scss?inline'

/**
 * The controls component for Strellis editor. 
 */
@customElement('strellis-controls')
export class StrellisControls extends LitElement {

  static styles = unsafeCSS(styles);

  render() {
    return html`
      <div class="container">
      Controls
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strellis-controls': StrellisControls 
  }
}

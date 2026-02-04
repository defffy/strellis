import { LitElement, unsafeCSS, html } from 'lit'
import { customElement} from 'lit/decorators.js'
import styles from './strellis-console.scss?inline'

/**
 * The console component for Strellis editor. 
 */
@customElement('strellis-console')
export class StrellisConsole extends LitElement {

  static styles = unsafeCSS(styles);

  render() {
    return html`
      <div class="container">
      Console
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strellis-console': StrellisConsole 
  }
}

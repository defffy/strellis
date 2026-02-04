import { LitElement, unsafeCSS, html } from 'lit'
import { customElement} from 'lit/decorators.js'
import styles from './strellis-sidebar.scss?inline'

/**
 * The sidebar component for Strellis editor. 
 */
@customElement('strellis-sidebar')
export class StrellisSidebar extends LitElement {

  static styles = unsafeCSS(styles);

  render() {
    return html`
    <div>This is a sidebar</div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strellis-sidebar': StrellisSidebar 
  }
}

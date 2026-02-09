import { LitElement, unsafeCSS, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import styles from './strellis-display-panel.scss?inline'

/**
 * The live-code display panel for Strellis editor. 
 */
@customElement('strellis-display-panel')
export class StrellisDisplayPanel extends LitElement {

   static styles = unsafeCSS(styles);

   render() {
      return html`
      <div class="container">
         <iframe 
         id="display"
         srcdoc="..." 
         allow="midi" 
         sandbox="allow-scripts">
         </iframe>
      </div>
    `
   }
}

declare global {
   interface HTMLElementTagNameMap {
      'strellis-display-panel': StrellisDisplayPanel
   }
}

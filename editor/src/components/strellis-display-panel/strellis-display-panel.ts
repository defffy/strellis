import { LitElement, unsafeCSS, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import styles from './strellis-display-panel.scss?inline'

/**
 * The live-code display panel for Strellis editor. 
 */
@customElement('strellis-display-panel')
export class StrellisDisplayPanel extends LitElement {

   static styles = unsafeCSS(styles);

   @property({ type: String, reflect: true })
   srcDoc!: string;



   connectedCallback(): void {
      super.connectedCallback()
      
      // Listen for 'run-code' event to update the iframe content
      window.addEventListener('run-code', (event: Event) => {
         const iframe = this.shadowRoot?.getElementById('display') as HTMLIFrameElement
         const customEvent = event as CustomEvent

         console.log(customEvent.detail)

         if (iframe) {
            this.srcDoc = customEvent.detail.html
         }
      })
   }

   render() {
      return html`
      <div class="container">
         <iframe 
         id="display"
         srcdoc=${this.srcDoc} 
         allow="midi; accelerometer; gyroscope; magnetometer" 
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

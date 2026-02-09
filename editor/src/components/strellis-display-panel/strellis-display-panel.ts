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

         if (iframe) {
            this.srcDoc = customEvent.detail.html
         }

         // Update the iframe's srcdoc to trigger a re-render with the new content
         if (iframe) {
            iframe.srcdoc = this.srcDoc
         }
      })

      // Listen for 'stop-code' event to clear the iframe content
      window.addEventListener('stop-code', () => {
         const iframe = this.shadowRoot?.getElementById('display') as HTMLIFrameElement

         if (iframe) {
            this.srcDoc = ''
            iframe.srcdoc = this.srcDoc
         }
      })
   }

   render() {
      return html`
      <div class="container">
         <iframe 
         id="display"
         frameborder="0"
         allow="midi; accelerometer; gyroscope; magnetometer" 
         sandbox="allow-scripts allow-modals allow-pointer-lock">
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

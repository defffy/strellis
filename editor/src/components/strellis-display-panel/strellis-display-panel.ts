import { LitElement, unsafeCSS, html, type PropertyValues } from 'lit'
import { customElement, property, queryAssignedNodes } from 'lit/decorators.js'
import styles from './strellis-display-panel.scss?inline'

/**
 * The live-code display panel for Strellis editor. 
 */
@customElement('strellis-display-panel')
export class StrellisDisplayPanel extends LitElement {

   static styles = unsafeCSS(styles);

   @property({ type: String, reflect: true })
   srcDoc!: string;

   @property()
   iframe!: HTMLIFrameElement;

   @queryAssignedNodes({ slot: 'display' })
   private displayElements!: HTMLElement[];

   protected firstUpdated(_changedProperties: PropertyValues): void {
      this.iframe = this.displayElements.find(el => el.tagName.toLowerCase() === 'iframe') as HTMLIFrameElement

      if (this.iframe) {
         this.srcDoc = ''
         this.iframe.srcdoc = this.srcDoc
      }

      // Listen for 'run-code' event to update the iframe content
      window.addEventListener('run-code', (event: Event) => {
         const customEvent = event as CustomEvent

         // Update the iframe's srcdoc to trigger a re-render with the new content
         if (this.iframe) {
            this.srcDoc = customEvent.detail.html
            this.iframe.srcdoc = this.srcDoc
         }
      })

      // Listen for 'stop-code' event to clear the iframe content
      window.addEventListener('stop-code', () => {
         if (this.iframe) {
            this.srcDoc = ''
            this.iframe.srcdoc = this.srcDoc
         }
      })

   }

   render() {
      return html`
      <div class="container">
         <slot name="display"></slot>
      </div>
    `
   }
}

declare global {
   interface HTMLElementTagNameMap {
      'strellis-display-panel': StrellisDisplayPanel
   }
}

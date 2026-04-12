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
            this.srcDoc =  this._generateIframeSrcDoc(customEvent.detail.html);
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

   private _generateIframeSrcDoc(html: string) {
      // Add this string at the end of the body tag in the provided HTML to capture console logs
      const logCaptureScript = `<script>
  (function() {
    const methods = ['log', 'debug', 'info', 'warn', 'error'];
    methods.forEach(method => {
      const original = console[method];
      console[method] = function(...args) {
        // Send to parent via postMessage
        window.parent.postMessage({
          type: 'SANDBOX_LOG',
          level: method,
          content: args.map(arg => {
             try { 
               return typeof arg === 'object' ? JSON.stringify(arg) : String(arg); 
             } catch(e) { return "[Unserializable Object]"; }
          })
        }, '*'); // '*' is required because the sandbox origin is 'null'
        
        original.apply(console, args);
      };
    });

    // Also catch global errors
    window.onerror = (msg, url, line, col) => {
      window.parent.postMessage({ type: 'SANDBOX_ERROR', msg, line, col }, '*');
    };
  })();
</script>`

         return html.replace('</body>', `${logCaptureScript}</body>`)

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

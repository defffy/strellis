import { LitElement, unsafeCSS, html } from 'lit'
import { customElement, query} from 'lit/decorators.js'
import styles from './strellis-console.scss?inline'

/**
 * The console component for Strellis editor. 
 */
@customElement('strellis-console')
export class StrellisConsole extends LitElement {

  static styles = unsafeCSS(styles);

   @query('.container')
   container!: HTMLDivElement;

   firstUpdated() {
      // Listen for 'iframe-log' events to display logs in the console
      window.addEventListener('message', (event: MessageEvent) => {
         const isAtBottom = this.container.scrollHeight - this.container.clientHeight <= this.container.scrollTop + 5;

         const {data} = event

         if(data.type !== 'SANDBOX_LOG') return;

         // Create a new log entry element and append it to the console
         const logEntry = document.createElement('div')
         logEntry.className = 'console__log-entry'
         logEntry.textContent = data.content; 
         this.shadowRoot?.querySelector('.container')?.appendChild(logEntry)



         if (isAtBottom) {
        this.container.scrollTop = this.container.scrollHeight;
    }
      })
   }

  render() {
    return html`
      <div class="container">
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strellis-console': StrellisConsole 
  }
}

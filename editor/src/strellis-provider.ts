import { LitElement, unsafeCSS, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js';
import styles from './strellis-provider.scss?inline'

/**
 * A provider component for Strellis editor.
 */
@customElement('strellis-provider')
export class StrellisProvider extends LitElement {

   static styles = unsafeCSS(styles);

   @state()
   sidebarVisible = true;

   connectedCallback(): void {
      super.connectedCallback();

      // Listen for custom events to toggle sidebar visibility
      this.addEventListener('toggle-sidebar', () => {
         this.sidebarVisible = !this.sidebarVisible;
      });

      window.addEventListener('STRUDEL_EVENT', (event: Event) => {
         const customEvent = event as CustomEvent;

         const iframe = document.body.querySelector("iframe") as HTMLIFrameElement;

         if (iframe) {
            const postMessageData = { type: 'STRUDEL_EVENT', val: customEvent.detail };
            iframe.contentWindow?.postMessage(postMessageData, '*');
         }
      })
   }

   render() {
      return html`
      <div class=${classMap({ container: true, 'container--hide-sidebar': !this.sidebarVisible })}>
        <div class="container__top">
          <slot name="controls"></slot>
        </div>

        <div class="container__editor">
          <slot name="sidebar"></slot>

          <div class="container__editor-wrapper">
            <div class="container__editor-wrapper__editors">
              <slot name="editor"></slot>
            </div>

            <div class="container__editor-wrapper__console">
               <slot name="console"></slot>
            </div>
          </div>

        </div>


         <div class="container__display-panel">
           <slot name="display-panel"></slot>
         </div>
      </div>
    `
   }
}

declare global {
   interface HTMLElementTagNameMap {
      'strellis-provider': StrellisProvider
   }
}

import { LitElement, unsafeCSS, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import styles from './strellis-controls.scss?inline'
import type { StrellisEditor } from '../strellis-editor/strellis-editor';

const TEMPLATE_OPTIONS = [
   { name: 'default', href: '/' },
   { name: 'p5', href: '/p5' }
]

/**
 * The controls component for Strellis editor. 
 */
@customElement('strellis-controls')
export class StrellisControls extends LitElement {

   static styles = unsafeCSS(styles);

   private strudelInitialized = false;

   @state()
   vimModeEnabled = false;

   @state()
   sidebarEnabled = false;

   async connectedCallback() {
      super.connectedCallback()
      // Listen for key events to trigger run and stop actions
      window.addEventListener('keydown', async (e: KeyboardEvent) => {
         // Ctrl+Enter to run code
         if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault()
            await this._handleRun()
         }

         // Ctrl+S to stop code
         if (e.ctrlKey && e.key === 's') {
            e.preventDefault()
            this._handleStop()
         }

         if (e.ctrlKey && e.key === 'V') {
            e.preventDefault()
            this._handleToggleVim()
         }

         if (e.ctrlKey && e.key === 'B') {
            e.preventDefault()
            this._handleToggleSidebar()
         }
      })
   }

   async _handleRun() {
      this._handleStop() // Stop any running code before starting new execution

      const editors = document.querySelectorAll('strellis-editor')
      let entryPointHTML = ''

      // First, find and process the HTML file to get the base template
      for (const strellisEditor of editors) {
         const filename = strellisEditor.getAttribute('filename')
         if (filename === 'index.html') {
            entryPointHTML = strellisEditor.editor.getValue()
            break
         }
      }

      // Then process all other files to inject their content
      for (const strellisEditor of editors) {
         const filename = strellisEditor.getAttribute('filename')
         const language = strellisEditor.getAttribute('language')

         if (filename === 'strudel.js') {
            await this._handleExecuteStrudelCode();
            continue;
         }

         if (language === 'javascript') {
            const jsContent = strellisEditor.editor.getValue()
            // Check if the JavaScript code contains import statements (ES modules)
            const hasImports = /^\s*import\s+/m.test(jsContent)
            const scriptTag = hasImports
               ? `<script type="module">${jsContent}</script>`
               : `<script>${jsContent}</script>`

            entryPointHTML = entryPointHTML.replace(
               `<script src="${filename}"></script>`,
               scriptTag
            )
         }

         if (language === 'css') {
            entryPointHTML = entryPointHTML.replace(
               `<link rel="stylesheet" href="${filename}">`,
               `<style>${strellisEditor.editor.getValue()}</style>`
            )
         }
      }

      this.dispatchEvent(new CustomEvent('run-code', { detail: { html: entryPointHTML }, bubbles: true, composed: true }))
   }

   _handleStop() {
      this.dispatchEvent(new CustomEvent('stop-code', { bubbles: true, composed: true }))
      if (this.strudelInitialized) {

         hush();
      }
   }

   async _handleExecuteStrudelCode() {
      // Initialize Strudel on main thread if not already done
      if (!this.strudelInitialized) {
         try {
            await initStrudel();

            // Wait for Strudel globals to be available
            await this._waitForStrudelGlobals();

            this.strudelInitialized = true;
            console.log('Strudel initialized successfully');
         } catch (error) {
            console.error('Error initializing Strudel:', error);
            return;
         }
      }

      // Function to execute Strudel code from editor
      const strudelEditor = document.querySelector('strellis-editor[filename="strudel.js"]') as StrellisEditor;

      if (strudelEditor && strudelEditor.editor) {
         const code = strudelEditor.editor.getValue();
         try {
            eval(code);
         } catch (error) {
            console.error('Strudel execution error:', error);
         }
      }
   }

   private async _waitForStrudelGlobals() {
      // Wait for Strudel globals to be available
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max

      while (attempts < maxAttempts) {
         if (typeof (window as any).note !== 'undefined') {
            console.log('Strudel globals are ready');
            return;
         }

         await new Promise(resolve => setTimeout(resolve, 100));
         attempts++;
      }

      throw new Error('Strudel globals not available after initialization');
   }

   _handleToggleVim() {
      const toggleVimModeEvent = new CustomEvent('toggle-vim-mode', { bubbles: true, composed: true });
      this.vimModeEnabled = !this.vimModeEnabled;
      this.dispatchEvent(toggleVimModeEvent);
   }

   _handleToggleSidebar() {
      const toggleSidebarEvent = new CustomEvent('toggle-sidebar', { bubbles: true, composed: true });
      this.sidebarEnabled = !this.sidebarEnabled;
      this.dispatchEvent(toggleSidebarEvent);
   }

   _handleChooseTemplate(e: Event) {
      const url = (e.target as HTMLSelectElement).value;

      const BASE_URL = window.location.origin + "/strellis/";



      if (url) {
         window.location.href = `${BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
      }
   }

   render() {
      return html`
      <div class="container">
         <button @click=${this._handleRun}>Run (CTRL + Enter)</button>
         <button @click=${this._handleStop}>Stop (CTRL + s)</button>
         <button @click=${this._handleToggleSidebar}>${this.sidebarEnabled ? 'Hide' : 'Show'} sidebar (CTRL + SHIFT + b)</button>
         <button @click=${this._handleToggleVim}>${this.vimModeEnabled ? 'Disable' : 'Enable'} Vim Mode (CTRL + SHIFT + v)</button>
         <div class="template-selector-container">
            <button popovertarget="select-template">Select Template</button>
            <div id="select-template" class="template-selector-container__modal" popover>
               <h3>Choose a template:</h3>
               <div class="template-selector-container__modal__options">
                  ${TEMPLATE_OPTIONS.map(option => html`<a href="/strellis${option.href}">${option.name}</a>`)}
               </div>
            </div>
         </div>
      </div>
    `
   }
}

declare global {
   interface HTMLElementTagNameMap {
      'strellis-controls': StrellisControls
   }
}

declare global {
   function initStrudel(): Promise<void> | void;
   function hush(): void;
}

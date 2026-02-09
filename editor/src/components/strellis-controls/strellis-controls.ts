import { LitElement, unsafeCSS, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import styles from './strellis-controls.scss?inline'

/**
 * The controls component for Strellis editor. 
 */
@customElement('strellis-controls')
export class StrellisControls extends LitElement {

  static styles = unsafeCSS(styles);

   connectedCallback() {
      super.connectedCallback()
      // Listen for key events to trigger run and stop actions
      window.addEventListener('keydown', (e: KeyboardEvent) => {
         // Ctrl+Enter to run code
         if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault()
            this._handleRun()
         }

         // Ctrl+S to stop code
         if (e.ctrlKey && e.key === 's') {
            e.preventDefault()
            this._handleStop()
         }
      })
   }

  _handleRun() {
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

      if (language === 'javascript') {
        entryPointHTML = entryPointHTML.replace(
          `<script src="${filename}"></script>`,
          `<script>${strellisEditor.editor.getValue()}</script>`
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
      this.dispatchEvent(new CustomEvent('stop-code', {bubbles: true, composed: true }))
   }

  render() {
    return html`
      <div class="container">
         <button @click=${this._handleRun}>Run (CTRL + Enter)</button>
      <button @click=${this._handleStop}>Stop (CTRL + s)</button>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strellis-controls': StrellisControls
  }
}

import { LitElement, unsafeCSS, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import styles from './strellis-controls.scss?inline'
import type { StrellisEditor } from '../strellis-editor/strellis-editor';

/**
 * The controls component for Strellis editor. 
 */
@customElement('strellis-controls')
export class StrellisControls extends LitElement {

  static styles = unsafeCSS(styles);

  private strudelInitialized = false;

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
        this._handleExecuteStrudelCode();
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

declare global {
  function initStrudel(): Promise<void> | void;
  function hush(): void;
}
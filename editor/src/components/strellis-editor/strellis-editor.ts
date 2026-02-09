import { LitElement, unsafeCSS, html } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import styles from './strellis-editor.scss?inline'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import monacoStyles from 'monaco-editor/min/vs/editor/editor.main.css?inline';

self.MonacoEnvironment = {
   getWorker(_, label) {
      if (label === 'json') return new jsonWorker()
      if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker()
      if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker()
      if (label === 'typescript' || label === 'javascript') return new tsWorker()
      return new editorWorker()
   }
}

/**
 * Text editor  
 */
@customElement('strellis-editor')
export class StrellisEditor extends LitElement {
   static styles = unsafeCSS(monacoStyles + styles);

   @query('.container')
   container!: HTMLDivElement

   @property()
   moncao: typeof monaco | null = null


   @property({ type: String, reflect: true })
   language: string = 'javascript'


   connectedCallback() {
      super.connectedCallback()

      this.monaco.editor.defineTheme('transparent-theme', {
         base: 'vs-dark', // or 'vs' for light mode
         inherit: true,   // inherit existing syntax highlighting
         rules: [],
         colors: {
            'editor.background': '#00000000', // Fully transparent
            'editor.lineHighlightBackground': '#00000020', // Subtle highlight for the current line
         }
      });

   }

   firstUpdated() {
      this.editor = monaco.editor.create(this.container, {
         value: "// Start coding...",
         language: this.language,
         theme: 'transparent-theme',
         automaticLayout: true,
         minimap: {
            enabled: false
         }
      })

   }


   _handleInput(e: InputEvent) {
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
      'strellis-editor': StrellisEditor
   }
}

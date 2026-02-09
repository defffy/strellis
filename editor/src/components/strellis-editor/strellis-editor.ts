import { LitElement, unsafeCSS, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import {classMap} from 'lit/directives/class-map.js'
import styles from './strellis-editor.scss?inline'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import monacoStyles from 'monaco-editor/min/vs/editor/editor.main.css?inline';
import { initVimMode, type VimAdapterInstance } from "monaco-vim";


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

   @property()
   editor!: monaco.editor.IStandaloneCodeEditor;

   @property({ type: String, reflect: true })
   language: string = 'javascript'

   @property({ type: String, reflect: true, attribute: 'default-value' })
   defaultValue: string = ''

   @query('.monaco-container')
   container!: HTMLDivElement

   @property({ type: Boolean, reflect: true })
   selected: boolean = false

   @query('.vim-status-container')
   vimStatusBar!: HTMLDivElement

   @state()
   vimModeEnabled: boolean = true;

   @state()
   vimMode!: VimAdapterInstance;


   connectedCallback() {
      super.connectedCallback()

      // Set initial selected state based on attribute
      if(this.getAttribute('selected') === 'true' || this.getAttribute('selected') === '') {
         this.selected = true;
      } else {
         this.selected = false;
      } 

      window.addEventListener('toggle-vim-mode', (e: Event) => {
         this.vimModeEnabled = !this.vimModeEnabled;
         this._setVimMode();
      })

      monaco.editor.defineTheme('transparent-theme', {
         base: 'vs', // or 'vs' for light mode
         inherit: true,   // inherit existing syntax highlighting
         rules: [],
         colors: {
            'editor.background': '#baaaaa20', // Fully transparent
            'editor.lineHighlightBackground': '#ffffff20', // Semi-transparent line highlight
         }
      });
   }

   attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
      super.attributeChangedCallback(name, oldValue, newValue)


      if (name === 'selected' && newValue !== '') {
         console.log('Selected attribute changed:', newValue);
         this.selected = newValue === 'true';
      }
   }

   firstUpdated() {
      this.editor = monaco.editor.create(this.container, {
         value: this.defaultValue,
         language: this.language,
         theme: 'transparent-theme',
         automaticLayout: true,
         minimap: {
            enabled: false
         },
         glyphMargin: false,
         lineNumbersMinChars: 2,
         lineDecorationsWidth: 0,
         fontSize: 14,
      })

      monaco.editor.onDidChangeMarkers(([uri]) => {
         const markers = monaco.editor.getModelMarkers({ resource: uri });
         // Emit a custom event with the markers for this file

         markers.forEach(m => {
            this.dispatchEvent(new CustomEvent('update-console-message', {
               detail: {
                  severity: m.severity,
                  startLine: m.startLineNumber,
                  message: m.message,
               }
            }))
         });
      })

      this._setVimMode();
   }

   _setVimMode() {
      if (this.vimModeEnabled) {
         this.vimMode = initVimMode(this.editor, this.vimStatusBar);
      } else if (!this.vimModeEnabled && this.vimMode) {
         this.vimMode.dispose();
         this.vimStatusBar.innerHTML = '';
      }
   }

   _handleInput(e: InputEvent) {
   }


   render() {
      return html`
      <div class=${classMap({
         'monaco-container': true,
         'hidden': !this.selected
       })}>
      </div>
      <div class=${classMap({
         'vim-status-container': true,
         'hidden': !this.selected
       })}>
      </div>
    `
   }
}

declare global {
   interface HTMLElementTagNameMap {
      'strellis-editor': StrellisEditor
   }
}

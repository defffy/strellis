 import { LitElement, unsafeCSS, html } from 'lit'
import { customElement, query} from 'lit/decorators.js'
import styles from './strellis-editor.scss?inline'

/**
 * Text editor  
 */
@customElement('strellis-editor')
export class StrellisEditor extends LitElement {

  static styles = unsafeCSS(styles);

    @query('#output')
    outputPreEl!: HTMLPreElement;

   @query('#output-code')
   outputCodeEl!:  HTMLElement;

 _handleInput(e: InputEvent) {
       let text = (e.target as HTMLTextAreaElement).value;

      // Update the code block with the text from textarea
      // Note: We handle the trailing newline for correct spacing
      if(text[text.length-1] == "\n") {
       text += " ";
      }

      this.outputCodeEl.innerText = text;
 }

   _handleScroll(){
      // Sync the scroll position of the output with the textarea
       this.outputPreEl.scrollTop = this.scrollTop; 
       this.outputPreEl.scrollLeft = this.scrollLeft;
    }

  render() {
    return html`
      <div class="container">
         <textarea id="editing" spellcheck="false" @input=${this._handleInput} @scroll=${this._handleScroll}></textarea>
         <pre id="output" aria-hidden="true"><code id="output-code"></code></pre>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'strellis-editor': StrellisEditor 
  }
}

import { LitElement, unsafeCSS, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import styles from './strellis-sidebar.scss?inline'

/**
 * The sidebar component for Strellis editor. 
 */
@customElement('strellis-sidebar')
export class StrellisSidebar extends LitElement {
   static styles = unsafeCSS(styles);

   @state()
   editors!: NodeListOf<HTMLElement>

   @state()
   files!: string[]

   @state()
   openFileModal: boolean = false

   firstUpdated() {
      this._syncFiles()
   }

   /**
    * Sync the list of files in the sidebar with the currently open editors. This method should be called whenever an editor is opened or closed.
   */
   _syncFiles() {
      this.editors = document.querySelectorAll('strellis-editor')

      this.files = Array.from(this.editors).map(editor => editor.getAttribute('filename') || '')

      console.log('Files in sidebar:', this.files)
   }

   /**
   * Handle click on a file in the sidebar. This should focus the corresponding editor and bring it to the front if it's not already focused.
   */
   _handleFileClick(filename: string) {
      // Get the editor associated with the clicked file
      const fileEditor = Array.from(this.editors).find(editor => editor.getAttribute('filename') === filename)

      if (fileEditor) {
      }
   }

   /**
    * Create a new file and open it in a new editor. This should also update the sidebar to include the new file as well.
   */
   _createFile() { }

   render() {
      return html`
       <div class="sidebar">
         <div class="sidebar__controls">
            <button class="sidebar__controls__button" @click=${() => this.openNewFileModal = true}>New File</button>  
         </div>
         <div class="sidebar__files">
            ${this.files?.map(file => html`
               <button class="sidebar__files__file" @click=${() => this._handleFileClick(file)}>${file}</button>
            `
      )}
         </div>
       </div>
    `
   }
}

declare global {
   interface HTMLElementTagNameMap {
      'strellis-sidebar': StrellisSidebar
   }
}

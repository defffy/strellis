import { LitElement, unsafeCSS, html, nothing } from 'lit'
import { classMap } from 'lit/directives/class-map.js';
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
   openNewFileModal: boolean = false

   @state()
   currentOpenFile: string = ''

   firstUpdated() {
      this._syncFiles()
   }

   /**
    * Sync the list of files in the sidebar with the currently open editors. This method should be called whenever an editor is opened or closed.
   */
   _syncFiles() {
      this.editors = document.querySelectorAll('strellis-editor')

      this.files = Array.from(this.editors).map(editor => editor.getAttribute('filename') || '')
   }

   /**
   * Handle click on a file in the sidebar. This should focus the corresponding editor and bring it to the front if it's not already focused.
   */
   _handleFileClick(filename: string) {
      this.currentOpenFile = filename;
      this.dispatchEvent(new CustomEvent('sidebar-file-selected', { detail: { filename }, bubbles: true, composed: true }))
   }

   /**
    * Create a new file and open it in a new editor. This should also update the sidebar to include the new file as well.
   */
   _createFile(e: SubmitEvent) {
      e.preventDefault()

      const formData = new FormData(e.target as HTMLFormElement)

      const fileNameData = formData.get('filename') as string

      let fileName = fileNameData.split('.')[0];
      // If the user didn't provide an extension, default to .js
      const extension = fileNameData.split('.')[1] || 'js';

      // If there is already a file with the same name and extension, append a number to the end of the file name
      if (this.files.includes(`${fileName}.${extension}`)) {
         let counter = 1;
         let newFileName = `${fileName}-${counter}.${extension}`;
         while (this.files.includes(newFileName)) {
            counter++;
            newFileName = `${fileName}-${counter}.${extension}`;
         }
         fileName = `${fileName}-${counter}`;
      }

      // Create new editor element and append it to the DOM
      const newEditor = document.createElement('strellis-editor')
      newEditor.setAttribute('filename', `${fileName}.${extension}`)
      newEditor.setAttribute('slot', 'editor');

      document.querySelector('strellis-provider')?.appendChild(newEditor)

      this._syncFiles();

      // Ensure the created file is focused
      this._handleFileClick(`${fileName}.${extension}`);

      // Close the new file modal
      this.openNewFileModal = false;
   }

   render() {
      return html`
       <div class="sidebar" @keydown=${(e: KeyboardEvent) => {
         if (e.key === 'Escape') {
            this.openNewFileModal = false;
         }}}>
         <div class="sidebar__controls">
            <button class="sidebar__controls__button" @click=${() => this.openNewFileModal = true}>New File</button>  
            <div class="sidebar__controls__new-file">
               ${this.openNewFileModal ? html`
                  <form @submit=${this._createFile} class="sidebar__controls__new-file__form">
                     <input name="filename" type="text" placeholder="Enter file name" required />
                     <button type="submit">Create file</button>
                  </form>
               ` : nothing} 
            </div>
         </div>
         <div class="sidebar__files">
            ${this.files?.map(file => html`
               <button class=${classMap({ 'sidebar__files__file': true, 'sidebar__files__file--active': this.currentOpenFile === file })} @click=${() => this._handleFileClick(file)}>${file}</button>
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

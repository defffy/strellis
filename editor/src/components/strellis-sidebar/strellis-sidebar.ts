import { LitElement, unsafeCSS, html, nothing } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { customElement, state, queryAll } from "lit/decorators.js";
import styles from "./strellis-sidebar.scss?inline";

/**
 * The sidebar component for Strellis editor.
 */
@customElement("strellis-sidebar")
export class StrellisSidebar extends LitElement {
  static styles = unsafeCSS(styles);

  @state()
  editors!: NodeListOf<HTMLElement>;

  @state()
  files!: string[];

  @state()
  openNewFileModal: boolean = false;

  @state()
  currentOpenFile: string = "strudel.js";

  @state()
  lastOpenedFile: string = "strudel.js";

  @queryAll(".sidebar__files__file")
  fileButtons!: NodeListOf<HTMLButtonElement>;

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        this._goToNextFile();
      }

      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        this._goToPreviousFile();
      }

      if (e.ctrlKey && e.key === "l") {
        e.preventDefault();
        this._goToLastOpenedFile();
      }
    });
  }

  firstUpdated() {
    this._syncFiles();
  }

  _goToLastOpenedFile() {
    console.log("last opened file", this.lastOpenedFile);
    if (this.lastOpenedFile) {
      this._handleFileClick(this.lastOpenedFile);
    }
  }

  _goToPreviousFile() {
    const currentIndex = this.files.indexOf(this.currentOpenFile);
    const previousIndex =
      (currentIndex - 1 + this.files.length) % this.files.length;
    this._handleFileClick(this.files[previousIndex]);
  }

  _goToNextFile() {
    const currentIndex = this.files.indexOf(this.currentOpenFile);
    const nextIndex = (currentIndex + 1) % this.files.length;
    this._handleFileClick(this.files[nextIndex]);
  }

  /**
   * Sync the list of files in the sidebar with the currently open editors. This method should be called whenever an editor is opened or closed.
   */
  _syncFiles() {
    this.editors = document.querySelectorAll("strellis-editor");

    this.files = Array.from(this.editors).map(
      (editor) => editor.getAttribute("filename") || "",
    );
  }

  /**
   * Handle click on a file in the sidebar. This should focus the corresponding editor and bring it to the front if it's not already focused.
   */
  _handleFileClick(filename: string) {
    // Before switching to the new file, store the currently open file as the last opened file
    this.lastOpenedFile =
      Array.from(this.fileButtons)
        .find((button) =>
          button.classList.contains("sidebar__files__file--active"),
        )
        ?.textContent.trim() ?? "";

    this.currentOpenFile = filename;
    this.dispatchEvent(
      new CustomEvent("sidebar-file-selected", {
        detail: { filename },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Create a new file and open it in a new editor. This should also update the sidebar to include the new file as well.
   */
  _createFile(e: SubmitEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const fileNameData = formData.get("filename") as string;

    let fileName = fileNameData.split(".")[0];
    // If the user didn't provide an extension, default to .js
    const extension = fileNameData.split(".")[1] || "js";

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
    const newEditor = document.createElement("strellis-editor");
    newEditor.setAttribute("filename", `${fileName}.${extension}`);
    newEditor.setAttribute("slot", "editor");

    document.querySelector("strellis-provider")?.appendChild(newEditor);

    this._syncFiles();

    // Ensure the created file is focused
    this._handleFileClick(`${fileName}.${extension}`);

    // Close the new file modal
    this.openNewFileModal = false;
  }

  render() {
    return html`
      <div
        class="sidebar"
        @keydown=${(e: KeyboardEvent) => {
          if (e.key === "Escape") {
            this.openNewFileModal = false;
          }
        }}
      >
        <div class="sidebar__controls">
          <button
            class="sidebar__controls__button"
            @click=${() => (this.openNewFileModal = true)}
          >
            New File
          </button>
          <div class="sidebar__controls__new-file">
            ${this.openNewFileModal
              ? html`
                  <form
                    @submit=${this._createFile}
                    class="sidebar__controls__new-file__form"
                  >
                    <input
                      name="filename"
                      type="text"
                      placeholder="Enter file name"
                      required
                    />
                    <button type="submit">Create file</button>
                  </form>
                `
              : nothing}
          </div>
        </div>
        <div class="sidebar__files">
          ${this.files?.map(
            (file) => html`
              <button
                class=${classMap({
                  sidebar__files__file: true,
                  "sidebar__files__file--active": this.currentOpenFile === file,
                })}
                @click=${() => this._handleFileClick(file)}
              >
                ${file}
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "strellis-sidebar": StrellisSidebar;
  }
}

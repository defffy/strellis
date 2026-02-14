import fs from 'fs';
import path from 'path';
import * as nunjucks from 'nunjucks';

const templatesPath = path.join(process.cwd(), '../../', 'templates');
const editorOutputPath = path.join(process.cwd(), '../../', 'editor');

const baseTemplatePath = path.join(process.cwd(), 'base.html');
const baseTemplateHTML = fs.readFileSync(baseTemplatePath, 'utf-8');

interface EditorData {
   name: string;
   language: 'css' | 'javascript' | 'html';
   code: string;
   selected?: boolean;
}

for (const template of fs.readdirSync(templatesPath)) {
   const templatePath = path.join(templatesPath, template);

   const outputFilePath = path.join(editorOutputPath, `${template}.html`);

   const editorsData: Array<EditorData> = []

   for (const file of fs.readdirSync(templatePath)) {
      const [_, fileExtension] = file.split('.');
      const language = getLanguageFromFileName(fileExtension);
      const defaultValue = fs.readFileSync(path.join(templatePath, file), 'utf-8');

      const data: EditorData = {
         name: file,
         language,
         code: defaultValue
      }

      if(file === 'strudel.js') {
         data.selected = true;
      }

      editorsData.push(data)
   }


   const outputHTML = nunjucks.renderString(baseTemplateHTML, { editors: editorsData })


   console.log('outputhtml', outputHTML);

   fs.writeFileSync(outputFilePath, outputHTML, 'utf-8');


}

function getLanguageFromFileName(extension: string): EditorData['language'] {
   switch (extension) {
      case 'js':
         return 'javascript';
      case 'css':
         return 'css';
      case 'html':
         return 'html';
      default:
         throw new Error(`Unsupported file extension: ${extension}`);
   }

}


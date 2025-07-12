const fs = require('fs');
const path = require('path');

/**
 * Carga el contenido del archivo base (prompt.md) y de todos los archivos .md temáticos
 * ubicados en /resources, para generar el prompt del sistema completo.
 */
function getKnowledgeBase() {
  const dir = path.join(__dirname, 'resources');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'prompt.md');

  const contents = files.map(filename => {
    const fullpath = path.join(dir, filename);
    const content = fs.readFileSync(fullpath, 'utf8');
    return `### ${filename.replace('.md', '').replace(/_/g, ' ')}\n${content.trim()}`;
  });

  return contents.join('\n\n');
}

/**
 * Devuelve el prompt del sistema que se envía como mensaje inicial a ChatGPT.
 * Combina el prompt base con la base de conocimiento en .md.
 */
function getSystemPrompt() {
  const promptPath = path.join(__dirname, 'resources', 'prompt.md');
  const basePrompt = fs.readFileSync(promptPath, 'utf8').trim();
  const knowledge = getKnowledgeBase();

  return `${basePrompt}\n\n---\n\n${knowledge}`;
}

module.exports = { getSystemPrompt };

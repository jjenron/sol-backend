const fs = require('fs');
const path = require('path');

function getKnowledgeBase() {
  const dir = path.join(__dirname, '..', 'resources');
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'prompt.md');

  const contents = files.map(filename => {
    const fullpath = path.join(dir, filename);
    const content = fs.readFileSync(fullpath, 'utf8');
    return `## ${filename.replace('.md', '').replace(/_/g, ' ').trim()}\n\n${content.trim()}`;
  });

  return contents.join('\n\n---\n\n');
}

function getSystemPrompt() {
  const promptPath = path.join(__dirname, '..', 'resources', 'prompt.md');
  const basePrompt = fs.readFileSync(promptPath, 'utf8').trim();
  const knowledge = getKnowledgeBase();

  return `${basePrompt}

---

A continuación se presenta una base de conocimiento en formato Markdown. Contiene información validada y redactada por el equipo del Catamarán Patagonia Argentina.

Siempre que recibas una pregunta, revisá esta base de conocimiento antes de responder. Si encontrás una sección relevante, usá esa información como única fuente para responder. Solo si no hay nada relacionado, podés usar tu criterio general.

---

${knowledge}`;
}

module.exports = { getSystemPrompt };


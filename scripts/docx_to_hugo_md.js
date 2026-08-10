// docx -> Hugo-ready markdown. Self-contained (no dependency on the sibling
// agent_for_presentions project) so this site's tooling still works wherever
// it's deployed/cloned.
//
// Note on code blocks: this project's md_to_docx.js (in agent_for_presentions/
// scripts) renders a fenced ```code``` block as a single-COLUMN Table (one
// row per code line, Consolas font, left-aligned, shaded cell) so it gets a
// visible border in Word. A single-column table is therefore always a code
// block in this corpus (real content tables always compare >=2 columns of
// data), so we special-case that shape back into a proper ``` fence instead
// of a garbled one-column markdown table.
const fs = require('fs');
const JSZip = require('jszip');

function decodeXmlEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function runsToMd(runNodes) {
  let out = '';
  for (const r of runNodes) {
    let t = r.text;
    if (!t) continue;
    if (r.code) t = '`' + t + '`';
    else if (r.bold) t = '**' + t + '**';
    out += t;
  }
  return out;
}

function parseParagraphRuns(pXml) {
  const runs = [];
  const runRe = /<w:r>([\s\S]*?)<\/w:r>/g;
  let rm;
  while ((rm = runRe.exec(pXml)) !== null) {
    const rXml = rm[1];
    const rPrMatch = rXml.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/);
    const rPr = rPrMatch ? rPrMatch[1] : '';
    const bold = /<w:b\/>|<w:b w:val="(?:1|true)"\/>/.test(rPr);
    const fontMatch = rPr.match(/w:ascii="([^"]+)"/);
    const font = fontMatch ? fontMatch[1] : null;
    const isCode = font === 'Consolas';
    const textMatches = rXml.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    const text = decodeXmlEntities(textMatches.map(t => t.replace(/<w:t[^>]*>|<\/w:t>/g, '')).join(''));
    if (text) runs.push({ text, bold, code: isCode, font });
  }
  return runs;
}

function tableToMd(tblXml) {
  const rows = [];
  const rowRe = /<w:tr[ >][\s\S]*?<\/w:tr>/g;
  const rowMatches = tblXml.match(rowRe) || [];
  for (const rowXml of rowMatches) {
    const cellRe = /<w:tc>([\s\S]*?)<\/w:tc>/g;
    const cells = [];
    let cm;
    while ((cm = cellRe.exec(rowXml)) !== null) {
      const cellXml = cm[1];
      const paraRe = /<w:p[ >][\s\S]*?<\/w:p>/g;
      const paras = cellXml.match(paraRe) || [];
      const cellText = paras.map(p => runsToMd(parseParagraphRuns(p))).join(' ').trim();
      cells.push(cellText.replace(/\|/g, '\\|'));
    }
    if (cells.length) rows.push(cells);
  }
  if (rows.length === 0) return '';
  const numCols = rows[0].length;
  const header = '| ' + rows[0].join(' | ') + ' |';
  const sep = '|' + ' --- |'.repeat(numCols);
  const body = rows.slice(1).map(r => '| ' + r.join(' | ') + ' |').join('\n');
  return [header, sep, body].filter(Boolean).join('\n');
}

function guessLanguage(codeText) {
  const t = codeText;
  if (/^\s*(\$|npm |npx |git |cd |docker |mkdir |node )/m.test(t)) return 'bash';
  if (/\b(SELECT|INSERT INTO|CREATE TABLE|UPDATE|DELETE FROM)\b/i.test(t)) return 'sql';
  if (/<!DOCTYPE|<html|<div|<button|<form/i.test(t)) return 'html';
  if (/^\s*[.#][\w-]+\s*\{|:\s*(hover|flex|grid)\b/m.test(t)) return 'css';
  if (/\binterface\s+\w+|:\s*(string|number|boolean)\b/.test(t)) return 'typescript';
  if (/^\s*\{[\s\S]*"[\w-]+"\s*:/.test(t)) return 'json';
  return 'javascript';
}

// Raw text for a line already inside a ``` fence — every run in a code-table
// cell tends to carry the Consolas font, which would make runsToMd() wrap
// each one in its own inline-code backticks (wrong inside a fence, and
// destructive to any real backtick already in the code, e.g. a template
// literal). Concatenate the decoded run text with no markdown decoration.
function paragraphText(pXml) {
  return parseParagraphRuns(pXml).map(r => r.text).join('');
}

function codeTableLines(tblXml) {
  const rowMatches = tblXml.match(/<w:tr[ >][\s\S]*?<\/w:tr>/g) || [];
  return rowMatches.map(rowXml => {
    const cellMatch = rowXml.match(/<w:tc>([\s\S]*?)<\/w:tc>/);
    if (!cellMatch) return '';
    const paraMatches = cellMatch[1].match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];
    return paraMatches.map(paragraphText).join('\n');
  });
}

function isSingleColumnTable(tblXml) {
  const rowMatches = tblXml.match(/<w:tr[ >][\s\S]*?<\/w:tr>/g) || [];
  if (!rowMatches.length) return false;
  return rowMatches.every(r => (r.match(/<w:tc>/g) || []).length === 1);
}

async function extractDocxAsHugoMarkdown(filePath) {
  const buf = fs.readFileSync(filePath);
  const zip = await JSZip.loadAsync(buf);
  const xml = await zip.file('word/document.xml').async('string');
  const bodyMatch = xml.match(/<w:body>([\s\S]*)<\/w:body>/);
  const body = bodyMatch ? bodyMatch[1] : xml;

  const blocks = [];
  const blockRe = /<w:p\b[^>]*>[\s\S]*?<\/w:p>|<w:tbl>[\s\S]*?<\/w:tbl>/g;
  let m;
  while ((m = blockRe.exec(body)) !== null) blocks.push(m[0]);

  const mdLines = [];
  const headings = [];

  for (const block of blocks) {
    if (block.startsWith('<w:tbl>')) {
      if (isSingleColumnTable(block)) {
        const lines = codeTableLines(block);
        const lang = guessLanguage(lines.join('\n'));
        mdLines.push('```' + lang + '\n' + lines.join('\n') + '\n```');
      } else {
        const md = tableToMd(block);
        if (md) mdLines.push('', md, '');
      }
      continue;
    }

    const pPrMatch = block.match(/<w:pPr>([\s\S]*?)<\/w:pPr>/);
    const pPr = pPrMatch ? pPrMatch[1] : '';
    const styleMatch = pPr.match(/<w:pStyle w:val="([^"]+)"/);
    const style = styleMatch ? styleMatch[1] : null;

    const runs = parseParagraphRuns(block);
    const isHeading = style === 'Title' || style === 'Heading1' || style === 'Heading2';
    const text = (isHeading ? runs.map(r => r.text).join('') : runsToMd(runs)).trim();
    if (!text) continue;

    if (style === 'Title') { mdLines.push('# ' + text); headings.push({ level: 1, text }); }
    else if (style === 'Heading1') { mdLines.push('## ' + text); headings.push({ level: 2, text }); }
    else if (style === 'Heading2') { mdLines.push('### ' + text); headings.push({ level: 3, text }); }
    else mdLines.push(text);
  }

  // The source docx doesn't carry real hyperlink fields for reference links —
  // "דוקומנטציה רשמית" lines are just plain text like "MDN — Functions
  // https://...". Turn "<label>  <url>" lines into real markdown links so
  // they render as clickable <a> tags (and pick up target=_blank via the
  // link render hook) instead of inert text.
  const linkified = mdLines.map(line => {
    const m = line.match(/^(.+?)\s+(https?:\/\/\S+)$/);
    if (!m || line.startsWith('#') || line.includes('](')) return line;
    return `[${m[1].trim()}](${m[2]})`;
  });

  return { markdown: linkified.join('\n\n').replace(/\n{3,}/g, '\n\n'), headings };
}

module.exports = { extractDocxAsHugoMarkdown, decodeXmlEntities };

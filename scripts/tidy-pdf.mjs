// Tidies a PDF exported from PowerPoint: removes the "Slide 3: " that
// PowerPoint puts in front of every bookmark (the list of pages in a PDF
// reader's sidebar), so "Slide 3: Area map for players" becomes
// "Area map for players".
//
//   npm run tidy-pdf -- "The Eldritch Earl Player Guide.pdf"            (fixes the file in place)
//   npm run tidy-pdf -- "The Eldritch Earl Player Guide.pdf" out.pdf   (writes a new file)
//
// On Windows, dragging a PDF onto "Tidy a PDF.bat" does the first of these.

import { readFile, writeFile } from 'node:fs/promises';
import { PDFDocument, PDFDict, PDFName, PDFHexString } from 'pdf-lib';

const [input, output = input] = process.argv.slice(2);
if (!input) {
  console.error('Give the PDF to tidy, e.g. npm run tidy-pdf -- "My guide.pdf"');
  process.exit(1);
}

const prefix = /^\s*Slide\s+\d+\s*[:.\-–]\s*/i;
const pdf = await PDFDocument.load(await readFile(input), { updateMetadata: false });
const ctx = pdf.context;

let changed = 0;
const seen = new Set();

// Bookmarks form a tree: each entry may have children (First) and a next sibling (Next).
function walk(ref) {
  while (ref && !seen.has(ref)) {
    seen.add(ref);
    const item = ctx.lookup(ref, PDFDict);
    const title = item.lookup(PDFName.of('Title'));
    if (title && typeof title.decodeText === 'function') {
      const text = title.decodeText();
      const tidied = text.replace(prefix, '');
      if (tidied !== text) {
        item.set(PDFName.of('Title'), PDFHexString.fromText(tidied));
        changed++;
      }
    }
    walk(item.get(PDFName.of('First')));
    ref = item.get(PDFName.of('Next'));
  }
}

const outlines = pdf.catalog.lookup(PDFName.of('Outlines'));
if (outlines instanceof PDFDict) walk(outlines.get(PDFName.of('First')));

if (changed === 0) {
  console.log('No "Slide N:" bookmarks found. Nothing to change.');
  process.exit(0);
}

await writeFile(output, await pdf.save());
console.log(`Tidied ${changed} bookmark${changed === 1 ? '' : 's'} and saved ${output}`);

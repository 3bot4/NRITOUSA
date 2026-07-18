/**
 * Minimal client-side PDF writer for the invitation letter generator.
 *
 * Why hand-rolled: the letter is plain text in standard fonts, and the repo
 * ships no PDF dependency — this ~150-line writer produces a valid PDF 1.4
 * with the two built-in Type1 fonts (Helvetica / Helvetica-Bold), so the
 * download works entirely offline with zero network calls and no form data
 * ever leaving the browser. Structure (object offsets, xref, stream lengths)
 * is asserted by letterPdf.test.ts.
 *
 * Not a general PDF library: US Letter pages, one size, left-aligned
 * word-wrapped text only — exactly what a business letter needs.
 */
import type { LetterParagraph } from "@/lib/invitationLetter";

/* Page geometry (US Letter, 1-inch margins) and type settings. */
const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 72;
const FONT_SIZE = 11;
const LEADING = 16;
const MAX_WIDTH = PAGE_W - MARGIN * 2;
const MAX_LINES_PER_PAGE = Math.floor((PAGE_H - MARGIN * 2) / LEADING);

/** Replace characters WinAnsi can't show; keep Latin-1 as-is. */
function sanitize(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "?");
}

/** Escape PDF string-literal specials. */
function esc(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/** Conservative Helvetica width estimate (em units) for wrapping. */
function charEm(ch: string): number {
  if (/[il.,':;|!Ij\s]/.test(ch)) return 0.29;
  if (/[ftr()[\]{}"-]/.test(ch)) return 0.36;
  if (/[mw]/.test(ch)) return 0.84;
  if (/[MW@]/.test(ch)) return 0.95;
  if (/[A-Z&%#]/.test(ch)) return 0.73;
  return 0.57;
}

function textWidth(text: string, size: number): number {
  let w = 0;
  for (const ch of text) w += charEm(ch);
  return w * size;
}

interface Line {
  text: string;
  bold: boolean;
  blanksBefore: number;
}

/** Word-wrap paragraphs into physical lines. */
function layout(paragraphs: LetterParagraph[]): Line[] {
  const lines: Line[] = [];
  paragraphs.forEach((p, pi) => {
    const words = sanitize(p.text).split(/\s+/).filter(Boolean);
    let current = "";
    let first = true;
    const blanks = pi === 0 ? 0 : (p.spaceBefore ?? 0);
    const push = (text: string) => {
      lines.push({ text, bold: !!p.bold, blanksBefore: first ? blanks : 0 });
      first = false;
    };
    if (words.length === 0) {
      push("");
      return;
    }
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (current && textWidth(candidate, FONT_SIZE) > MAX_WIDTH) {
        push(current);
        current = word;
      } else {
        current = candidate;
      }
    }
    if (current) push(current);
  });
  return lines;
}

/** Split laid-out lines into pages, counting blank spacing lines. */
function paginate(lines: Line[]): Line[][] {
  const pages: Line[][] = [];
  let page: Line[] = [];
  let used = 0;
  for (const line of lines) {
    const cost = line.blanksBefore + 1;
    if (used + cost > MAX_LINES_PER_PAGE && page.length > 0) {
      pages.push(page);
      page = [];
      used = 0;
      line.blanksBefore = 0;
    }
    page.push(line);
    used += line.blanksBefore + 1;
  }
  if (page.length > 0) pages.push(page);
  return pages.length > 0 ? pages : [[{ text: "", bold: false, blanksBefore: 0 }]];
}

/** Build one page's content stream. */
function pageStream(lines: Line[]): string {
  let out = `BT\n/F1 ${FONT_SIZE} Tf\n${LEADING} TL\n${MARGIN} ${PAGE_H - MARGIN - FONT_SIZE} Td\n`;
  let bold = false;
  for (const line of lines) {
    for (let i = 0; i < line.blanksBefore; i++) out += "T*\n";
    if (line.bold !== bold) {
      bold = line.bold;
      out += `/${bold ? "F2" : "F1"} ${FONT_SIZE} Tf\n`;
    }
    out += line.text ? `(${esc(line.text)}) Tj\nT*\n` : "T*\n";
  }
  out += "ET";
  return out;
}

/** Assemble a complete PDF from the letter paragraphs. */
export function buildLetterPdf(paragraphs: LetterParagraph[]): Uint8Array {
  const pages = paginate(layout(paragraphs));

  // Object numbering: 1 catalog, 2 pages, 3 F1, 4 F2, then page+content pairs.
  const pageObjNums = pages.map((_, i) => 5 + i * 2);
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [${pageObjNums.map((n) => `${n} 0 R`).join(" ")}] /Count ${pages.length} >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];
  pages.forEach((lines, i) => {
    const contentNum = 5 + i * 2 + 1;
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNum} 0 R >>`,
    );
    const stream = pageStream(lines);
    objects.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });

  let body = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(body.length);
    body += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefStart = body.length;
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    body += `${String(off).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  // All characters are ≤ 0xFF after sanitize() — encode as Latin-1 bytes.
  const bytes = new Uint8Array(body.length);
  for (let i = 0; i < body.length; i++) bytes[i] = body.charCodeAt(i) & 0xff;
  return bytes;
}

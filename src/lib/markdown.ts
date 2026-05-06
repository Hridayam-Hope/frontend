import { marked } from 'marked';
import TurndownService from 'turndown';
import { gfm, tables } from 'turndown-plugin-gfm';

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
});

turndownService.use([gfm, tables]);

marked.setOptions({
  gfm: true,
  breaks: false,
});

function normalizeEditorHtmlForMarkdown(html: string): string {
  return html
    .replace(/<colgroup[\s\S]*?<\/colgroup>/gi, '')
    .replace(/\sstyle="[^"]*"/gi, '')
    .replace(/\scolspan="1"/gi, '')
    .replace(/\srowspan="1"/gi, '')
    .replace(/<(td|th)([^>]*)>\s*<p>([\s\S]*?)<\/p>\s*<\/\1>/gi, '<$1$2>$3</$1>');
}

/**
 * Convert markdown to HTML for display in rich text editor
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';
  return marked(markdown) as string;
}

/**
 * Convert HTML from rich text editor back to markdown for storage
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';
  return turndownService.turndown(normalizeEditorHtmlForMarkdown(html));
}

/**
 * Render markdown for public display (with custom styling)
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';
  return marked(markdown) as string;
}

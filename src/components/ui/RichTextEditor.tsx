"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Underline from "@tiptap/extension-underline";
import { markdownToHtml, htmlToMarkdown } from "@/lib/markdown";
import "@/styles/editor.css";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
  error?: string;
}

const TIPTAP_EXTENSIONS = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Underline,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-brand-600 underline hover:text-brand-700",
    },
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "border-collapse table-auto w-full",
    },
  }),
  TableRow,
  TableHeader.configure({
    HTMLAttributes: {
      class: "border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold",
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: "border border-gray-300 px-4 py-2",
    },
  }),
];

export default function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = "Write your story...",
  error,
}: RichTextEditorProps) {
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });
  const tablePickerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: TIPTAP_EXTENSIONS,
    content: markdownToHtml(value),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const markdown = htmlToMarkdown(html);
      onChange(markdown);
    },
    immediatelyRender: false,
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== htmlToMarkdown(editor.getHTML())) {
      const html = markdownToHtml(value);
      editor.commands.setContent(html);
    }
  }, [value, editor]);

  // Close table picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tablePickerRef.current && !tablePickerRef.current.contains(event.target as Node)) {
        setShowTablePicker(false);
      }
    }

    if (showTablePicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showTablePicker]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setShowTablePicker(false);
    setHoveredCell({ row: 0, col: 0 });
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-300 rounded-t-lg flex-wrap">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("bold") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-200"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("italic") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-200"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("underline") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-200"
          }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("code") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-200"
          }`}
          title="Inline Code"
        >
          <Code size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded transition-colors text-sm font-semibold ${
            editor.isActive("heading", { level: 1 })
              ? "bg-brand-100 text-brand-600"
              : "hover:bg-gray-200"
          }`}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded transition-colors text-sm font-semibold ${
            editor.isActive("heading", { level: 2 })
              ? "bg-brand-100 text-brand-600"
              : "hover:bg-gray-200"
          }`}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded transition-colors text-sm font-semibold ${
            editor.isActive("heading", { level: 3 })
              ? "bg-brand-100 text-brand-600"
              : "hover:bg-gray-200"
          }`}
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("bulletList") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-200"
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("orderedList") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-200"
          }`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("blockquote") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-200"
          }`}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>

        {/* Code Block */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive("codeBlock") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-200"
          }`}
          title="Code Block"
        >
          <Code size={16} className="font-bold" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded transition-colors ${
            editor.isActive("link") ? "bg-brand-100 text-brand-600" : "hover:bg-gray-200"
          }`}
          title="Insert Link"
        >
          <LinkIcon size={16} />
        </button>

        {/* Table with Picker */}
        <div className="relative" ref={tablePickerRef}>
          <button
            type="button"
            onClick={() => setShowTablePicker(!showTablePicker)}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="Insert Table"
          >
            <TableIcon size={16} />
          </button>

          {showTablePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50">
              <div className="mb-2 text-xs text-gray-600 text-center font-medium">
                {hoveredCell.row > 0 && hoveredCell.col > 0
                  ? `${hoveredCell.row} × ${hoveredCell.col}`
                  : "Select table size"}
              </div>
              <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, 16px)' }}>
                {Array.from({ length: 100 }, (_, i) => {
                  const row = Math.floor(i / 10) + 1;
                  const col = (i % 10) + 1;
                  const isHovered = row <= hoveredCell.row && col <= hoveredCell.col;

                  return (
                    <div
                      key={i}
                      className={`border border-gray-300 cursor-pointer transition-colors ${
                        isHovered ? "bg-brand-500 border-brand-600" : "bg-white hover:bg-gray-100"
                      }`}
                      style={{ width: '16px', height: '16px' }}
                      onMouseEnter={() => setHoveredCell({ row, col })}
                      onClick={() => insertTable(row, col)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title="Horizontal Line"
        >
          <Minus size={16} />
        </button>

        <div className="flex-1" />

        {/* Table Controls - Show when cursor is in a table */}
        {editor.isActive("table") && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded">
              <span className="text-xs font-medium text-blue-700 mr-1">Table:</span>
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors"
                title="Add Column Before"
              >
                ← Col
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors"
                title="Add Column After"
              >
                Col →
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="px-2 py-1 text-xs rounded hover:bg-red-100 text-red-600 transition-colors"
                title="Delete Column"
              >
                ✕ Col
              </button>
              <div className="w-px h-4 bg-blue-300 mx-1" />
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors"
                title="Add Row Before"
              >
                ↑ Row
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors"
                title="Add Row After"
              >
                Row ↓
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="px-2 py-1 text-xs rounded hover:bg-red-100 text-red-600 transition-colors"
                title="Delete Row"
              >
                ✕ Row
              </button>
              <div className="w-px h-4 bg-blue-300 mx-1" />
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="px-2 py-1 text-xs rounded hover:bg-red-100 text-red-600 font-medium transition-colors"
                title="Delete Table"
              >
                ✕ Table
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeaderRow().run()}
                className="px-2 py-1 text-xs rounded hover:bg-blue-100 transition-colors"
                title="Toggle Header Row"
              >
                Header
              </button>
            </div>
          </>
        )}

        <div className="flex-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (Ctrl+Z)"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (Ctrl+Y)"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor */}
      <div
        className={`border border-t-0 rounded-b-lg bg-white ${
          error ? "border-red-400" : "border-gray-300"
        }`}
      >
        <EditorContent editor={editor} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Help text */}
      <div className="text-xs text-gray-500">
        <p>
          Use the toolbar above to format your text. Content is automatically saved as markdown.
        </p>
      </div>
    </div>
  );
}

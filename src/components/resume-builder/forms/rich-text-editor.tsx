'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered } from 'lucide-react'

type RichTextEditorProps = {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1 rounded transition-colors ${
        active
          ? 'bg-secondary text-secondary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
      }`}
    >
      {children}
    </button>
  )
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Only enable ATS-safe features
        heading: false,
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
        hardBreak: { keepMarks: true },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[60px] px-2 py-1.5 text-sm outline-none focus:outline-none [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-0.5 [&_li]:my-0 [&_p]:my-0.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0',
      },
    },
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML()
      // TipTap returns <p></p> for empty content — normalize to empty string
      onChange(html === '<p></p>' ? '' : html)
    },
    // Prevent SSR issues
    immediatelyRender: false,
  })

  // Sync external value changes (e.g. undo/redo)
  // Only update if the editor content diverges from the prop
  if (editor && !editor.isFocused) {
    const current = editor.getHTML()
    const normalized = current === '<p></p>' ? '' : current
    if (normalized !== value) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }

  if (!editor) {
    return (
      <div className="rounded-md border border-border bg-transparent min-h-[60px] px-2 py-1.5 text-sm text-muted-foreground">
        {placeholder || 'Loading editor...'}
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border bg-transparent focus-within:ring-1 focus-within:ring-ring">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-1.5 py-1 border-b border-border">
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <div className="w-px h-4 bg-border mx-0.5" />
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}

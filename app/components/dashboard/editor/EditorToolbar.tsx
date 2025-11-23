// components/dashboard/editor/EditorToolbar.tsx
'use client';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
}

interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const ToolButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  isActive = false 
}: ToolButtonProps) => (
  <button
    onClick={onClick}
    className={`p-2 rounded transition-all ${
      isActive 
        ? 'bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 shadow-sm' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-400 hover:shadow-sm'
    }`}
    title={label}
    type="button"
  >
    <Icon className="w-5 h-5" />
  </button>
);

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const [, setUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => setUpdate(prev => prev + 1);
    editor.on('selectionUpdate', handleUpdate);
    editor.on('transaction', handleUpdate);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('transaction', handleUpdate);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="p-3 flex flex-wrap gap-1 bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600 transition-colors">
      {/* Undo/Redo */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-slate-600 pr-2">
        <ToolButton
          icon={Undo}
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolButton
          icon={Redo}
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        />
      </div>

      {/* Text Formatting */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-slate-600 pr-2">
        <ToolButton
          icon={Bold}
          label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        />
        <ToolButton
          icon={Italic}
          label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        />
        <ToolButton
          icon={Underline}
          label="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
        />
        <ToolButton
          icon={Code}
          label="Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
        />
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-slate-600 pr-2">
        <ToolButton
          icon={Heading1}
          label="Heading 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
        />
        <ToolButton
          icon={Heading2}
          label="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
        />
        <ToolButton
          icon={Heading3}
          label="Heading 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
        />
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-slate-600 pr-2">
        <ToolButton
          icon={List}
          label="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        />
        <ToolButton
          icon={ListOrdered}
          label="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        />
      </div>

      {/* Alignment */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-slate-600 pr-2">
        <ToolButton
          icon={AlignLeft}
          label="Align Left"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
        />
        <ToolButton
          icon={AlignCenter}
          label="Align Center"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
        />
        <ToolButton
          icon={AlignRight}
          label="Align Right"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
        />
      </div>

      {/* Quote & Code Block */}
      <div className="flex gap-1 border-r border-gray-300 dark:border-slate-600 pr-2">
        <ToolButton
          icon={Quote}
          label="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        />
      </div>

      {/* Media */}
      <div className="flex gap-1">
        <ToolButton
          icon={Link2}
          label="Add Link"
          onClick={addLink}
          isActive={editor.isActive('link')}
        />
        <ToolButton
          icon={Image}
          label="Add Image"
          onClick={addImage}
        />
      </div>
    </div>
  );
}

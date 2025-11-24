'use client';
import { EditorContent } from '@tiptap/react';
import { useEffect, useState } from 'react';
import type { Editor } from '@tiptap/react';

interface EditorTextareaProps {
  editor: Editor | null;
}

export function EditorTextarea({ editor }: EditorTextareaProps) {
  const [mounted] = useState(true);
  const [stats, setStats] = useState({ chars: 0, words: 0 });
  useEffect(() => {
    if (!editor) return undefined;
    const updateStats = () => {
      const text = editor.getText() || "";
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const chars = text.length;
      setStats({ chars, words });
    };
    updateStats();
    editor.on('update', updateStats);
    return () => {
      editor.off('update', updateStats);
    };
  }, [editor]);
  if (!mounted || !editor) {
    return (
      <div className="bg-white dark:bg-slate-800 min-h-[500px] flex items-center justify-center transition-colors">
        <p className="text-gray-400 dark:text-gray-500">Loading editor...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col">
      <div className="bg-white dark:bg-slate-800 p-4 min-h-[500px] transition-colors text-gray-900 dark:text-gray-100">
        <EditorContent editor={editor} />
      </div>
      <div className="px-4 py-3 bg-gray-50 dark:bg-slate-900 border-t 
          border-gray-200 dark:border-slate-600 flex items-center 
          justify-between text-sm text-gray-500 dark:text-gray-400 transition-colors">
        <span>{stats.chars} characters</span>
        <span>{stats.words} words</span>
      </div>
    </div>
  );
}

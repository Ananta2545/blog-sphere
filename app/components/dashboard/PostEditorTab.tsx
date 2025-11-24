'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EditorToolbar } from './editor/EditorToolbar';
import { EditorTextarea } from './editor/EditorTextarea';
import { EditorSidebar } from './editor/EditorSidebar';
import { Button } from '@/app/components/ui/Button';
import { Save, Eye, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/app/components/ui/ToastContainer';
import Link from 'next/link';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import LinkExtension from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { trpc } from '@/app/_trpc/client';
import { useEditorState } from '@/app/store/useAppStore';

export function PostEditorTab() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const postIdParam = searchParams.get('postId');
  const postId = postIdParam ? parseInt(postIdParam) : null;
  const [isPreview, setIsPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const {
    editingPostId,
    title,
    content,
    status,
    selectedCategoryIds,
    readingTimeMins,
    setEditingPost,
    setTitle,
    setContent,
    setStatus,
    setSelectedCategories,
    setReadingTimeMins,
    resetEditor,
  } = useEditorState();

  const utils = trpc.useUtils();
  const { data: postData, isLoading: postLoading } = trpc.post.getByIdIncludingDrafts.useQuery(
    { postId: postId! },
    { enabled: !!postId }
  );
  const { data: categories } = trpc.category.getAll.useQuery();
  const createMutation = trpc.post.create.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
      utils.post.getStats.invalidate();
    },
    onError: (error) => {
      console.error('Create mutation error:', error);
    },
  });

  const updateMutation = trpc.post.update.useMutation({
    onSuccess: () => {
      utils.post.getAll.invalidate();
      utils.post.getById.invalidate({ postId: postId! });
      utils.post.getByIdIncludingDrafts.invalidate({ postId: postId! });
      utils.post.getStats.invalidate();
    },
  });

  const editor = useEditor({
    immediatelyRender: false,
    editable: true,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Start writing your content here...',
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none text-gray-900 dark:text-gray-100 dark:prose-invert',
      },
    },

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
    },
  });

  useEffect(() => {
    if (postData && postId) {
      setEditingPost(postId);
      setTitle(postData.title || '');
      setContent(postData.content || '');
      setStatus(postData.status || 'DRAFT');
      setSelectedCategories(postData.categories?.map(cat => cat.id) || []);
      setReadingTimeMins(postData.readingTimeMins || 5);
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent(postData.content || '');
      }
    } else if (!postId && editingPostId) {
      resetEditor();
      if (editor && !editor.isDestroyed) {
        editor.commands.setContent('');
      }
    }
  }, [postData, postId]);

  useEffect(() => {
    if (editor && !editor.isDestroyed && content) {
      const currentContent = editor.getHTML();
      if (currentContent !== content) {
        editor.commands.setContent(content);
      }
    }
  }, [editor]);

  const handleSave = async (publishNow: boolean = false) => {
    if (!title || !title.trim()) {
      showToast('Please enter a title', 'error');
      return;
    }
    if(publishNow) setPublishing(true);
    else setSaving(true);
    const cleanContent = content.replace(/<\/?[^>]+(>|$)/g, "").trim();
    if (!cleanContent) {
      showToast('Please enter some content', 'error');
      return;
    }
    const postStatus = publishNow ? ('PUBLISHED' as const) : ('DRAFT' as const);
    const postData = {
      title: title.trim(),
      content: content,
      status: postStatus,
      readingTimeMins: readingTimeMins,
      categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : [],
    };

    try {
      if (editingPostId && postId) {
        await updateMutation.mutateAsync({
          ...postData,
          postId: editingPostId,
        });
        if (publishNow) {
          showToast('Post published successfully!', 'success');
          setStatus('PUBLISHED');
          setTimeout(() => {
            window.open(`/blog/${editingPostId}`, '_blank');
          }, 500);
        } else {
          showToast('Post saved as draft!', 'success');
          setStatus('DRAFT');
        }
      } else {
        const newPost = await createMutation.mutateAsync(postData);
        if (newPost && newPost.id) {
          setEditingPost(newPost.id);
          if (publishNow) {
            showToast('Post published successfully!', 'success');
            router.push(`/dashboard?tab=post-editor&postId=${newPost.id}`);
            setTimeout(() => {
              window.open(`/blog/${newPost.id}`, '_blank');
            }, 500);
          } else {
            showToast('Post created as draft!', 'success');
            router.push(`/dashboard?tab=post-editor&postId=${newPost.id}`);
          }
        } else {
          showToast(publishNow ? 'Post published!' : 'Post created as draft!', 'success');
        }
      }
    } catch (error: unknown) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save post';
      showToast(errorMessage, 'error');
    }finally{
      setSaving(false);
      setPublishing(false);
    }
  };

  const handlePublish = () => handleSave(true);
  if (postLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 transition-colors p-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-teal-600 dark:text-teal-400 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow dark:shadow-slate-900/50 transition-colors">
      <div className="border-b border-gray-200 dark:border-slate-700 px-3 sm:px-4 md:px-6 py-3 sm:py-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {editingPostId ? 'Edit Post' : 'Create New Post'}
          </h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2 dark:bg-slate-700 cursor-pointer dark:text-gray-200 dark:hover:bg-slate-600"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{isPreview ? 'Edit' : 'Preview'}</span>
              <span className="sm:hidden">{isPreview ? 'Edit' : 'Preview'}</span>
            </Button>
            {editingPostId && (
              <Link
                href={status === 'PUBLISHED' ? `/blog/${editingPostId}` : `/blog/preview/${editingPostId}`}
                target="_blank"
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm shadow-lg shadow-blue-500/20"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{status === 'PUBLISHED' ? 'View Post' : 'Preview Draft'}</span>
                <span className="sm:hidden">View</span>
              </Link>
            )}
            <Button
              variant="secondary"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex cursor-pointer items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
            >
              {saving ? <Loader2 className='w-3 h-3 sm:w-4 sm:h-4 animate-spin' /> : <Save className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span className="hidden sm:inline">Save Draft</span>
              <span className="sm:hidden">Save</span>
            </Button>
            <Button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-3 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              {publishing ? <Loader2 className='w-3 h-3 sm:w-4 sm:h-4 animate-spin' /> : <Send className='w-3 h-3 sm:w-4 sm:h-4' />}
              Publish
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-4 md:p-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
          {isPreview ? (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-4 sm:p-6 md:p-8 transition-colors">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">{title || 'Untitled Post'}</h1>
              <div 
                className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">No content yet...</p>' }}
              />
            </div>
          ) : (
            <>
              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title..."
                  className="w-full text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold border-none focus:outline-none focus:ring-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 p-2 sm:p-0"
                />
              </div>
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden transition-colors">
                <EditorToolbar editor={editor} />
                <EditorTextarea editor={editor} />
              </div>
            </>
          )}
        </div>
        <div className="lg:col-span-1 order-1 lg:order-2">
          <EditorSidebar
            categories={categories || []}
            selectedCategoryIds={selectedCategoryIds}
            onCategoryChange={setSelectedCategories}
            status={status}
            onStatusChange={setStatus}
            readingTimeMins={readingTimeMins}
            onReadingTimeChange={setReadingTimeMins}
          />
        </div>
      </div>
    </div>
  );
}

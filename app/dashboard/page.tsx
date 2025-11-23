// app/dashboard/page.tsx
'use client';

import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';
import { DashboardTabs } from '@/app/components/dashboard/DashboardTabs';
import { AnalyticsTab } from '@/app/components/dashboard/AnalyticsTab';
import { PostEditorTab } from '@/app/components/dashboard/PostEditorTab';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type TabType = 'analytics' | 'post-editor';

function DashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const postIdParam = searchParams.get('postId');
  
  // Initialize activeTab - if postId exists, default to post-editor
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (postIdParam) return 'post-editor';
    return (tabParam as TabType) || 'analytics';
  });

  // Sync activeTab with URL parameter changes
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (postIdParam) {
      // If postId exists, always show editor tab
      setActiveTab('post-editor');
    } else if (tabParam && (tabParam === 'analytics' || tabParam === 'post-editor')) {
      setActiveTab(tabParam as TabType);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [tabParam, postIdParam]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors">
      {/* <Navbar /> */}
      <main className="grow">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          <DashboardHeader />
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="mt-8">
            {activeTab === 'analytics' && <AnalyticsTab />}
            {activeTab === 'post-editor' && <PostEditorTab />}
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

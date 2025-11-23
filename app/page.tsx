// app/page.tsx
import { HeroSection } from '@/app/components/landing/HeroSection';
import { FeatureSection } from '@/app/components/landing/FeatureSection';
import { CTASection } from '@/app/components/landing/CTAsection';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'BlogSphere - Create, Share, and Inspire',
  description: 'A modern full-stack blogging platform built with Next.js, tRPC, and Drizzle ORM.',
};


export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors">
      {/* <Navbar />  */}
      <main className="grow">
        <HeroSection /> 
        <FeatureSection /> 
        <CTASection /> 
      </main>
      {/* <Footer /> */}
    </div>
  );
}
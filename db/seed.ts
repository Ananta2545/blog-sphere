/**
 * Database Seeding Script
 * Populates the database with sample data for development
 */
import { db } from "./drizzle.js";
import { categories } from "./schema/index.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function seed() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // Create sample categories
    console.log("📁 Creating categories...");
    const categoryData = [
      {
        name: "Science",
        description: "Scientific discoveries, research, and innovations",
      },
      {
        name: "Technology",
        description: "Technology trends, programming, and software development",
      },
      {
        name: "Health",
        description: "Health, wellness, fitness, and medical topics",
      },
      {
        name: "Education",
        description: "Learning, teaching, and educational resources",
      },
      {
        name: "Entertainment",
        description: "Movies, music, games, and pop culture",
      },
      {
        name: "Travel",
        description: "Travel guides, destinations, and adventure stories",
      },
      {
        name: "Business",
        description: "Business strategies, entrepreneurship, and career advice",
      },
    ];

    const createdCategories = await Promise.all(
      categoryData.map(async (cat) => {
        const [category] = await db
          .insert(categories)
          .values({
            name: cat.name,
            slug: slugify(cat.name),
            description: cat.description,
          })
          .returning();
        return category;
      })
    );

    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // No sample posts - users will create their own
    console.log("📝 No sample posts created - database ready for user content\n");
    /*
        content: `# Getting Started with Next.js 15

Next.js 15 introduces powerful new features that make building web applications easier than ever. In this comprehensive guide, we'll explore the App Router, Server Components, and how to build a production-ready application.

## What's New in Next.js 15?

The latest version of Next.js brings several exciting improvements:

- **App Router**: A new file-system based router built on React Server Components
- **Server Actions**: Execute server-side code directly from your components
- **Improved Performance**: Faster builds and optimized runtime
- **Streaming**: Progressive rendering for better user experience

## Setting Up Your First Project

Let's create a new Next.js 15 project:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will set up a new project with all the latest features enabled by default.

## Understanding the App Router

The App Router uses the \`app\` directory instead of the traditional \`pages\` directory. Each folder represents a route segment, and special files define the UI for that route:

- \`page.tsx\` - The main UI for a route
- \`layout.tsx\` - Shared UI for a segment and its children
- \`loading.tsx\` - Loading UI
- \`error.tsx\` - Error UI

## Conclusion

Next.js 15 represents a major step forward in web development. The App Router makes it easier to build complex applications while maintaining excellent performance.`,
        status: "PUBLISHED" as const,
        categoryIds: [0, 4], // Technology, Tutorial
      },
      {
        title: "Building Type-Safe APIs with tRPC",
        content: `# Building Type-Safe APIs with tRPC

tRPC allows you to build end-to-end type-safe APIs without code generation. This means your frontend automatically knows the shape of your backend data, reducing bugs and improving developer experience.

## Why tRPC?

Traditional REST APIs require you to maintain types separately on the frontend and backend. GraphQL solves some of these problems but adds complexity. tRPC gives you the best of both worlds:

- **End-to-end type safety**: TypeScript types flow from server to client
- **No code generation**: Works with your existing TypeScript setup
- **Automatic validation**: Uses Zod for runtime validation
- **Excellent DX**: Auto-complete and type checking in your IDE

## Setting Up tRPC

First, install the required dependencies:

\`\`\`bash
npm install @trpc/server @trpc/client @trpc/react-query
npm install @tanstack/react-query zod
\`\`\`

## Creating Your First Router

Define your API endpoints:

\`\`\`typescript
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const appRouter = t.router({
  getUser: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return { id: input.id, name: 'John' };
    }),
});
\`\`\`

## Using tRPC in React

On the client side, you get fully typed hooks:

\`\`\`typescript
const { data } = trpc.getUser.useQuery({ id: '1' });
// data is automatically typed!
\`\`\`

## Best Practices

1. **Organize routers by domain**: Split large routers into smaller, focused routers
2. **Use Zod for validation**: Validate all inputs with Zod schemas
3. **Handle errors properly**: Use tRPC's error handling for consistent error responses
4. **Optimize queries**: Use React Query's caching features

## Conclusion

tRPC is a game-changer for TypeScript developers building full-stack applications. It eliminates the need for REST or GraphQL while providing superior type safety.`,
        status: "PUBLISHED" as const,
        categoryIds: [0, 4], // Technology, Tutorial
      },
      {
        title: "Modern UI Design Principles for 2025",
        content: `# Modern UI Design Principles for 2025

The landscape of UI design continues to evolve. In 2025, we're seeing a shift towards more minimalist, accessible, and user-centric designs. Let's explore the key principles that define modern UI design.

## Minimalism is King

Less is more. Modern UI design focuses on:

- **Clean layouts**: Plenty of white space
- **Clear hierarchy**: Important elements stand out
- **Purposeful elements**: Every element serves a function
- **Simple color palettes**: 2-3 primary colors

## Accessibility First

Designing for accessibility isn't optional—it's essential:

- Use sufficient color contrast (WCAG AA minimum)
- Ensure keyboard navigation works everywhere
- Provide alt text for images
- Design for screen readers
- Test with real users

## Dark Mode Support

Dark mode is now expected, not optional:

- Design both light and dark themes from the start
- Use CSS custom properties for easy theme switching
- Test readability in both modes
- Consider user preferences

## Micro-interactions

Small animations and feedback make interfaces feel alive:

- Button hover states
- Loading indicators
- Success/error messages
- Smooth transitions

## Mobile-First Approach

With mobile traffic dominating, design for mobile first:

- Touch-friendly targets (minimum 44x44px)
- Simplified navigation
- Optimized images
- Fast loading times

## Conclusion

Great UI design in 2025 is about creating experiences that are beautiful, accessible, and functional. Focus on your users' needs, and the design will follow.`,
        status: "PUBLISHED" as const,
        categoryIds: [1], // Design
      },
      {
        title: "Draft: Upcoming Features in Our Platform",
        content: `# Upcoming Features

We're working on several exciting features:

## Authentication System
- User registration and login
- Social auth (Google, GitHub)
- Role-based access control

## Enhanced Editor
- Rich text editing
- Image upload
- Markdown preview

## Analytics Dashboard
- View counts
- Popular posts
- User engagement metrics

This is still a work in progress!`,
        status: "DRAFT" as const,
        categoryIds: [2], // Business
      },
      {
        title: "10 Productivity Tips for Developers",
        content: `# 10 Productivity Tips for Developers

As developers, managing our time and energy effectively is crucial. Here are ten proven strategies to boost your productivity.

## 1. Use the Pomodoro Technique

Work in focused 25-minute blocks with 5-minute breaks. This prevents burnout and maintains high concentration.

## 2. Master Your IDE

Learn keyboard shortcuts for your editor. The time saved adds up quickly.

## 3. Automate Repetitive Tasks

If you do something more than twice, automate it. Write scripts, use code snippets, and leverage tools.

## 4. Take Regular Breaks

Your brain needs rest. Step away from the screen every hour. Go for a walk, stretch, or grab water.

## 5. Use Task Management

Tools like Notion, Todoist, or simple markdown files help track what needs to be done.

## 6. Practice Deep Work

Block out distractions for deep, focused work sessions. Turn off notifications, close unnecessary tabs.

## 7. Learn to Say No

Not every meeting needs your attendance. Not every feature request is urgent. Protect your time.

## 8. Document as You Go

Future you will thank present you for writing clear documentation and comments.

## 9. Stay Healthy

Exercise, sleep well, eat properly. Your code quality correlates with your physical and mental health.

## 10. Keep Learning

Technology evolves rapidly. Dedicate time to learning new tools, languages, and concepts.

## Conclusion

Productivity isn't about working more hours—it's about working smarter. Find what works for you and stick with it.`,
        status: "PUBLISHED" as const,
        categoryIds: [3], // Lifestyle
      },
    */

    const createdPosts = [];
    // No sample posts to create - users will create their own content
    
    console.log(`✅ No sample posts created\n`);

    console.log("🎉 Seeding completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`  - ${createdCategories.length} categories`);
    console.log(`  - ${createdPosts.length} posts`);
    console.log(`  - Database is ready for user-generated content`);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();

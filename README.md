# BlogSphere

A modern, full-stack blog application built with Next.js 15, featuring a type-safe API layer with tRPC, rich text editing capabilities, and comprehensive content management functionality.

## Project Description

BlogSphere is a complete blog management system that allows users to create, edit, and publish blog posts with category organization. The application features a professional dashboard for content management, a rich text editor powered by TipTap, real-time analytics, and a responsive design with dark mode support. Built with modern technologies and best practices, it provides a seamless experience for both content creators and readers.

## Tech Stack

### Core Framework
- **Next.js 15** - App Router for server-side rendering and routing
- **TypeScript** - Type safety across the entire application
- **React 19** - UI component library

### Backend & Database
- **PostgreSQL** - Relational database for data persistence
- **Drizzle ORM** - Type-safe database queries and migrations
- **tRPC** - End-to-end type-safe API layer
- **Zod** - Runtime validation and schema definition

### State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management via tRPC
- **Zustand** - Global client state management

### UI & Styling
- **Tailwind CSS** - Utility-first styling framework
- **TipTap** - Rich text editor with extensive formatting options
- **Lucide React** - Icon library

### Development Tools
- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS processing and optimization

## Features Implemented

### Priority 1: Must Have (Core Requirements)
- [x] Blog post CRUD operations (create, read, update, delete)
- [x] Category CRUD operations
- [x] Assign one or more categories to posts
- [x] Blog listing page showing all posts
- [x] Individual post view page
- [x] Category filtering on listing page
- [x] Basic responsive navigation
- [x] Clean, professional UI

### Priority 2: Should Have (Expected Features)
- [x] Landing page with 5 sections (Header, Hero, Features, CTA, Footer)
- [x] Dashboard page for managing posts
- [x] Draft vs Published post status
- [x] Loading and error states
- [x] Mobile-responsive design
- [x] Rich text editor (TipTap implementation)

### Priority 3: Nice to Have (Bonus Features)
- [x] Full 5-section landing page
- [x] Search functionality for posts
- [x] Post statistics (word count, reading time)
- [x] Dark mode support
- [x] Advanced rich text editor features
- [x] Post preview functionality
- [ ] Image upload for posts (not implemented)
- [ ] SEO meta tags (not implemented)
- [ ] Pagination (not implemented)

## Additional Features
- Real-time analytics dashboard with charts
- Category-based post organization
- Post status management (Draft/Published)
- Debounced search functionality
- Toast notifications for user feedback
- Delete confirmation modals
- Theme persistence with localStorage
- Reading time estimation
- Word count tracking
- Responsive design across all screen sizes

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or hosted)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Ananta2545/blog-sphere.git
cd blog-sphere
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
NODE_ENV="development"
PORT=3000
```

Replace `username`, `password`, and database details with your PostgreSQL credentials.

### 4. Database Setup
Run migrations to create the database schema:
```bash
npm run db:migrate
```

Seed the database with sample categories (optional):
```bash
npm run db:seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Project Structure

```
blog-app/
├── app/                          # Next.js App Router
│   ├── api/trpc/[trpc]/         # tRPC API route handler
│   ├── blog/                    # Blog pages
│   ├── categories/              # Categories page
│   ├── dashboard/               # Dashboard page
│   ├── components/              # React components
│   ├── store/                   # Zustand state management
│   ├── _trpc/                   # tRPC client setup
│   └── layout.tsx               # Root layout
├── server/                      # Backend logic
│   ├── trpc/                    # tRPC routers and procedures
│   ├── validations/             # Zod validation schemas
│   └── utils/                   # Utility functions
├── db/                          # Database
│   ├── schema/                  # Drizzle ORM schemas
│   ├── migrations/              # Database migrations
│   └── drizzle.ts               # Database configuration
└── public/                      # Static assets
```

## Key Technical Decisions

### 1. tRPC vs REST API
Chose tRPC for end-to-end type safety, eliminating the need for API contracts and reducing runtime errors. This decision improved development speed and code maintainability.

### 2. TipTap Rich Text Editor
Selected TipTap over markdown for its extensibility and user-friendly interface. While markdown would have been faster to implement, TipTap provides a better user experience for content creators.

### 3. Zustand for Client State
Used Zustand for lightweight global state management (theme, editor state, filters) while leveraging React Query via tRPC for server state. This separation of concerns keeps the architecture clean.

### 4. Server-Side Rendering
Implemented SSR for blog pages to improve SEO and initial load performance, while using client components for interactive features like the dashboard and editor.

### 5. Drizzle ORM
Chose Drizzle for its type-safe query builder and lightweight footprint compared to alternatives like Prisma. The direct SQL generation provides better performance control.

### 6. Toast Notifications
Implemented custom toast notification system instead of using a library to maintain full control over styling and behavior while keeping bundle size minimal.

## Trade-offs and Limitations

### What Was Not Implemented
1. **Pagination**: Posts are loaded in a single query with limit. Implementing cursor-based or offset pagination would improve performance for large datasets but was deprioritized in favor of core features.

2. **SEO Meta Tags**: Dynamic meta tags for individual posts were not implemented. This would require using Next.js metadata API for each post page.

3. **Image Upload**: Post images are not supported. Implementing this would require storage solution integration (S3, Cloudinary) and file upload handling.

### Design Decisions
1. **No Authentication**: The application is open for demonstration purposes. Adding authentication would require NextAuth.js or similar solution.

2. **Single User Context**: Designed for single-user usage. Multi-user support would require user relationships and authorization logic.

3. **In-Memory Query Cache**: Using default React Query settings. Production apps should consider cache persistence strategies.

4. **Client-Side Filtering**: Search and category filtering happen on the server, but status filtering is client-side. A hybrid approach balances server load with responsiveness.

## Database Schema

### Posts Table
- id (serial, primary key)
- title (varchar)
- content (text)
- slug (varchar, unique)
- status (enum: DRAFT, PUBLISHED)
- wordCount (integer)
- readingTimeMins (integer)
- createdAt (timestamp)
- updatedAt (timestamp)

### Categories Table
- id (serial, primary key)
- name (varchar, unique)
- slug (varchar, unique)
- description (text)
- createdAt (timestamp)

### Post_Categories Table (Junction)
- postId (foreign key)
- categoryId (foreign key)
- Composite primary key on (postId, categoryId)

## API Endpoints (tRPC Procedures)

### Post Router
- `post.getAll` - Get filtered posts with pagination
- `post.getById` - Get single post by ID
- `post.getBySlug` - Get single post by slug
- `post.create` - Create new post
- `post.update` - Update existing post
- `post.delete` - Delete post
- `post.getAnalytics` - Get post statistics

### Category Router
- `category.getAll` - Get all categories with post counts
- `category.getBySlug` - Get single category
- `category.create` - Create new category
- `category.update` - Update existing category
- `category.delete` - Delete category

## Development Timeline

Total development time: Approximately 7 days

- Day 1-2: Project setup, database schema, tRPC infrastructure
- Day 3-4: Core CRUD operations, blog listing, post view
- Day 5: Dashboard, TipTap editor integration
- Day 6: Category management, filtering, search
- Day 7: Landing page, dark mode, analytics, polish

## Future Enhancements

- User authentication and authorization
- Image upload and management
- Pagination for large datasets
- SEO optimization with dynamic meta tags
- Post versioning and history
- Commenting system
- Social sharing features
- Email notifications
- Advanced search with filters
- Post scheduling

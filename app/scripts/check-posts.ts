import { db } from '@/db/drizzle';
import { posts } from '@/db/schema';
async function checkPosts() {
  try {
    const allPosts = await db.select().from(posts);
    console.log('\n=== ALL POSTS IN DATABASE ===\n');
    allPosts.forEach((post) => {
      console.log(`ID: ${post.id}`);
      console.log(`Title: ${post.title}`);
      console.log(`Status: ${post.status}`);
      console.log(`Created: ${post.createdAt}`);
      console.log('---');
    });
    console.log(`\nTotal posts: ${allPosts.length}`);
    console.log(`Published: ${allPosts.filter(p => p.status === 'PUBLISHED').length}`);
    console.log(`Drafts: ${allPosts.filter(p => p.status === 'DRAFT').length}\n`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}
checkPosts();

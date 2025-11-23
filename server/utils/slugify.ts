/**
 * Converts a string to a URL-friendly slug
 * @param input - The string to slugify
 * @returns A URL-safe slug string
 * 
 * @example
 * slugify("Hello World!") // "hello-world"
 * slugify("My Awesome Post 123") // "my-awesome-post-123"
 */
export const slugify = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")           // Replace spaces and underscores with hyphens
    .replace(/[^\w\-]+/g, "")          // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, "-")            // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "")                // Trim hyphens from start
    .replace(/-+$/, "");               // Trim hyphens from end
};

/**
 * Generates a unique slug by appending a timestamp or counter if needed
 * @param input - The base string to slugify
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export const generateUniqueSlug = (
  input: string,
  existingSlugs: string[] = []
): string => {
  const baseSlug = slugify(input);
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
};
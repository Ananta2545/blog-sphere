/**
 * Calculates word count and estimated reading time for content
 * @param content - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 words/minute)
 * @returns Object containing wordCount and readingTimeMins
 * 
 * @example
 * getStats("This is a sample text with multiple words")
 * // { wordCount: 8, readingTimeMins: 1 }
 */
export const getStats = (
  content: string,
  wordsPerMinute: number = 200
): { wordCount: number; readingTimeMins: number } => {
  if (!content || content.trim().length === 0) {
    return { wordCount: 0, readingTimeMins: 0 };
  }

  // Remove markdown syntax for more accurate word count
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "") // Remove code blocks
    .replace(/`[^`]*`/g, "")         // Remove inline code
    .replace(/#+\s/g, "")            // Remove heading markers
    .replace(/[*_~]/g, "")           // Remove emphasis markers
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Extract link text
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "") // Remove images
    .replace(/<[^>]+>/g, "")         // Remove HTML tags
    .trim();

  // Split by whitespace and filter out empty strings
  const words = cleanContent.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;

  // Calculate reading time, minimum 1 minute if there's content
  const readingTimeMins = wordCount > 0 
    ? Math.max(1, Math.ceil(wordCount / wordsPerMinute))
    : 0;

  return {
    wordCount,
    readingTimeMins,
  };
};

/**
 * Formats reading time into a human-readable string
 * @param minutes - Number of minutes
 * @returns Formatted string like "5 min read"
 */
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return "< 1 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
};

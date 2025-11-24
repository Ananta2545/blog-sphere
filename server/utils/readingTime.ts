export const getStats = (
  content: string,
  wordsPerMinute: number = 200
): { wordCount: number; readingTimeMins: number } => {
  if (!content || content.trim().length === 0) {
    return { wordCount: 0, readingTimeMins: 0 };
  }

  const cleanContent = content
    .replace(/```[\s\S]*?```/g, "") 
    .replace(/`[^`]*`/g, "")         
    .replace(/#+\s/g, "")            
    .replace(/[*_~]/g, "")           
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") 
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "") 
    .replace(/<[^>]+>/g, "")         
    .trim();

  const words = cleanContent.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;
  const readingTimeMins = wordCount > 0 
    ? Math.max(1, Math.ceil(wordCount / wordsPerMinute))
    : 0;
  return {
    wordCount,
    readingTimeMins,
  };
};

export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return "< 1 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
};

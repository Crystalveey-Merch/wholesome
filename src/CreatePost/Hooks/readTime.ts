export const readTime = (content: string) => {
    // Average reading speed in words per minute
    const wordsPerMinute = 200;

    // Calculate the number of words in the content
    const wordCount = content.split(' ').length;

    // Calculate the reading time in minutes
    const readingTime = Math.ceil(wordCount / wordsPerMinute);

    return `${readingTime} min read`;
};
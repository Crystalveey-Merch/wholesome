/* eslint-disable react/prop-types */
// Import the highlightMentionsAndHashtags function

// Convert a title to a URL-friendly format
const convertedTitle = (title) => {
  return title.toLowerCase().split(" ").join("-");
};

// Function to highlight mentions and hashtags in text
function highlightMentionsAndHashtags(text, users) {
  if (!text) return text;

  // Regular expressions to match mentions and hashtags
  const mentionRegex = /@(\w+)/g;
  const hashtagRegex = /#(\w+)/g;

  // Highlight mentions
  text = text.replace(mentionRegex, (match, username) => {
    const user = users?.find((u) => u.username === username);
    if (user) {
      return `<a href="/profile/${user.id}" class="mention">@${username}</a>`;
    }
    return match; // If user not found, keep original mention
  });

  // Highlight hashtags
  text = text.replace(
    hashtagRegex,
    (match, hashtag) =>
      `<a href="/topic/${convertedTitle(hashtag)}" class="hashtag">#${hashtag}</a>`
  );

  return text;
}

// Functional component to display highlighted text
export const HighlightedText = ({ content, users }) => {
  if (!content?.trim()) {
    return null;
  }

  // Process the text to highlight mentions and hashtags
  const highlightedText = highlightMentionsAndHashtags(content, users);

  // Render the processed text using dangerouslySetInnerHTML
  return <div dangerouslySetInnerHTML={{ __html: highlightedText }} />;
};

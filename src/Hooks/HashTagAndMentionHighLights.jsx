/* eslint-disable react/prop-types */
// Import the highlightMentionsAndHashtags function
function highlightMentionsAndHashtags(text, users) {
  if (!text) return text;
  const mentionRegex = /@(\w+)/g;
  const hashtagRegex = /#(\w+)/g;

  // console.log("users", users);

  // Highlight mentions
  text = text.replace(mentionRegex, (match, username) => {
    const user = users?.find((u) => u.username === username);
    if (user) {
      return `<a href="/profile/${user.id}" class="mention">@${username}</a>`;
    }
    return match; // If user not found, keep original mention
  });

  // Highlight hashtags
  text = text.replace(hashtagRegex, '<span class="hashtag">#$1</span>');

  return text;
}

// Define a functional component
export const HighlightedText = ({ content, users }) => {
  if (content?.trim() === "") {
    return null;
  }
  // Process the text to highlight mentions and hashtags
  const highlightedText = highlightMentionsAndHashtags(content, users);

  // Render the processed text using dangerouslySetInnerHTML
  return <div dangerouslySetInnerHTML={{ __html: highlightedText }} />;
};

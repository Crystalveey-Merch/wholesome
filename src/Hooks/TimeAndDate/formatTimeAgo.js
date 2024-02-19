export const formatTimeAgo = (timestamp) => {
  const currentDate = new Date();
  const diffInMs = currentDate - timestamp;

  // Convert milliseconds to seconds
  const diffInSeconds = Math.floor(diffInMs / 1000);

  if (diffInSeconds < 60) {
    // Less than a minute
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 120) {
    // Less than 2 minutes
    return `1 minute ago`;
  } else if (diffInSeconds < 3600) {
    // Less than an hour
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else if (diffInSeconds < 7200) {
    // Less than 2 hours
    return `1 hour ago`;
  } else if (diffInSeconds < 86400) {
    // Less than a day
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  } else if (diffInSeconds < 172800) {
    // Less than 2 days
    return `1 day ago`;
  } else if (diffInSeconds < 518400) {
    // Less than 6 days
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  } else {
    // More than 6 days
    const date = timestamp.getDate();
    const month = timestamp.toLocaleString("default", { month: "short" });
    const year = timestamp.getFullYear();

    return `${date} ${month}${
      year !== currentDate.getFullYear() ? ", " + year : ""
    }`;
  }
};

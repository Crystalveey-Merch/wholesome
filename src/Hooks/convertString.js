const convertToLowercase = (title) => {
  return title.toLowerCase().split(" ").join("-");
};

const revertToTitleCase = (title) => {
  // CAPITALIZE FIRST LETTER OF EACH WORD
  return title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export { convertToLowercase, revertToTitleCase };

/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

export const Tags = ({ searchResults }) => {
  const navigate = useNavigate();

  const filteredTags = searchResults.filter((result) => result.type === "tags");

  const convertedTitle = (title) => {
    if (!title) {
      return "";
    }
    return title.toLowerCase().split(" ").join("-");
  };

  return (
    <div className="flex flex-col gap-2">
      {filteredTags && (
        <div className="flex flex-wrap gap-2">
          {filteredTags[0]?.value.map((tag, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  navigate(`/topic/${convertedTitle(tag)}`),
                    window.scrollTo(0, 0);
                }}
                className="text-sm text-black bg-gray-100 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors duration-300 ease-in-out w-max lowercase"
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

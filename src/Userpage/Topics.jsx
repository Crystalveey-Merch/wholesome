import { useParams } from "react-router-dom";

export const Topics = () => {
  const { topicSTR } = useParams();

//   const convertedTitle = (title) => {
//     return title.toLowerCase().split(" ").join("-");
//   };

  const reverseTitle = (title) => {
    return title.split("-").join(" ");
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <h1 className="font-inter text-2xl capitalize">Topic - {reverseTitle(topicSTR)}</h1>
    </div>
  );
};

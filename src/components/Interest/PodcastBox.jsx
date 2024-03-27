/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import {
  convertForURL,
  handleFormatTimestampToDate2,
  //   handleGetAudioLength,
  handleGetPodcastByEpisode,
  HighlightedText,
} from "../../Hooks";

export const PodcastBox = ({ episode, podcasts, users }) => {
  return (
    <div className="flex gap-2.5 sm:flex-col">
      <img
        src={handleGetPodcastByEpisode(episode, podcasts).logo}
        alt={episode.title}
        className="w-[200px] min-w-[200px] h-[220px] rounded-md sm:w-full"
      />
      <div className="flex flex-col gap-2 justify-start w-full">
        <div className="">
          <Link
            className="text-[1rem] font-semibold text-[#297fff] hover:underline cursor-pointer sm:text-sm"
            to={`/pod/${convertForURL(
              handleGetPodcastByEpisode(episode, podcasts).title
            )}`}
          >
            {handleGetPodcastByEpisode(episode, podcasts).title}
          </Link>
          <p className="text-sm text-gray-500 font-medium sm:text-xs">
            {handleGetPodcastByEpisode(episode, podcasts).owner}
          </p>
        </div>
        <Link
          to={`/pod/${convertForURL(
            handleGetPodcastByEpisode(episode, podcasts).title
          )}/episodes/${convertForURL(episode.title)}`}
        >
          <h2 className="text-[1.21rem] font-bold text-gray-900 one-line-text sm:text-lg">
            {episode.title}
          </h2>
          <div className="text-sm text-[rgb(75,79,82)] font-medium two-line-text sm:text-[0.85rem]">
            <HighlightedText content={episode.description} users={users} />
          </div>
        </Link>
        <div className="mt-2 flex gap-3 flex-col">
          <AudioPlayer
            // autoPlay
            src={episode.audioUrl}
            // onPlay={(_e) => console.log("onPlay")}
            layout="horizontal-reverse"
            showJumpControls={false}

            // other props here
          />
          <p className="text-sm text-gray-500 font-medium inline-flex gap-2 sm:text-[0.85rem]">
            <span className="">Episode 1 </span>
            <span>•</span>
            <span className="text-black font-semibold">
              {handleFormatTimestampToDate2(episode.createdAt)}
            </span>
            {/* <span>{handleGetAudioLength(episode.audioUrl).duration}</span> */}
          </p>
        </div>
      </div>
    </div>
  );
};

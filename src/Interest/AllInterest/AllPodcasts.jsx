/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../Features/userSlice";
import { Link } from "react-router-dom";
import { convertToLowercase } from "../../Hooks";
import { PodcastBox } from "../../components/Interest";

export const AllPodcasts = ({ interests, podcasts, users }) => {
  const loggedInUser = useSelector(selectUser);
  const [allPodcasts, setAllPodcasts] = useState([]);
  const [allEpisodes, setAllEpisodes] = useState([]);
  const [userInterests, setUserInterests] = useState([]);

  useEffect(() => {
    if (loggedInUser) {
      const userInterests = interests.filter((interest) =>
        interest.members.some((member) => member.userId === loggedInUser.id)
      );
      setUserInterests(userInterests);
    }
  }, [interests, loggedInUser]);

  // check if interest match with the podcast categories
  useEffect(() => {
    if (userInterests.length > 0 && podcasts.length > 0) {
      const lowercaseInterests = userInterests.map((interest) =>
        convertToLowercase(interest.name)
      );
      const allPodcasts = podcasts.filter((podcast) =>
        podcast.categories.some((category) =>
          lowercaseInterests.includes(convertToLowercase(category))
        )
      );
      setAllPodcasts(allPodcasts);
    }
  }, [userInterests, podcasts]);

  // get all episodes from all podcasts
  useEffect(() => {
    if (allPodcasts.length > 0) {
      const allEpisodes = allPodcasts.reduce((acc, podcast) => {
        return [...acc, ...podcast.episodes];
      }, []);
      setAllEpisodes(allEpisodes);
    }
  }, [allPodcasts]);

  return (
    <div className="pt-10 pb-20">
      <div className="flex justify-center items-center w-full">
        {allEpisodes?.length === 0 ? (
          <div className="flex justify-center flex-col items-center h-[400px] gap-5">
            <h4 className="text-3xl font-semibold text-gray-900">
              No podcasts available 😢
            </h4>
            <p className="text-gray-500 text-center">
              Join more interest group to see pocast from your interests.
              <br />
              <span>
                You can join an interest group{" "}
                <Link
                  to="/i/discover"
                  className="text-blue-500 hover:underline"
                >
                  here
                </Link>
                .
              </span>
            </p>
          </div>
        ) : (
          <div className="w-full max-w-3xl flex flex-col gap-5 pb-10 xl:mx-auto">
            {allEpisodes
              .sort((a, b) => b.timestamp - a.timestamp)
              .map((episode, index) => (
                <PodcastBox
                  key={index}
                  episode={episode}
                  podcasts={podcasts}
                  users={users}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

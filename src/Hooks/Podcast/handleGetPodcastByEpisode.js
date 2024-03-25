import { convertToLowercase } from "../convertString";

export const handleGetPodcastByEpisode = (episode, podcasts) => {
  const podcast = podcasts.find((podcast) =>
    podcast.episodes.some(
      (podcastEpisode) =>
        convertToLowercase(podcastEpisode.title) ===
        convertToLowercase(episode.title)
    )
  );
  return podcast;
};

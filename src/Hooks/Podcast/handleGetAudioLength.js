export const handleGetAudioLength = async (audioUrl) => {
  const audio = new Audio(audioUrl);
  return new Promise((resolve) => {
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
  });
};

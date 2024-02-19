/* eslint-disable react/prop-types */
import { TrendingArticlesCard, EventsCard } from "../components/Feed";

export const RightBar = ({ posts, loading, events }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[340px] min-h-[calc(100vh-158px)] h-max flex flex-col gap-4">
      <TrendingArticlesCard posts={posts} />
        <EventsCard events={events} />
    </div>
  );
};

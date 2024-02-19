/* eslint-disable react/prop-types */
import { TrendingArticlesCard, EventsCard } from "../components/Feed";

export const RightBar = ({ posts, loading, events, users }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[340px] min-h-[calc(100vh-158px)] h-max flex flex-col gap-4 xl:w-[300px] lg:w-[340px] lg:pb-16 md:w-[300px]">
      <TrendingArticlesCard posts={posts} users={users} />
      <EventsCard events={events} />

      <div className="hidden text-white lg:block">.</div>
    </div>
  );
};

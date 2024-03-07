/* eslint-disable react/prop-types */
import {
  CommunitySpotLightCard,
  TrendingArticlesCard,
  EventsCard,
  TagsCard,
} from "../components/Feed";

export const RightBar = ({ posts, loading, events, users, activities }) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[340px] min-h-[calc(100vh-158px)] h-max flex flex-col gap-4 xl:w-[300px] lg:w-[340px] lg:pb-16 md:w-[300px] sm:w-full">
      <CommunitySpotLightCard users={users} />
      <TrendingArticlesCard posts={posts} users={users} />
      <EventsCard events={events} />
      <TagsCard posts={posts} activities={activities} />
      <div className="hidden text-white lg:block">.</div>
    </div>
  );
};

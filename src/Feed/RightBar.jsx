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
    <div className="rightBar-width min-h-[calc(100vh-158px)] h-max flex flex-col gap-4 lg:pb-16 sm:w-full">
      <CommunitySpotLightCard users={users} />
      <TrendingArticlesCard posts={posts} users={users} />
      <EventsCard events={events} />
      <TagsCard posts={posts} activities={activities} />
      <div className="hidden text-white lg:block">.</div>
    </div>
  );
};

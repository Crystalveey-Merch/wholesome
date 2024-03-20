/* eslint-disable react/prop-types */
import {
  CommunitySpotLightCard,
  TrendingArticlesCard,
  EventsCard,
  TagsCard,
} from "../components/Feed";

export const MobileRightBar = ({
  posts,
  loading,
  events,
  users,
  activities,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  // console.log("MobileRightBar: ", posts, events, users, activities);
  return (
    <div className="rightBar-width min-h-[calc(100vh-158px)] h-max flex flex-col gap-4 lg:pb-16 lg:h-screen sm:w-full">
      {users && <CommunitySpotLightCard users={users} />}
      {posts && <TrendingArticlesCard posts={posts} users={users} />}
      {events && <EventsCard events={events} />}
      {posts && activities && (
        <TagsCard posts={posts} activities={activities} />
      )}
      <div className="hidden text-white lg:block">.</div>
    </div>
  );
};

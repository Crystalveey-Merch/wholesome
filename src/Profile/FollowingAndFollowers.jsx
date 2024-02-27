/* eslint-disable react/prop-types */
import { ConnectionHeader } from ".";

export const FollowersAndFollowing = ({ children }) => {
  return (
    <>
      <div>
        <ConnectionHeader />
      </div>
      {children}
    </>
  );
};

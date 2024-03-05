/* eslint-disable react/prop-types */

export const DiscoverInterests = ({ interests }) => {
  return (
    <div className="w-full flex flex-col gap-4 sm:px-4">
      <h4 className="font-semibold text-black text-lg sm:text-base">
        Discover interests groups that relates to you
      </h4>
      <div className="flex flex-wrap gap-4">
        {interests?.map((interest) => (
          <div
            key={interest?.id}
            className="text-sm text-black bg-gray-100 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors duration-300 ease-in-out"
          >
            {interest?.name}
          </div>
        ))}
      </div>
    </div>
  );
};

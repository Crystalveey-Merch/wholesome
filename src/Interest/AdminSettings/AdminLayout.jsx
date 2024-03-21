/* eslint-disable react/prop-types */
import { AdminSideBar } from ".";

export const AdminLayout = ({ children, interests }) => {
  return (
    <div className="flex place-self-end justify-self-end align-bottom justify-items-end h-[calc(100vh)] pt-[90px] overflow-hidden flex-row w-screen md:pt-[78px]">
      <AdminSideBar interests={interests} />
      <div className="flex-1 overflow-auto w-full">{children}</div>
    </div>
  );
};

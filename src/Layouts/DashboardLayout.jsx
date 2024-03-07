/* eslint-disable react/prop-types */
import { DashboardHeader } from "../components/Header/DashboardHeader";

export const DashboardLayout = ({ children, users, allChats }) => {
  return (
    <>
      <DashboardHeader users={users} allChats={allChats} />
      {children}
    </>
  );
};

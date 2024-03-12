/* eslint-disable react/prop-types */
import { DashboardHeader, MiniHeader } from "../components/Header";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";

export const DashboardLayout = ({ children, users, allChats }) => {
  const loggedInUser = useSelector(selectUser);
  return (
    <>
      {loggedInUser ? (
        <DashboardHeader users={users} allChats={allChats} />
      ) : (
        <MiniHeader />
      )}
      {children}
    </>
  );
};

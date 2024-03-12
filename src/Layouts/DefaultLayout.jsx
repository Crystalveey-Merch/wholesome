/* eslint-disable react/prop-types */
import { MiniHeader } from "../components/Header";
import Footer from "../Footer";
// import { useSelector } from "react-redux";
// import { selectUser } from "../Features/userSlice";

export const DefaultLayout = ({ children }) => {
  // const loggedInUser = useSelector(selectUser);
  return (
    <div className="pt-[90px] lg:pt-[80px] md:pt-[70px]">
      <MiniHeader />
      {children}
      <Footer />
    </div>
  );
};

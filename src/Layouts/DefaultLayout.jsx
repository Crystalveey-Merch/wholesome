/* eslint-disable react/prop-types */
import { MiniHeader } from "../components/Header/MiniHeader";
import Footer from "../Footer";

export const DefaultLayout = ({ children }) => {
  return (
    <div className="pt-[90px] lg:pt-[80px] md:pt-[70px]">
      <MiniHeader />
      {children}
      <Footer />
    </div>
  );
};

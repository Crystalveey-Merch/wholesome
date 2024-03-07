/* eslint-disable react/prop-types */
import { SideBar } from ".";

export const Layout = ({ children, interests }) => {
  return (
    <div className="w-screen font-inter h-screen mx-auto overflowhidden overflow-y-hidden pt-[89px] flex sm:pt-[76px]">
      <div className="z-30">
        <SideBar interests={interests} />
      </div>
      <div className="w-full max-w4xl flex justify-center flex-grow overflow-auto">
        {children}
      </div>
    </div>
  );
};

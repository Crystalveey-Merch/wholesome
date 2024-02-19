/* eslint-disable react/prop-types */
import Footer from "../Footer";

export const DefaultLayout = ({ children }) => {
  return (
    <div className="mt-24md:mt-20">
      {children}
      <Footer />
    </div>
  );
};

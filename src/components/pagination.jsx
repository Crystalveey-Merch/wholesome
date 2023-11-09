import { useState } from "react";
import PropTypes from "prop-types";


const Pagination = ({ postPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++) {
        pageNumbers.push(i);
    }
    const [activePage, setActivePage] = useState(1)
    const handlePrevious = () => {
        if (currentPage > 1) {
          paginate(currentPage - 1);
          setActivePage(currentPage - 1);

        }
      };
    
      const handleNext = () => {
        if (currentPage < pageNumbers.length) {
          paginate(currentPage + 1);
          setActivePage(currentPage + 1);

        }
      };
    

    return (
        <div>
            <nav className="mt-4 flex justify-center">
                
                <ul className="pagination flex">
                <li className="px-2">
            <a
              onClick={handlePrevious}
              href="#"
              className="bg-blue-500 hover:bg-blue-700 text-white hover:text-white font-bold py-2 px-4 rounded"
            >
              Previous
            </a>
          </li>

                    {pageNumbers.map((number) => (
                        <li key={number} className="px-2">
                            <a
                                onClick={() => {
                                    paginate(number);
                                    setActivePage(number);
                                }}
                                href="#"
                                className={`${activePage === number
                                    ? "bg-blue-700 text-white"
                                    : "bg-gray-400 hover:bg-blue-700 hover:scale-110 text-white hover:text-white"
                                    } font-bold py-2 px-4 rounded-full`}            >
                                {number}
                            </a>
                        </li>
                    ))}
                    <li className="px-2">
            <a
              onClick={handleNext}
              href="#"
              className="bg-blue-500 hover:bg-blue-700 text-white hover:text-white font-bold py-2 px-4 rounded"
            >
              Next
            </a>
          </li>
                </ul>
            </nav>
        </div>
    )
}

Pagination.propTypes = {
    postPerPage: PropTypes.number.isRequired,
    totalPosts: PropTypes.number.isRequired,
    paginate: PropTypes.func.isRequired,
  };

export default Pagination
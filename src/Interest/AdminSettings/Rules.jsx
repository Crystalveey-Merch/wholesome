/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Rule, AddRuleModal } from "../../components/Interest";

export const Rules = ({ interests }) => {
  const { name } = useParams();
  const navigate = useNavigate();

  const [interest, setInterest] = useState(null);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => interest.name.toLowerCase() === name
    );
    setInterest(interest);
  }, [name, interests]);

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="w-full py-8 px-8 flex justify-center items-center sm:px-6">
      <div className="w-full max-w-2xl flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="hidden md:flex md:items-center"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="text-black" />
            </button>
            <div className="flex w-full justify-between items-center">
              <h2 className="text-black font-inter font-semibold text-lg">
                Rules
              </h2>
              <button
                className="w-max group p-2.5 rounded-full flex items-center justify-center transition duration-300 ease-in-out hover:bg-gray-50"
                title="Add Rule"
                onClick={() => setOpenModal(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="text-black h-5 w-5" />
              </button>
            </div>
          </div>
          <p className="text-gray-600 font-normal text-[0.95rem]">
            You can add up to 10 rules to your interest group to help you manage
            it effectively.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          {interest?.rules.length > 0 ? (
            interest.rules.map((rule) => (
              <Rule
                key={rule.id}
                interest={interest}
                setInterest={setInterest}
                rule={rule}
              />
            ))
          ) : (
            <p className="text-gray-500 font-inter font-normal text-base">
              No rules have been added yet.
            </p>
          )}
        </div>
      </div>
      <AddRuleModal
        interest={interest}
        open={openModal}
        setOpen={setOpenModal}
        setInterest={setInterest}
      />
    </div>
  );
};

/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, updateUser } from "../Features/userSlice";
import { convertToLowercase } from "../Hooks";
import {
  faPlus,
  faEllipsis,
  faGear,
  faThumbTack,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  NavBar,
  Sharing,
  // UploadWallpaperModal,
  InviteModal,
} from "../components/Interest";
import { toast } from "react-toastify";
import { updateDoc, doc, db } from "../firebase/auth";
import { RightBar } from ".";

export const Interest = ({
  children,
  interests,
  users,
  setInterests,
  setUsers,
}) => {
  const { name } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(selectUser);
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  const url = `https://www.wholesquare.org/i/${name}`;

  //   console.log(url)
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const handleOpenInviteModal = () => {
    // only open if user is a member of the interest
    if (
      interest?.members?.some((member) => member?.userId === loggedInUser?.id)
    ) {
      setInviteModalOpen(true);
    } else {
      toast.error("You must be a member of the interest to invite others");
    }
  };

  const [joining, setJoining] = useState(false);
  const handleJoinInterest = async () => {
    setJoining(true);
    try {
      const interestRef = doc(db, `interests/${interest.id}`);
      const newMember = {
        userId: loggedInUser.id,
        joinedAt: new Date(),
      };
      await updateDoc(interestRef, {
        members: [...interest.members, newMember],
        updatedAt: new Date(),
      });
      setInterest({ ...interest, members: [...interest.members, newMember] });
      toast.success(`You have joined ${interest.name}`);
    } catch (error) {
      console.error("Error joining interest", error);
      toast.error(error.message);
    } finally {
      setJoining(false);
    }
  };

  const [leaving, setLeaving] = useState(false);
  const handleLeaveInterest = async () => {
    setLeaving(true);
    if (window.confirm(`Are you sure you want to leave ${interest.name}?`)) {
      if (interest.members.length === 1) {
        toast.error("You cannot leave an interest group with only one member");
        return;
      }

      // show toast error if user is the the only moderator
      if (
        interest.moderators.length === 1 &&
        interest.moderators[0].userId === loggedInUser.id
      ) {
        toast.error(
          "You cannot leave an interest as the only moderator, delete the interest instead"
        );
        return;
      }

      try {
        const interestRef = doc(db, `interests/${interest.id}`);
        const newMembers = interest.members.filter(
          (member) => member.userId !== loggedInUser.id
        );
        // remove user from moderators if they are a moderator
        const newModerators = interest.moderators.filter(
          (moderator) => moderator.userId !== loggedInUser.id
        );
        await updateDoc(interestRef, {
          members: newMembers,
          moderators: newModerators,
          updatedAt: new Date(),
        });
        setInterest({ ...interest, members: newMembers });
        toast.success(`You have left ${interest.name}`);
      } catch (error) {
        console.error("Error leaving interest", error);
        toast.error(error.message);
      } finally {
        setLeaving(false);
      }
    } else {
      setLeaving(false);
    }
  };

  const [showECDropdown, setShowECDropdown] = useState(false);
  const ecDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ecDropdownRef.current && !ecDropdownRef.current.contains(e.target)) {
        setShowECDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // add the interest id to user's sidebarPins
  const handlePinToSidebar = async () => {
    // if user is not logged in, redirect to login page
    if (!loggedInUser) {
      window.location.href = "/login";
      return;
    }
    // if user is not a member of the interest, show toast error
    if (!interest.members.some((member) => member.userId === loggedInUser.id)) {
      toast.error("You must join the interest to pin it to your sidebar");
      return;
    }

    try {
      const userRef = doc(db, `users/${loggedInUser.id}`);
      const newPin = {
        interestId: interest.id,
        pinnedAt: new Date(),
        pinNum: loggedInUser.sidebarPins.length + 1,
      };
      // if sidebarPins is more than 5, replace the last pin with the new pin
      let newSidebarPins = [];
      if (loggedInUser.sidebarPins.length >= 5) {
        newSidebarPins = [...loggedInUser.sidebarPins.slice(0, 4), newPin];
      } else {
        newSidebarPins = [...loggedInUser.sidebarPins, newPin];
      }
      await updateDoc(userRef, {
        sidebarPins: newSidebarPins,
      });
      dispatch(updateUser({ ...loggedInUser, sidebarPins: newSidebarPins }));
      toast.success(`${interest.name} has been pinned to your sidebar`);
    } catch (error) {
      console.error("Error pinning interest to sidebar", error);
      toast.error(error.message);
    }
  };

  const handleUnpinFromSidebar = async () => {
    try {
      const userRef = doc(db, `users/${loggedInUser.id}`);
      const newSidebarPins = loggedInUser.sidebarPins
        .filter((pin) => pin.interestId !== interest.id)
        .map((pin, index) => ({ ...pin, pinNum: index + 1 }));

      await updateDoc(userRef, {
        sidebarPins: newSidebarPins,
      });
      dispatch(updateUser({ ...loggedInUser, sidebarPins: newSidebarPins }));
      toast.info(`${interest.name} has been unpinned from your sidebar`);
    } catch (error) {
      console.error("Error unpinning interest from sidebar", error);
      toast.error(error.message);
    }
  };

  if (!interest) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        {/* check if wallPaper string is not empty */}
        <div className="w-full h-80 relative md:h-60">
          {interest.wallPaper !== "" ? (
            <img
              src={interest.wallPaper}
              alt="interest wallpaper"
              className="w-full h-full object-cover block"
            />
          ) : (
            <div className="w-full h-full bg-gray-100"></div>
          )}
          <div className="absolute top-7 right-7 flex gap-2 items-center sm:top-5 sm:right-5">
            {interest?.moderators?.some(
              (moderator) => moderator?.userId === loggedInUser?.id
            ) && (
              <button
                className="group relative h-10 w-10 rounded-md flex justify-center items-center shadow-md"
                onClick={() => navigate(`/i/${name}/settings`)}
              >
                <FontAwesomeIcon
                  icon={faGear}
                  className="text-white z-10 h-5 w-5"
                />
                <div className="absolute top-0 right-0 bg-black w-10 h-10 rounded-md opacity-30 hover:opacity-50 group-hover:opacity-50"></div>
              </button>
            )}
            <button
              className="group relative h-10 w-10 rounded-md flex justify-center items-center shadow-md"
              onClick={() => setShowECDropdown(!showECDropdown)}
            >
              <FontAwesomeIcon
                icon={faEllipsis}
                className="text-white z-10 h-5 w-5"
              />
              <div className="absolute top-0 right-0 bg-black w-10 h-10 rounded-md opacity-30 hover:opacity-50 group-hover:opacity-50"></div>
              {showECDropdown && (
                <div
                  ref={ecDropdownRef}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-12 right-0 bg-white shadow-md rounded-md z-10 p-2 w-60 flex flex-col gap-1.5 sm:w-52"
                >
                  <button
                    className="w-full flex items-center rounded-sm gap-2 p-2 hover:bg-gray-100"
                    onClick={
                      loggedInUser?.sidebarPins?.some(
                        (pin) => pin.interestId === interest.id
                      )
                        ? handleUnpinFromSidebar
                        : handlePinToSidebar
                    }
                  >
                    <FontAwesomeIcon
                      icon={faThumbTack}
                      className="text-black h-4 w-4"
                    />
                    <p className="text-black font-inter font-medium text-sm">
                      {loggedInUser?.sidebarPins?.some(
                        (pin) => pin.interestId === interest.id
                      )
                        ? "Unpin from sidebar"
                        : "Pin to sidebar"}
                    </p>
                  </button>
                  <button className="w-full flex items-center rounded-sm gap-2 p-2 hover:bg-gray-100 cursor-default opacity-50">
                    <FontAwesomeIcon
                      icon={faFlag}
                      className="text-black h-4 w-4"
                    />
                    <p className="text-black font-inter font-medium text-sm">
                      Report interest group
                    </p>
                  </button>
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="px-10 flex justify-between items-center md:flex-col md:items-start md:gap-5 md:px-4">
          {" "}
          <h2 className="text-3xl font-bold text-black font-inter lg:text-2xl">
            {interest.name}
          </h2>
          {loggedInUser ? (
            <div className="flex gap-3">
              {interest?.members?.some(
                (member) => member?.userId === loggedInUser?.id
              ) ? (
                <div className="flex gap-4 items-center">
                  <button
                    onClick={handleOpenInviteModal}
                    className="text-black bg-gray-200 px-4 py-2 flex gap-2.5 items-center rounded-lg transition duration-300 ease-in-out hover:bg-gray-300 md:py-2"
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-black h-4 w-4"
                    />
                    <p className="font-inter text-base font-medium sm:text-sm">
                      Invite
                    </p>
                  </button>
                  <button
                    onClick={handleLeaveInterest}
                    className="self-end bg-[#FF5841] font-inter text-white px-4 py-2 rounded-lg text-base font-medium md:py-2 transition duration-300 ease-in-out hover:bg-[#ec432d] sm:text-sm"
                  >
                    {leaving ? "Leaving..." : "Joined"}
                  </button>
                  <Sharing url={url} />
                </div>
              ) : (
                <button
                  onClick={handleJoinInterest}
                  className="self-end bg-[#FF5841] text-white  px-4 py-2 rounded-lg text-base font-medium  md:py-2 transition duration-300 ease-in-out hover:bg-[#ec432d] sm:text-sm"
                >
                  {joining ? "Joining..." : "Join"}
                </button>
              )}
            </div>
          ) : (
            <button
              className="self-end bg-[#FF5841] text-white  px-4 py-2 rounded-lg text-base font-inter font-medium md:py-2 transition duration-300 ease-in-out hover:bg-[#ec432d] sm:text-sm"
              onClick={() => (window.location.href = "/login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
      <hr className="mx-10 border-t border-gray-200 md:mx-4" />
      <div className="flex gap-10 w-full justify-between font-inter px-10 pb-3 md:px-4">
        <div className="w-full flex flex-col gap-10">
          {/* only show if location is /i/name or /i/name/events or /i/name/activities */}
          {location.pathname === `/i/${name}` ||
          location.pathname === `/i/${name}/events` ||
          location.pathname === `/i/${name}/activities` ||
          location.pathname === `/i/${name}/articles` ||
          location.pathname === `/i/${name}/podcasts` ||
          location.pathname === `/i/${name}/about` ? (
            <NavBar name={name} />
          ) : null}
          <div className="w-full max-w-3xl xl:mx-auto">{children}</div>
        </div>
        <div className="z-10 sticky block top-6 h-max lg:hidden">
          <RightBar interest={interest} />
        </div>
      </div>

      <InviteModal
        open={inviteModalOpen}
        setOpen={setInviteModalOpen}
        interest={interest}
        // interests={interests}
        users={users}
        setInterest={setInterest}
        // setInterests={setInterests}
        setUsers={setUsers}
      />
    </div>
  );
};

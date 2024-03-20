/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../Features/userSlice";
import { convertToLowercase } from "../Hooks";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  NavBar,
  Sharing,
  UploadWallpaperModal,
  InviteModal,
} from "../components/Interest";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateDoc, storage, doc, db } from "../firebase/auth";
import { RightBar } from ".";

export const Interest = ({
  children,
  interests,
  users,
  setInterests,
  setUsers,
}) => {
  const { name } = useParams();
  const loggedInUser = useSelector(selectUser);
  const [interest, setInterest] = useState([]);

  useEffect(() => {
    if (!name) return;
    const interest = interests.find(
      (interest) => convertToLowercase(interest.name) === name
    );
    setInterest(interest);
  }, [name, interests]);

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [wallPaperURL, setWallPaperURL] = useState(interest?.wallPaper || "");
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      //   if (file.size > 1048487) {
      //     alert("File size must be less than 1.5MB");
      //     return;
      //   }
      setPhoto(file);
      createImagePreview(file);
    } else {
      setPhoto(null);
    }
  };

  const createImagePreview = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Ensure reader.result is a string or provide a default value (empty string)
      const resultString = reader.result;
      setWallPaperURL(resultString);
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = async () => {
    try {
      if (loggedInUser) {
        setImageUploading(true);
        const storageRef = ref(storage, `wallpapers/${photo.name}`);
        const snapshot = await uploadBytes(storageRef, photo);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const interestRef = doc(db, `interests/${interest.id}`);
        await updateDoc(interestRef, {
          wallPaper: downloadURL,
          updatedAt: new Date(),
        });

        setIsImageOpen(false);
        alert("Wallpaper updated successfully");
        // console.log(currentUser.photoURL)
      }
    } catch (error) {
      console.error("Error updating wallpaper", error);
      toast.error(error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleClose = () => {
    setIsImageOpen(false);
    setPhoto(null);
    setWallPaperURL(interest.wallPaper || "");
  };

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

  if (!interest) return null;

  const defaultRules = [
    {
      id: 1,
      title: "Be respectful",
      description:
        "Treat others the way you would like to be treated. Do not insult, bully, or harass others.",
    },
    {
      id: 2,
      title: "No hate speech",
      description:
        "Do not promote or encourage hatred, violence, or discrimination against individuals or groups.",
    },
    {
      id: 3,
      title: "No spam",
      description: "Do not post irrelevant or unsolicited messages or content.",
    },
    // {
    //   id: 4,
    //   title: "No self-promotion",
    //   description:
    //     "Do not use the interest group to promote your own content or business",
    // },
  ];

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
          {interest?.moderators?.some(
            (moderator) => moderator?.userId === loggedInUser?.id
          ) && (
            <button
              className="absolute top-10 right-10 bg-gray-200 h-10 w-10 rounded-md flex justify-center items-center shadow-md sm:top-5 sm:right-5"
              onClick={() => setIsImageOpen(true)}
            >
              <FontAwesomeIcon icon={faPen} className="text-black" />
            </button>
          )}
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
          location.pathname === `/i/${name}/podcasts` ? (
            <NavBar name={name} />
          ) : null}
          <div className="w-full max-w-3xl xl:mx-auto">{children}</div>
        </div>
        <div className="z-10 sticky block top-0 h-max lg:hidden">
          <RightBar interest={interest} defaultRules={defaultRules} />
        </div>
      </div>
      <UploadWallpaperModal
        open={isImageOpen}
        handleClose={handleClose}
        photoURL={wallPaperURL}
        handleImageChange={handleImageChange}
        handleImageClick={handleImageClick}
        photo={photo}
        imageLoading={imageUploading}
      />
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

import React, { useState, useEffect } from "react";
import NavBar from "./super/NavBar";
import pfp from "../assets/profile/pfp.jpg";
import { Rating } from "@mui/material";
import Coords from "./Coords";
import Calendar from "./super/Calendar";
import Location from "./Location";
import Modal from "react-modal";
import close from "../assets/icons/x.svg";
import calendar from "../assets/icons/appoint/calendar.svg";
import { useParams } from "react-router-dom";
import Footer from "./super/Footer";
import axios from "axios";
import { useUserData } from "../App";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Profile = ({ lawyers }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const selectedLawyer = lawyers.find(
      (lawyer) => lawyer?.avocat.id.toString() === id
    );
    setLawyer(selectedLawyer);
    console.log(lawyer);
  }, [id, lawyers]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navLinks = [
    { label: t("nav-profile.about"), id: "about", offset: -50 },
    { label: t("nav-profile.categories"), id: "categories", offset: 0 },
    { label: t("nav-profile.reviews"), id: "reviews", offset: 50 },
    { label: t("nav-profile.location"), id: "location", offset: -100 },
  ];
  return (
    <>
      <div className="flex flex-col items-center mx-[4rem] my-4 py-8 px-12 bg-lightBrown min-h-max relative">
        <CalendarModal
          lawyer={lawyer}
          isOpen={isModalOpen}
          onRequestClose={closeModal}
        />
        <Coords lawyer={lawyer} onClick={openModal} />
        <NavBar links={navLinks} landing={false} />

        {lawyer && (
          <>
            <About lawyer={lawyer} />
            <Categories speciality={lawyer.speciality_name} />
            <Avis lawyer={lawyer} />
            <div className="w-full my-8"></div>
            <Location lawyer={lawyer.avocat} />
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Profile;

function CalendarModal({ lawyer, isOpen, onRequestClose }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const { t } = useTranslation();
  const handleToggleCalendar = () => {
    setShowCalendar((prevShowCalendar) => !prevShowCalendar);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={t("Book an appointment")}
      className={`transition-all duration-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md z-50 phone:max-tablet:h-[300px] phone:max-tablet:w-[260px] tablet:max-lg:w-[450px] tablet:max-lg:h-[320px] w-[640px] h-[436px]`}
      overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 backdrop-blur-xs z-40"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex h-full items-center"
      >
        <div
          className={` ${
            showCalendar ? "basis-[40%]" : "basis-[100%]"
          }  flex flex-col justify-center place-self-start flex-shrink-0 transition-all duration-300`}
        >
          <div className="flex w-full justify-between border-b border-b-primary pb-4">
            <h3>{t("Book an appointment")}</h3>
            <button onClick={onRequestClose}>
              <img src={close} className="border border-primary p-2" alt="" />
            </button>
          </div>
          <h3 className="py-5">{t("Choose the date and time")}</h3>
          <div
            className="flex border border-primary py-2 px-2 gap-3 cursor-pointer"
            onClick={handleToggleCalendar}
          >
            <img src={calendar} className="w-4" alt="" />
            <div className="flex flex-col">
              <small>{t("DATE")}</small>
              <p className="font-medium">{t("Select a date")}</p>
            </div>
          </div>
          <div className="flex-grow"></div>
          <div className="flex justify-end"></div>
        </div>
        {showCalendar && (
          <div
            className={` ${
              showCalendar ? "basis-[60%]" : "basis-[40%]"
            }  transition-all duration-300`}
          >
            <Calendar
              onOpen={setShowCalendar}
              isOpen={showCalendar}
              lawyer={lawyer}
              onClose={onRequestClose}
            />
          </div>
        )}
      </motion.div>
    </Modal>
  );
}

function About({ lawyer }) {
  const { t } = useTranslation();

  return (
    <div
      id="about"
      className=" w-full gap-[2rem] flex flex-col border-t-2 border-t-lightTypo opacity-70  pt-2"
    >
      <div className="w-[90%] flex flex-col gap-[2rem] tracking-wide ">
        <p>
          <strong>{t("Nom")}: </strong> {lawyer?.avocat?.first_name}{" "}
          {lawyer?.avocat?.last_name}
        </p>
        <p>
          <strong>{t("Email")}: </strong> {lawyer?.avocat?.email}
        </p>
        <p>
          <strong>{t("Ville")}: </strong> {lawyer?.avocat?.ville}
        </p>
        <p>
          <strong>{t("Langue")}: </strong> {lawyer?.avocat?.langue}
        </p>
        <p>
          <strong>{t("Site Web")}: </strong>{" "}
          <a href={lawyer?.avocat?.siteweb}>{lawyer?.avocat?.siteweb}</a>
        </p>
      </div>
    </div>
  );
}

function Categories({ speciality }) {
  const { t } = useTranslation();

  return (
    <div
      id="categories"
      className=" w-full my-[3rem] border-t-2 border-t-lightTypo opacity-70  pt-2"
    >
      <h3 className="font-semibold tracking-wide text-lightTypo">
        {t("Spécialité")}
      </h3>
      <p>{speciality}</p>
    </div>
  );
}

function Avis({ lawyer }) {
  const { t } = useTranslation();

  const [comments, setComments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add state for modal
  const { userData } = useUserData();

  // Inside the Avis component
  const submitFeedback = async (feedbackData) => {
    try {
      const response = await axios.post(
        "https://mohami-dz-estin.onrender.com/ratings/register_rating",
        feedbackData
      );
      console.log("Feedback submitted successfully:", response.data);

      // Fetch updated comments after submitting feedback
      const updatedResponse = await axios.get(
        `https://mohami-dz-estin.onrender.com/ratings/avocat_rating?id=${lawyer.avocat?.id}`
      );
      setComments(updatedResponse.data);

      closeModal(); // Close modal after successful submission
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://mohami-dz-estin.onrender.com/ratings/avocat_rating?id=${lawyer.avocat?.id}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [lawyer.avocat?.id]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      id="reviews"
      className=" w-full my-[3rem] border-t-2 border-t-lightTypo opacity-70  pt-2 flex flex-col gap-3"
    >
      <div className="flex justify-between font-semibold tracking-wide text-lightTypo">
        {t("Avis")}
        <GiveFeedBack
          lawyer={lawyer}
          userData={userData}
          onOpen={openModal}
          isOpen={isModalOpen}
          onSubmit={submitFeedback}
          onClose={closeModal}
        />
      </div>
      {comments.map((comment, index) => (
        <Comment key={index} comment={comment} lawyer={lawyer} />
      ))}
    </div>
  );
}

const GiveFeedBack = ({
  onOpen,
  isOpen,
  onSubmit,
  onClose,
  lawyer,
  userData,
}) => {
  const { t } = useTranslation();

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  // Inside the GiveFeedback component
  const handleSubmit = async () => {
    if (feedback.trim() === "" || rating === 0) {
      // Handle validation or display an error message
      return;
    }

    onSubmit({
      client_id: userData?.userID,
      avocat_id: lawyer?.avocat.id,
      comment: feedback,
      rating: rating,
    });

    setFeedback(""); // Clear feedback input after submission
    setRating(0); // Reset rating after submission
    onClose(); // Close the modal after submitting feedback
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel={t("Give Feedback")}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-md z-50 w-[450px]"
        overlayClassName="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 backdrop-blur-xs z-40 flex justify-center items-center"
      >
        <div>
          <h2 className="text-lg font-semibold mb-4">{t("Donner un avis")}</h2>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={t("Write your feedback...")}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
          <div className="flex items-center gap-2 mb-2">
            <span>{t("Votre évaluation")}:</span>
            <Rating
              name="feedback-rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className=" bg-primary text-white px-4 py-2 rounded-md hover:opacity-80 mr-2"
            >
              {t("Confirmer")}
            </button>
            <button
              onClick={onClose}
              className="text-gray-600 px-4 py-2 rounded-md hover:text-gray-800"
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </Modal>
      <p className=" cursor-pointer hover:opacity-75" onClick={() => onOpen()}>
        {t("Donner un avis")}
      </p>
    </>
  );
};

function Comment({ comment, lawyer }) {
  const { userData } = useUserData();
  return (
    <li className="flex justify-between bg-white p-3 rounded-md">
      <div className=" flex flex-col gap-5">
        <strong>
          <div className="flex gap-3 items-center">
            <img src={pfp} alt="" />{" "}
            <div className=" flex flex-col">
              {comment?.client?.username}
              <Rating
                readOnly={lawyer?.avocat.id == userData?.userID}
                className=""
                name="simple-controlled"
                value={comment?.rating?.rating}
              />
            </div>
          </div>{" "}
        </strong>{" "}
        <p>{comment?.rating?.comment}</p>
      </div>
      date
    </li>
  );
}

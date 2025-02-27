import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/super/Footer";
import Loading from "../components/Loading";
import axios from "axios";
import { useMutation, useQuery } from "react-query";

const Specialty = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [nomSpecialite, setNomSpecialite] = useState("");
  const [description, setDescription] = useState("");

  const {
    data: specialities,
    isLoading,
    refetch,
  } = useQuery("specialities", async () => {
    const response = await axios.get(
      "https://mohami-dz-estin.onrender.com/speciality/speciality_list"
    );
    return response.data;
  });

  const addSpecialtyMutation = useMutation(
    (newSpecialty) =>
      axios.post(
        "https://mohami-dz-estin.onrender.com/speciality/create_speciality",
        newSpecialty
      ),
    {
      onSuccess: () => {
        // Once the mutation is successful, refetch the data to update the list
        refetch();
        // Clear the form fields
        setNomSpecialite("");
        setDescription("");
        setShowModal(false);
      },
    }
  );

  const updateSpecialtyMutation = useMutation(
    (updatedSpecialty) =>
      axios.post(
        "https://mohami-dz-estin.onrender.com/speciality/speciality_update",
        updatedSpecialty
      ),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const deleteSpecialtyMutation = useMutation(
    (specialtyId) =>
      axios.post(
        `https://mohami-dz-estin.onrender.com/speciality/speciality_delete`,
        specialtyId
      ),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const handleAddSpecialite = () => {
    const newSpecialty = {
      name: nomSpecialite,
      description: description,
    };

    addSpecialtyMutation.mutate(newSpecialty);
  };

  const handleUpdateSpecialty = (spec) => {
    // Assuming you have a way to collect updated data for the specialty, for example, in a form
    const updatedSpecialty = {
      speciality: { name: spec.name },
      id_speciality: spec.id,
      // Add other fields if necessary
    };

    updateSpecialtyMutation.mutate(updatedSpecialty);
  };

  const handleDeleteSpecialty = (specialtyId) => {
    deleteSpecialtyMutation.mutate(specialtyId);
  };

  return (
    <div className="flex flex-col w-full pt-5 ">
      <div className="mx-[4rem] flex mb-4 phone:max-lg:flex-col phone:max-lg:items-start justify-between items-center">
        <h2 className="recursive flex-shrink-0">{t("list spec")}</h2>
        <button
          className="flex items-center gap-2 hover:bg-opacity-70 h-max px-6 py-1 text-base bg-primary text-white"
          onClick={() => setShowModal(true)}
        >
          <span>+</span> {t("ajouter spec")}
        </button>
      </div>

      {/* Modal/Dialog */}
      {showModal && (
        <div className="fixed inset-0 flex z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">{t("add spec")}</h2>
            <div className="mb-4">
              <label htmlFor="nomSpecialite" className="block mb-1">
                {t("nom spec")}
              </label>
              <input
                type="text"
                id="nomSpecialite"
                value={nomSpecialite}
                onChange={(e) => setNomSpecialite(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block mb-1">
                {t("description")}
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-70"
                onClick={handleAddSpecialite}
              >
                {t("add")}
              </button>
              <button
                className="px-4 py-2 ml-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className=" min-h-screen flex flex-col bg-lightBrown px-[3rem] py-[1.5rem] mx-[4rem]">
        {isLoading ? (
          <Loading />
        ) : (
          [...specialities]
            .reverse()
            .map((spec) => (
              <SpecialtyCard
                spec={spec}
                onUpdate={handleUpdateSpecialty}
                onDelete={handleDeleteSpecialty}
              />
            ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Specialty;

function SpecialtyCard({ spec, onUpdate, onDelete }) {
  const { t } = useTranslation();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedName, setUpdatedName] = useState("");

  const handleUpdate = () => {
    // Set the updated name initially to the old specialty name
    setUpdatedName(spec.name);
    setShowUpdateModal(true);
  };

  const handleDelete = () => {
    onDelete(spec.id);
  };

  return (
    <div className="bg-white rounded-md p-4 my-2 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{spec.name}</h3>
        <p className="text-gray-500">{spec.description}</p>
      </div>
      <div>
        <button className="text-blue-500 mr-2" onClick={handleUpdate}>
          {t("update")}
        </button>
        <button className="text-red-500" onClick={handleDelete}>
          {t("delete")}
        </button>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">{t("update spec")}</h2>
            <div className="mb-4">
              <label htmlFor="updatedName" className="block mb-1">
                {t("nom spec")}
              </label>
              <input
                type="text"
                id="updatedName"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-70"
                onClick={() => {
                  onUpdate({ id: spec.id, name: updatedName });
                  setShowUpdateModal(false);
                }}
              >
                {t("update")}
              </button>
              <button
                className="px-4 py-2 ml-4 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={() => setShowUpdateModal(false)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

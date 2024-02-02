import React, { useState, createContext, useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LandingPage from "./LandingPage";
import SignIn from "./SignIn";
import Search from "./client/Search";
import HomeLayout from "./components/super/HomeLayout";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import axios from "axios";
import OwnProfile from "./OwnProfile";
import AdminPage from "./admin/AdminPage";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "../Translation/i18n";
import Specialty from "./admin/Specialty";
import { toast, Toaster } from "react-hot-toast";

const UserDataContext = createContext();

const App = () => {
  const [language, setLanguage] = useState(i18n.language);
  const [lawyers, setLawyers] = useState([]);
  const { t } = useTranslation();
  const languageCode = t("languageCode");

  useEffect(() => {
    document.documentElement.lang = languageCode;
  }, [languageCode]);

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await axios.get("http://backend:8000/avocat/avocats");
        console.log(response.data);
        setLawyers(response.data);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      }
    };

    fetchLawyers(); // Call fetchLawyers when the component mounts
  }, []); // Empty dependency array ensures fetchLawyers is called only onc

  const [userData, setUserData] = useState(null);
  
  return (
    <UserDataContext.Provider
      value={{
        userData,
        setUserData,
        lawyers,
        setLawyers,
        language,
        setLanguage,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<LandingPage />} />
          <Route
            path={"/profile/:id"}
            element={
              <HomeLayout pageComponent={<Profile lawyers={lawyers} />} />
            }
          />
          <Route
            path={"/SelfProfile"}
            element={
              <HomeLayout pageComponent={<OwnProfile lawyer={userData} />} />
            }
          />
          <Route
            path={"/AdminPage"}
            element={
              <HomeLayout
                admin={true}
                pageComponent={
                  <AdminPage lawyers={lawyers} setLawyers={setLawyers} />
                }
              />
            }
          />

          <Route
            path={"/Search"}
            element={
              <HomeLayout
                pageComponent={
                  <Search lawyers={lawyers} setLawyers={setLawyers} />
                }
              />
            }
          />
          <Route
            path={"/Specialty"}
            element={<HomeLayout admin={true} pageComponent={<Specialty />} />}
          />

          <Route path={"/Signin"} element={<SignIn />} />

          <Route
            path={"/SignUp"}
            element={<HomeLayout pageComponent={<SignUp />} />}
          />
        </Routes>{" "}
      </BrowserRouter>
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);

export default App;

const root = createRoot(document.getElementById("root"));
root.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);

{
  /*<Toaster richColors position="top-right" />*/
}
{
  /*  <Route
            path={"/imed"}
            element={
              <HomeLayout
                pageComponent={
                  <>
                    <div>
                      Pick one :{" "}
                      <span
                        className="text-green-400 rounded-lg bg-green-200 p-2"
                        onClick={() => setTest(true)}
                      >
                        1
                      </span>{" "}
                      <span
                        className="text-red-400 rounded-lg bg-red-200 p-2"
                        onClick={() => setTest(false)}
                      >
                        2
                      </span>
                      <div
                        onClick={showToast}
                        className=" px-3 py-1.5 bg-gray-200 text-gray-400"
                      >
                        Confirm choice
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        toast.error((t) => (
                          <span>
                            <button onClick={() => {}}>Hmmm</button>
                          </span>
                        ));
                        console.log("ok");
                      }}
                    >
                      Click here to activate toast error{" "}
                    </div>
                  </>
                }
              />
            }
          /> */
}

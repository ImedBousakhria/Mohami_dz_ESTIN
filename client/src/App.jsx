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
import { QueryClient, QueryClientProvider } from "react-query";

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
        const response = await axios.get(
          "https://mohami-dz-estin.onrender.com/avocat/avocats"
        );
        console.log(response.data);
        setLawyers(response.data);
      } catch (error) {
        console.error("Error fetching lawyers:", error);
      }
    };

    fetchLawyers(); // Call fetchLawyers when the component mounts
  }, []); // Empty dependency array ensures fetchLawyers is called only once

  const [userData, setUserData] = useState(null);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
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
                <HomeLayout
                  signup={true}
                  pageComponent={<OwnProfile lawyer={userData} />}
                />
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
              element={
                <HomeLayout admin={true} pageComponent={<Specialty />} />
              }
            />

            <Route path={"/Signin"} element={<SignIn />} />

            <Route
              path={"/SignUp"}
              element={<HomeLayout signup={true} pageComponent={<SignUp />} />}
            />
          </Routes>{" "}
        </BrowserRouter>
      </UserDataContext.Provider>
    </QueryClientProvider>
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
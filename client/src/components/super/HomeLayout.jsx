import React, { useState } from "react";
import NavBar from "./NavBar";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const HomeLayout = ({ pageComponent, admin, signup }) => {
  const { t } = useTranslation();

  const adminNav = [
    { label: t("specialités"), to: "/specialty" },
    { label: t("Liste des avocats"), to: "/AdminPage" },
  ];
  const navLinks = [
    { label: t("home"), to: "/" },
    { label: t("findLawyer"), to: "/Search" },
  ];
  const signLinks = [{ label: t("home"), to: "/" }];
  return (
    <div className=" flex flex-col min-h-screen items-center">
      <Toaster position="top-right" />

      <div className="flex justify-center border-b border-b-primary w-[90%]">
        <Link className=" w-max" to="/">
          <header className=" cursor-pointer p-3 recursive text-center font-semibold text-xl">
            DZ Mouhami
          </header>
        </Link>
      </div>
      <NavBar
        links={signup ? signLinks : admin ? adminNav : navLinks}
        landing={true}
        l={false}
      />

      <div className={`w-full`}>{pageComponent}</div>
    </div>
  );
};

export default HomeLayout;

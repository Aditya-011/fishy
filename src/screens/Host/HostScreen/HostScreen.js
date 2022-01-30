import React from "react";
import { Link } from "react-router-dom";
import "./HostScreen.css";

const HostScreen = () => {
  return (
    <div className="w-full flex flex-col bg-card bg-no-repeat bg-cover bg-blend-screen shadow-lg rounded-lg px-8 pt-6 pb-8  h-full text-yellow-500 justify-center items-center host-btn">
      <p className="pt-2 text-2xl font-bold">Admin authentication</p>
      <Link to="/admin/link">
        <button className="button font-semibold border-2 border-yellow-500 text-yellow-500 btn-lg mt-3">
          Enter
        </button>
      </Link>
    </div>
  );
};

export default HostScreen;

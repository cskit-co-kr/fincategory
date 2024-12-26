import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { LuArrowBigLeft } from "react-icons/lu";

function ActiveUsers() {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    async function fetchActiveUsers() {
      const response = await fetch(
        "https://test-backend.fincago.com/v1/user/active-users"
      );
      const data = await response.json();
      setActiveUsers(data.activeUsers || 0);
    }
    fetchActiveUsers();
  }, []);

  return (
    <div className="text-xs font-semibold text-[#18D166]">
      Online : {activeUsers}
    </div>
  );
}

const FixedBarSection = ({ addButton }: any) => {
  const [isHide, setIsHide] = useState(true);
  return (
    <>
      <div
        onClick={() => setIsHide(true)}
        className={`fixed h-screen w-screen bg-black opacity-5 lg:hidden z-40 top-0 ${
          isHide ? "invisible opacity-0" : "opacity-5"
        }`}
      ></div>
      <div
        className={`${
          isHide
            ? "duration-300 -right-[145px] lg:right-5 2xl:right-[5%]"
            : "right-5 2xl:right-[5%]"
        } fixed z-50 top-1/2 -translate-y-1/2 lg:translate-y-0 lg:top-[113px] gap-3 w-[145px] p-3 transition-all shadow-xl items-center bg-white rounded-xl  flex flex-col`}
      >
        <div
          onClick={() => setIsHide(false)}
          className={`${
            isHide ? "" : "hidden"
          } absolute lg:hidden top-1/2 -translate-y-1/2 bg-primary rounded-l-full px-1 py-2 text-white text-5xl right-full`}
        >
          <LuArrowBigLeft />
        </div>
        <div className="flex gap-[10px] p-[10px] items-center ">
          <div className="w-[10px] h-[10px] rounded-full bg-[#18D166]" />
          {ActiveUsers()}
        </div>{" "}
        {addButton}
      </div>
    </>
  );
};

export default FixedBarSection;

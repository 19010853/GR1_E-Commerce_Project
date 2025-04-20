import React from "react";
import { BiLogOutCircle } from "react-icons/bi";

const Sidebar = () => {
  return (
    <div>
      <ul>
        <li>
          <button className="text-[#030811] font-bold duration-200 px-[12px] py-[9px] rounded-sm flex justify-start items-center gap-[12px] hover:pl-4 transition-all w-full mb-1">
            <span>
              <BiLogOutCircle />
            </span>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

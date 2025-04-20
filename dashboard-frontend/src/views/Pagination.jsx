import React, { useLayoutEffect } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const Pagination = ({
  pageNumber,
  setPageNumber,
  totalItem,
  parPage,
  showItem,
}) => {
  let totalPage = Math.ceil(totalItem / parPage);
  let startPage = pageNumber;

  let dif = totalPage - pageNumber;

  if (dif <= showItem) {
    startPage = totalPage - showItem;
  }

  let endPage = startPage < 0 ? showItem : startPage + showItem;

  if (startPage <= 0) {
    startPage = 1;
  }

  const createButtons = () => {
    const buttons = [];
    for (let index = startPage; index < endPage; index++) {
      buttons.push(
        <li
          onClick={() => setPageNumber(index)}
          key={index}
          className={`${
            pageNumber === index
              ? "bg-indigo-300 shadow-indigo-300/50 text-white"
              : "bg-slate-600 hover:bg-indigo-400 shadow-lg hover:shadow-indigo-500/50 hover:text-white text-[#d0d2d6]"
          } w-[33px] h-[33px] rounded-full flex justify-center items-center cursor-pointer`}
        >
          {index}
        </li>
      );
    }
    return buttons;
  };

  return (
    <ul className="flex gap-3 ">
      {pageNumber > 1 && (
        <li
          onClick={() => setPageNumber(pageNumber - 1)}
          className="w-[33px] h-[33px] rounded-full flex justify-center items-center bg-slate-300 text-black cursor-pointer"
        >
          <MdKeyboardDoubleArrowLeft />
        </li>
      )}
      {createButtons()}
      {pageNumber < totalPage && (
        <li
          onClick={() => setPageNumber(pageNumber + 1)}
          className="w-[33px] h-[33px] rounded-full flex justify-center items-center bg-slate-300 text-black cursor-pointer"
        >
          <MdKeyboardDoubleArrowRight />
        </li>
      )}
    </ul>
  );
};

export default Pagination;

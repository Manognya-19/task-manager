import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  // If modal is closed, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 inset-0 z-50 flex items-center justify-center w-full h-[calc(100%-lrem)] max-h-full overflow-y-auto overflow-x-hidden bg-black/20 bg-opacity">
      {/* Backdrop */}
      <div
        className="relative p-4 w-full max-w-2xl max-h-full"
        // onClick={onClose}
      >

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-gray-700 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
          <button
          type="button"
            onClick={onClose}
            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
          > ✕
          {/* <svg
            className="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              />
            </svg> */}
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5">{children}</div>
      </div>
    </div>
  </div>
  );
};

export default Modal;

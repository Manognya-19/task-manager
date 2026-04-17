import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");

  // Add attachment
  const handleAddOption = () => {
    if (!option.trim()) return;

    setAttachments([...attachments, option.trim()]);
    setOption("");
  };

  // Delete attachment
  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ATTACHMENTS LIST */}
      <div className="flex flex-col gap-2">
        {attachments.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2"
          >
            {/* Left: icon + text */}
            <div className="flex items-center gap-3 overflow-hidden">
              <LuPaperclip className="text-gray-400 shrink-0" />
              <p className="text-xs text-black truncate">{item}</p>
            </div>

            {/* Right: delete */}
            <button
              className="cursor-pointer"
              onClick={() => handleDeleteOption(index)}
            >
              <HiOutlineTrash className="text-red-500 text-lg" />
            </button>
          </div>
        ))}
      </div>

      {/* INPUT + ADD BUTTON */}
      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-md px-3 py-2">
          <LuPaperclip className="text-gray-400" />

          <input
            type="text"
            placeholder="Add File Link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-transparent"
          />
        </div>

        <button
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 font-medium shrink-0 whitespace-nowrap"
          onClick={handleAddOption}
        >
          <HiMiniPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;

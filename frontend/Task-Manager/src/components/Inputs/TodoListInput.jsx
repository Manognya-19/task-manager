import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (!option.trim()) return;
    setTodoList([...todoList, option.trim()]);
    setOption("");
  };

  const handleDeleteOption = (index) => {
    setTodoList(todoList.filter((_, i) => i !== index));
  };

  return (
  <div className="w-full flex flex-col gap-4">
    {/* TODO LIST */}
    <div className="flex flex-col divide-y">
      {todoList.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between px-4 py-3"
        >
          {/* LEFT: number + task */}
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-500">
              {String(index + 1).padStart(2, "0")}
            </span>

            <span className="text-sm font-medium text-gray-900">
              {item}
            </span>
          </div>

          {/* RIGHT: delete */}
          <button onClick={() => handleDeleteOption(index)}>
            <HiOutlineTrash className="text-red-500 text-lg" />
          </button>
        </div>
      ))}
    </div>

    {/* INPUT + ADD (ALWAYS AT BOTTOM) */}
    <div className="flex items-center gap-4 w-full pt-2">
      <input
        type="text"
        placeholder="Enter Task"
        value={option}
        onChange={(e) => setOption(e.target.value)}
        className="flex-1 min-w-0 border rounded-md px-3 py-2 text-sm"
      />

      <button
        onClick={handleAddOption}
        className="flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-100 text-blue-600 font-medium shrink-0 whitespace-nowrap"
      >
        <HiMiniPlus />
        Add
      </button>
    </div>
  </div>
);
};

export default TodoListInput;

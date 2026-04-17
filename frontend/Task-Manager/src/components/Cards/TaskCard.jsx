import React from "react";
import moment from "moment";
import Progress from "../Progress";
import AnimeGroup from "../AnimeGroup";
import { LuPaperclip } from "react-icons/lu";

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo = [],
  attachmentCount,
  todoChecklist = [],  
  onClick,
}) => {
  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };
 const completedTodoCount = todoChecklist.filter(
  (t) => t.completed
).length;

const totalTodos = todoChecklist.length;

const calculatedProgress =
  status === "Completed"
    ? 100
    : totalTodos > 0
    ? Math.round((completedTodoCount / totalTodos) * 100)
    : 0;

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "Medium":
        return "text-amber-500 bg-amber-50 border border-amber-500/10";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md cursor-pointer"
    >
      {/* Status & Priority */}
      <div className="flex gap-2 mb-2">
        <span className={`text-[11px] px-4 py-0.5 rounded ${getStatusTagColor()}`}>
          {status}
        </span>
        <span className={`text-[11px] px-4 py-0.5 rounded ${getPriorityTagColor()}`}>
          {priority} Priority
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm">{title}</h3>

      {/* Description */}
      <p className="text-xs text-gray-500 mt-1">{description}</p>

      {/* Progress */}
   
      <div className="mt-3">

      <Progress progress={calculatedProgress} status={status} />

      </div>

      {/* Dates */}
      <div className="flex justify-between text-xs text-gray-500 mt-3">
        <div>
          <label className="block">Start Date</label>
          <p>{moment(createdAt).format("DD MMM YYYY")}</p>
        </div>
        <div>
          <label className="block">Due Date</label>
          <p>{moment(dueDate).format("DD MMM YYYY")}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
      <AnimeGroup anime={assignedTo || []} />

      <div className="flex items-center gap-3">
        {/* Attachments */}
        {attachmentCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <LuPaperclip className="text-sm" />
            <span>{attachmentCount}</span>
          </div>
        )}

        {/* Todo progress */}
        <p className="text-xs text-gray-500">
          Task Done:{" "}
          <span className="font-medium">
            {completedTodoCount}/{todoChecklist.length || 0}
          </span>
        </p>
      </div>
    </div>
    </div>
  );
};

export default TaskCard;

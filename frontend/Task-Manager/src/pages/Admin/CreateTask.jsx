import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import moment from "moment";

import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

const CreateTask = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { taskId } = location.state || {};

  const [taskData, setTaskData] = useState({
  title: "",
  description: "",
  priority: "Low",
  dueDate: "",
  assignedTo: [],
  todoChecklist: [],
  attachments: [],
});
   
  const [currentTask, setCurrentTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  // -------------------------
  // Helpers
  // -------------------------
  const handleValueChange = (key, value) => {
    setTaskData(prev => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };


  // -------------------------
  // API Calls
  // -------------------------

const createTask = async () => {
  try {
    setLoading(true);
const payload = {
  title: taskData.title.trim(),
  description: taskData.description.trim(),
  priority: taskData.priority,

  // MUST be Date
  dueDate: new Date(taskData.dueDate).toISOString(),


  // MUST be array of ObjectId strings
  assignedTo: taskData.assignedTo
    .map(u => (typeof u === "string" ? u : u?._id))
    .filter(Boolean),

  // MUST be array of strings
  todoChecklist: taskData.todoChecklist
  .map(t => ({
    text: typeof t === "string" ? t : t?.text,
    completed: false,
  }))
  .filter(t => t.text),


  // MUST be array of strings (URLs)
  attachments: taskData.attachments
    .map(a => {
      if (typeof a === "string") return a;
      if (a?.url) return a.url;
      return null;
    })
    .filter(Boolean),
};

await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, payload);
toast.success("Task Created Successfully");
    clearData();
  } catch (error) {
    console.error("Error creating task:", error);
    toast.error(error?.response?.data?.message || "Server error");
  } finally {
    setLoading(false);
  }
};


  // Update Task
const updateTask = async () => {
  setLoading(true);

  try {
    const prevTodos = currentTask?.todoChecklist || [];

    const todoList = (taskData.todoChecklist || []).map((item) => {
      const matched = prevTodos.find((t) => t.text === item);
      return {
        text: item,
        completed: matched ? matched.completed : false,
      };
    });

    const payload = {
      title: taskData.title?.trim() || "",
      description: taskData.description?.trim() || "",
      priority: taskData.priority || "Low",

      dueDate: taskData.dueDate
        ? new Date(taskData.dueDate).toISOString()
        : null,

      assignedTo: (taskData.assignedTo || []).map((u) =>
        typeof u === "string" ? u : u?._id
      ),

      todoChecklist: todoList,

      attachments: (taskData.attachments || []).map((a) =>
        typeof a === "string" ? a : a?.url
      ),
    };

    await axiosInstance.put(
      API_PATHS.TASKS.UPDATE_TASK(taskId),
      payload
    );

    toast.success("Task Updated Successfully");
  } catch (err) {
    console.error("Update task error:", err);
    toast.error("Failed to update task");
  } finally {
    setLoading(false);
  }
};


    const handleSubmit = async () => {
      if (!taskData.title.trim()) {
        toast.error("Task title is required");
        return;
      }

      if (!taskData.description.trim()) {
        toast.error("Description is required");
        return;
      }

      if (!taskData.dueDate || taskData.dueDate === "") {
        toast.error("Due date is required");
        return;
      }

      if (!taskData.assignedTo || taskData.assignedTo.length === 0) {
        toast.error("Task not assigned to any member");
        return;
      }

      if (!taskData.todoChecklist || taskData.todoChecklist.length === 0) {
        toast.error("Add at least one todo task");
        return;
      }

      taskId ? updateTask() : createTask();
    };

    // get Task info by ID
const getTaskDetailsByID = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
    );

    if (response.data) {
      const taskInfo = response.data;

      setCurrentTask(taskInfo);

      setTaskData((prevState) => ({
        ...prevState,
        title: taskInfo.title,
        description: taskInfo.description,
        priority: taskInfo.priority,
        dueDate: taskInfo.dueDate
          ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
          : null,
        assignedTo: taskInfo.assignedTo?.map((item) => item?._id) || [],
        todoChecklist:
          taskInfo.todoChecklist?.map((item) => item?.text) || [],
        attachments: taskInfo.attachments || [],
      }));
    }
  } catch (error) {
    console.error("Error fetching task details:", error);
  }
};

// Delete Task
const deleteTask = async () => {
  try {
    await axiosInstance.delete(
      API_PATHS.TASKS.DELETE_TASK(taskId)
    );

    setOpenDeleteAlert(false);
    toast.success("Task deleted successfully");
    navigate("/admin/tasks");
  } catch (error) {
    console.error(
      "Error deleting task:",
      error.response?.data?.message || error.message
    );
    toast.error(
      error.response?.data?.message || "Failed to delete task"
    );
  }
};

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    if(taskId){
      getTaskDetailsByID(taskId);
    };
  },[taskId]);

  // -------------------------
  // UI
  // -------------------------
  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm p-6 max-h-[80vh] overflow-y-auto">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium mb-6">
                {taskId ? "Update Task" : "Create Task"}
              </h2>

              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] text-red-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer "
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>

            {/* Task Title */}
            <div className="mb-4">
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                placeholder="Create App UI"
                className="form-input mt-1"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe Task"
                className="form-input mt-1 min-h-[100px]"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            {/* Priority */}
            <div className="grid grid-cols-12 gap-4 mt-2">
                <div className="col-span-6 md:col-span-4">
              <label className="text-xs font-medium text-slate-600">
                Priority
              </label>
              <SelectDropdown
                options={PRIORITY_DATA}
                value={taskData.priority}
                onChange={( value ) =>
                  handleValueChange("priority", value)
                }
                placeholder="Select Priority"
              />
            </div>

           {/* DOB */}
            <div className="col-span-6 md:col-span-4">
                <label className="text-xs font-medium text-slate-600">
                    Due Date
                </label>
                <input
                placeholder="Create API UI"
                className="form-input mt-1"
                value={taskData.dueDate || ""}
                onChange={({target})=>handleValueChange("dueDate", target.value)}
                type="date"
                />
            </div>

              {/* Add Members */}
            <div className="col-span-12 md:col-span-3">
                <label className="text-xs font-medium text-slate-600">
                    Assign To
                </label>
              <SelectUsers
              selectedUsers={taskData.assignedTo}
              setSelectedUsers={(value) => {
                handleValueChange("assignedTo", value);
              }}
            />

            </div>
            </div>

            <div className="mt-6 w-full">
              <label className="text-xs font-medium text-slate-600 block mb-2">
                TODO Checklist
              </label>

                <TodoListInput
                  todoList={taskData?.todoChecklist}
                  setTodoList={(value) =>
                    handleValueChange("todoChecklist", value)
                  }
                />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600">
                Add Attachments
              </label>
              
              <AddAttachmentsInput
              attachments={taskData.attachments}
              setAttachments={(value) =>
                setTaskData((prev) => ({
                  ...prev,
                  attachments: value,
                }))
              }
            />

            </div>

{/* {error && (
  <p className="text-xs font-medium text-red-500 mt-5">
    {error}
  </p>
)} */}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {taskId ? "UPDATE TASK" : "CREATE TASK"}
              </button>

            </div>
          </div>
        </div>
      </div>
      <Modal
  isOpen={openDeleteAlert}
  onClose={() => setOpenDeleteAlert(false)}
  title="Delete Task"
>
  <DeleteAlert
    content="Are you sure you want to delete this task?"
    onDelete={() => deleteTask()}
  />
</Modal>
    </DashboardLayout>

  );
};

export default CreateTask;

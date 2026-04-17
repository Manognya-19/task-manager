// src/utils/apiPaths.js

// export const BASE_URL = "http://127.0.0.1:8000";

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",        // Register new user
    LOGIN: "/api/auth/login",              // Login user
    GET_PROFILE: "/api/auth/profile",     // Get logged-in user
    REATE: "/api/tasks",
    GET_ALL: "/api/tasks",
    DELETE: (id) => `/api/tasks/${id}`,
    UPDATE: (id) => `/api/tasks/${id}`,     
  },

  USERS: {
    GET_ALL_USERS: "/api/users",                          // Admin only
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`,   // Get user by ID
    CREATE_USER: "/api/users",                            // Admin only
    UPDATE_USER: (userId) => `/api/users/${userId}`,      // Update user
    DELETE_USER: (userId) => `/api/users/${userId}`,      // Delete user
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data",
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
    GET_ALL_TASKS: "/api/tasks",
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
    CREATE_TASK: "/api/tasks",
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,

    UPDATE_TASK_STATUS: (taskId) =>
      `/api/tasks/${taskId}/status`,

    UPDATE_TODO_CHECKLIST: (taskId) =>
      `/api/tasks/${taskId}/todo`,
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks",
    EXPORT_USERS: "/api/reports/export/users",
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },
};

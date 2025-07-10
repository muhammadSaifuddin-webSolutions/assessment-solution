import { API } from "./baseUrl";

export const getActiveTasks = async (page) => {
  try {
    const res = await API.get(`/active?page=${page}`);
    if (!res.data || res.data.length === 0) {
      return "No active tasks found";
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching active tasks:", error);
    return error?.response?.data;
  }
};

export const getArchivedTasks = async (page) => {
  try {
    const res = await API.get(`/archived?page=${page}`);
    if (!res.data || res.data.length === 0) {
      return "No archived tasks found";
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching archived tasks:", error);
    return error?.response?.data || "An error occurred while fetching archived tasks";
  }
};

export const getTree = async () => {
  try {
    const res = await API.get(`/tree`);
    if (!res.data || res.data.length === 0) {
      return "No tasks found";
    }
    return res.data;
  } catch (error) {
    console.error("Error fetching task tree:", error);
    return error;
  }
};

export const createTask = async (data) => {
  try {
    console.log(data)
    const res = await API.post("/", data);
    if (!res.data || res.data.length === 0) {
      return "Task creation failed";
    }
    return res.data;
  } catch (error) {
    console.error("Error creating task:", error);
    return error;
  }
};

export const updateTask = async (id, data) => {
  try {
    console.log(data)
    const res = await API.patch(`/${id}`, data);
    if (!res.data || res.data.length === 0) {
      return "Task update failed";
    }
    return res.data;
  } catch (error) {
    console.error("Error updating task:", error);
    return error;
  }
};

export const moveTask = (id, newParentId) => {
  try {
    const res = API.patch(`/${id}/move`, { newParentId });
    if (!res.data || res.data.length === 0) {
      return "Task move failed";
    }
    return res.data;
  } catch (error) {
    console.error("Error moving task:", error);
    return error;
  }
};

export const deleteTask = (id) => {
  try {
    const res = API.delete(`/${id}`);
    if (!res.data || res.data.length === 0) {
      return "Task deletion failed";
    }
    return res.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    return error;
  }
};

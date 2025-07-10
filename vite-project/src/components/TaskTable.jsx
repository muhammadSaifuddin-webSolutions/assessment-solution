import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, CheckCircle } from "lucide-react";
import { deleteTask, updateTask } from "../actions/taskApi's";

export default function TaskTable({
  tasks,
  loading,
  onEdit,
  onRefresh,
  onDelete,
  isArchived = false,
  showToast,
}) {
  const [processingIds, setProcessingIds] = useState(new Set());
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const flattenTasks = (tasks, level = 0) => {
    if (!Array.isArray(tasks)) return [];
    return tasks.flatMap((task) => [
      { ...task, level },
      ...flattenTasks(task.children || [], level + 1),
    ]);
  };

  const flatTasks = flattenTasks(tasks);

  const toggleComplete = async (taskId, completed) => {
    setProcessingIds((prev) => new Set(prev).add(taskId));
    try {
      await updateTask(taskId, { completed: !completed });
      showToast(`Task ${!completed ? "completed" : "reopened"} successfully`);
      onRefresh();
    } catch (error) {
      showToast("Failed to update task", "error");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleEdit = (task) => {
    setDropdownOpen(null);
    onEdit(task);
  };

  const handleDelete = async (taskId, taskTitle) => {
    const confirmMessage = `Are you sure you want to delete "${taskTitle}" and all its subtasks? This action cannot be undone.`;

    if (!window.confirm(confirmMessage)) return;

    setProcessingIds((prev) => new Set(prev).add(taskId));
    setDropdownOpen(null);

    try {
      await deleteTask(taskId);
      showToast("Task deleted successfully");
      onRefresh();
      if (onDelete) {
        onDelete(taskId);
      }
    } catch (error) {
      showToast("Failed to delete task", "error");
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  // Close dropdown when clicking outside
  const handleOutsideClick = () => {
    setDropdownOpen(null);
  };

  const tableContainerStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow:
      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    padding: "12px 16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#374151",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px",
  };

  const tdStyle = {
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    color: "black",
    fontSize: "14px",
  };

  const loadingStyle = {
    padding: "32px",
    textAlign: "center",
  };

  const spinnerStyle = {
    width: "32px",
    height: "32px",
    border: "2px solid #e5e7eb",
    borderTop: "2px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 8px",
  };

  const emptyStateStyle = {
    padding: "32px",
    textAlign: "center",
  };

  const checkboxStyle = {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  };

  const badgeStyle = (isPrimary) => ({
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    backgroundColor: isPrimary ? "#2563eb" : "#6b7280",
    color: "white",
  });

  const dropdownButtonStyle = {
    padding: "4px",
    border: "none",
    backgroundColor: "black",
    cursor: "pointer",
    borderRadius: "4px",
    position: "relative",
  };

  const dropdownMenuStyle = {
    position: "absolute",
    right: "0",
    top: "100%",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    zIndex: 50,
    minWidth: "140px",
    marginTop: "4px",
  };

  const dropdownItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 12px",
    border: "none",
    backgroundColor: "transparent",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    color: "#374151",
    transition: "background-color 0.1s",
  };

  const deleteItemStyle = {
    ...dropdownItemStyle,
    color: "#dc2626",
  };

  if (loading) {
    return (
      <div style={tableContainerStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <p style={{ color: "#6b7280", margin: 0 }}>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (flatTasks.length === 0) {
    return (
      <div style={tableContainerStyle}>
        <div style={emptyStateStyle}>
          <CheckCircle
            size={48}
            color="#9ca3af"
            style={{ margin: "0 auto 16px" }}
          />
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "500",
              color: "#111827",
              margin: "0 0 8px 0",
            }}
          >
            No tasks found
          </h3>
          <p style={{ color: "#6b7280", margin: 0 }}>
            {isArchived
              ? "No archived tasks to display."
              : "Get started by creating your first task."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay to close dropdown when clicking outside */}
      {dropdownOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
          }}
          onClick={handleOutsideClick}
        />
      )}

      <div style={tableContainerStyle}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: "48px" }}>Status</th>
              <th style={thStyle}>Task</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Parent</th>
              <th style={{ ...thStyle, width: "80px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flatTasks.map((task) => (
              <tr
                key={task._id}
                style={{
                  backgroundColor: task.completed ? "#f9fafb" : "white",
                }}
              >
                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task._id, task.completed)}
                    disabled={processingIds.has(task._id)}
                    style={checkboxStyle}
                  />
                </td>
                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: `${task.level * 16}px`,
                    }}
                  >
                    {task.level > 0 && (
                      <span style={{ color: "#9ca3af", marginRight: "8px" }}>
                        └─{" "}
                      </span>
                    )}
                    <span
                      style={{
                        fontWeight: task.completed ? "normal" : "500",
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        color: task.completed ? "#6b7280" : "#111827",
                      }}
                    >
                      {task.title}
                    </span>
                  </div>
                </td>
                <td style={tdStyle}>
                  <span
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "#6b7280" : "#374151",
                    }}
                  >
                    {task.description || "No description"}
                  </span>
                </td>
                <td style={tdStyle}>
                  {task?.parentTask?.title || "No Parent"}
                </td>
                <td style={{ ...tdStyle, position: "relative" }}>
                  <button
                    style={dropdownButtonStyle}
                    onClick={() =>
                      setDropdownOpen(
                        dropdownOpen === task._id ? null : task._id
                      )
                    }
                    disabled={processingIds.has(task._id)}
                    onMouseOver={(e) =>
                      (e.target.style.backgroundColor = "#f3f4f6")
                    }
                    onMouseOut={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {dropdownOpen === task._id && (
                    <div style={dropdownMenuStyle}>
                      {!isArchived && (
                        <button
                          style={dropdownItemStyle}
                          onClick={() => handleEdit(task)}
                          onMouseOver={(e) =>
                            (e.target.style.backgroundColor = "#f3f4f6")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.backgroundColor = "transparent")
                          }
                        >
                          <Edit size={16} />
                          Edit Task
                        </button>
                      )}
                      <button
                        style={deleteItemStyle}
                        onClick={() => handleDelete(task._id, task.title)}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#fef2f2")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "transparent")
                        }
                      >
                        <Trash2 size={16} />
                        Delete Task
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

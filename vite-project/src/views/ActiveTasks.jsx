import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import TaskTable from "../components/TaskTable"
import TaskModal from "../components/TaskModal"
import Pagination from "../components/Paginsation"
import { createTask, getActiveTasks, getTree, updateTask } from "../actions/taskApi's"

export default function ActiveTasks() {
  const [tasks, setTasks] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [allTasks, setAllTasks] = useState([])
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadTasks = async () => {
    setLoading(true)
    try {
      const res = await getActiveTasks(page)
      if (res?.message) {
        showToast(res.message, "error")
        setTasks([])
        return
      }
      setTasks(res?.tasks || res || [])
      console.log(Math.ceil((res?.length) / 10))
      console.log(res.length)
      setTotalPages(res?.totalPages || Math.ceil((res?.length || 0) / 10) || 1)
    } catch (error) {
      showToast("Failed to load tasks", "error")
    } finally {
      setLoading(false)
    }
  }

  const loadAllTasks = async () => {
    try {
      const res = await getTree()
      console.log(res)
      setAllTasks(flattenTasks(res))
    } catch (error) {
      console.error("Failed to load task tree:", error)
    }
  }

  const flattenTasks = (tree, prefix = "") => {
    if (!Array.isArray(tree)) return []
    return tree.flatMap((task) => [
      { _id: task._id, label: `${prefix}${task.title}` },
      ...flattenTasks(task.children || [], prefix + "-- "),
    ])
  }

  useEffect(() => {
    loadTasks()
    loadAllTasks()
  }, [page])

  const handleSubmit = async (formData) => {
    try {
      if (editingTask) {
        // Update existing task
        await updateTask(editingTask._id, formData)
        showToast("Task updated successfully")
      } else {
        // Create new task
        console.log(formData)
        await createTask(formData)
        showToast("Task created successfully")
      }
      loadTasks()
      loadAllTasks()
      setIsModalOpen(false)
      setEditingTask(null)
    } catch (error) {
      showToast("Failed to save task", "error")
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (taskId) => {
    // This will be called from TaskTable component
    loadTasks()
    loadAllTasks()
  }

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  }

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }

  const titleSectionStyle = {
    display: "flex",
    flexDirection: "column",
  }

  const titleStyle = {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#111827",
    margin: 0,
  }

  const subtitleStyle = {
    color: "#6b7280",
    marginTop: "4px",
    fontSize: "16px",
  }

  const addButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  }

  return (
    <div style={containerStyle}>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 16px",
            backgroundColor: toast.type === "error" ? "#ef4444" : "#10b981",
            color: "white",
            borderRadius: "6px",
            zIndex: 1000,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          {toast.message}
        </div>
      )}

      <div style={headerStyle}>
        <div style={titleSectionStyle}>
          <h2 style={titleStyle}>Active Tasks</h2>
          <p style={subtitleStyle}>Manage your active tasks and subtasks</p>
        </div>
        <button
          onClick={handleAdd}
          style={addButtonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
        >
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      <TaskTable
        tasks={tasks}
        loading={loading}
        onEdit={handleEdit}
        onRefresh={loadTasks}
        onDelete={handleDelete}
        showToast={showToast}
        isArchived={false}
      />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingTask(null)
        }}
        onSubmit={handleSubmit}
        task={editingTask}
        allTasks={allTasks}
      />
    </div>
  )
}

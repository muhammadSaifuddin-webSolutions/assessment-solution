import { useEffect, useState } from "react"
import { getArchivedTasks } from "../actions/taskApi's"
import TaskTable from "../components/TaskTable"
import Pagination from "../components/Paginsation"

export default function ArchivedTasks() {
  const [tasks, setTasks] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadTasks = async () => {
    setLoading(true)
    try {
      const res = await getArchivedTasks(page)
      if (res?.message) {
        showToast(res.message, "error")
        setTasks([])
        return
      }
      setTasks(res?.tasks || res || [])
      setTotalPages(res?.totalPages || Math.ceil((res?.length || 0) / 10) || 1)
    } catch (error) {
      showToast("Failed to load archived tasks", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [page])

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
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
          }}
        >
          {toast.message}
        </div>
      )}

      <div style={titleSectionStyle}>
        <h2 style={titleStyle}>Archived Tasks</h2>
        <p style={subtitleStyle}>View your completed and archived tasks</p>
      </div>

      <TaskTable tasks={tasks} loading={loading} onRefresh={loadTasks} isArchived={true} showToast={showToast} />

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

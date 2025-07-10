import { useState, useEffect } from "react"

export default function TaskModal({ isOpen, onClose, onSubmit, task, allTasks }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    parentTask: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        parentTask: task.parentTask || null,
      })
    } else {
      setForm({
        title: "",
        description: "",
        parentTask: null,
      })
    }
    setErrors({})
  }, [task, isOpen])

  const validateForm = () => {
    const newErrors = {}

    if (!form.title.trim()) {
      newErrors.title = "Title is required"
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long"
    }

    if (form.description && form.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      console.log(form)
      const submitData = {
        title: form.title.trim(),
        description: form.description.trim(),
        parentTask: form.parentTask === null ? null : form.parentTask,
      }
      await onSubmit(submitData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setForm({
        title: "",
        description: "",
        parentTask: "none",
      })
      setErrors({})
      onClose()
    }
  }

  if (!isOpen) return null

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "16px",
  }

  const modalStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "24px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflowY: "auto",
  }

  const headerStyle = {
    marginBottom: "20px",
  }

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  }

  const descriptionStyle = {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  }

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  }

  const labelStyle = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  }

  const inputStyle = (hasError) => ({
    padding: "10px 12px",
    border: `1px solid ${hasError ? "#dc2626" : "#d1d5db"}`,
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  })

  const textareaStyle = (hasError) => ({
    ...inputStyle(hasError),
    resize: "vertical",
    minHeight: "80px",
    fontFamily: "inherit",
  })

  const selectStyle = (hasError) => ({
    ...inputStyle(hasError),
    backgroundColor: "white",
  })

  const errorStyle = {
    fontSize: "12px",
    color: "#dc2626",
    marginTop: "2px",
  }

  const footerStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  }

  const buttonStyle = (variant = "primary") => ({
    padding: "10px 20px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: isSubmitting ? "not-allowed" : "pointer",
    border: variant === "outline" ? "1px solid #d1d5db" : "none",
    backgroundColor: variant === "outline" ? "white" : "#2563eb",
    color: variant === "outline" ? "#374151" : "white",
    opacity: isSubmitting ? 0.6 : 1,
    transition: "all 0.2s",
  })

  const characterCountStyle = {
    fontSize: "12px",
    color: "#6b7280",
    textAlign: "right",
    marginTop: "2px",
  }

  return (
    <div style={overlayStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{task ? "Edit Task" : "Create New Task"}</h2>
          <p style={descriptionStyle}>
            {task ? "Update the task details below." : "Fill in the details to create a new task."}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label htmlFor="title" style={labelStyle}>
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter a descriptive task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={isSubmitting}
              style={inputStyle(errors.title)}
              onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.target.style.borderColor = errors.title ? "#dc2626" : "#d1d5db")}
            />
            {errors.title && <span style={errorStyle}>{errors.title}</span>}
          </div>

          <div style={fieldStyle}>
            <label htmlFor="description" style={labelStyle}>
              Description
            </label>
            <textarea
              id="description"
              placeholder="Add more details about this task (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={isSubmitting}
              style={textareaStyle(errors.description)}
              onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
              onBlur={(e) => (e.target.style.borderColor = errors.description ? "#dc2626" : "#d1d5db")}
            />
            <div style={characterCountStyle}>{form.description.length}/500 characters</div>
            {errors.description && <span style={errorStyle}>{errors.description}</span>}
          </div>

          <div style={fieldStyle}>
            <label htmlFor="parentTask" style={labelStyle}>
              Parent Task
            </label>
            <select
              id="parentTask"
              value={form.parentTask}
              onChange={(e) => setForm({ ...form, parentTask: e.target.value })}
              disabled={isSubmitting}
              style={selectStyle()}
            >
              <option value="none">No Parent (Top Level Task)</option>
              {allTasks
                .filter((t) => !task || t._id !== task._id)
                .map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.label}
                  </option>
                ))}
            </select>
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
              Select a parent task to create a subtask
            </div>
          </div>

          <div style={footerStyle}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              style={buttonStyle("outline")}
              onMouseOver={(e) => !isSubmitting && (e.target.style.backgroundColor = "#f3f4f6")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={buttonStyle()}
              // onMouseOver={(e) => !isSubmitting && (e.target.style.backgroundColor = "#1d4ed8")}
              // onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
            >
              {isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

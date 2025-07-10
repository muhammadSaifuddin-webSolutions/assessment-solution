import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  }

  const buttonStyle = (isActive = false, disabled = false) => ({
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: isActive ? "#2563eb" : "white",
    color: isActive ? "white" : disabled ? "#9ca3af" : "#374151",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "14px",
    fontWeight: "500",
    minWidth: "40px",
    justifyContent: "center",
    opacity: disabled ? 0.5 : 1,
  })

  const pageButtonStyle = (isActive = false) => ({
    ...buttonStyle(isActive),
    minWidth: "40px",
  })

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle(false, currentPage === 1)}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
        <span>Previous</span>
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            style={pageButtonStyle(page === currentPage)}
            onClick={() => typeof page === "number" && onPageChange(page)}
            disabled={page === "..."}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        style={buttonStyle()}
        onClick={() => onPageChange(currentPage + 1)}
        // disabled={currentPage === totalPages}
      >
        <span>Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

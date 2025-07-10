import { Link, useLocation } from "react-router-dom"
import { CheckSquare, Archive } from "lucide-react"

export default function Layout({ children }) {
  const location = useLocation()

  const headerStyle = {
    backgroundColor: "white",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    borderBottom: "1px solid #e5e7eb",
  }

  const containerStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 16px",
  }

  const headerContentStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "64px",
  }

  const logoSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  }

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111827",
    margin: 0,
  }

  const navStyle = {
    display: "flex",
    gap: "16px",
  }

  const buttonStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: isActive ? "#2563eb" : "transparent",
    color: isActive ? "white" : "#374151",
    textDecoration: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s",
  })

  const mainStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "32px 16px",
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <header style={headerStyle}>
        <div style={containerStyle}>
          <div style={headerContentStyle}>
            <div style={logoSectionStyle}>
              <CheckSquare size={32} color="#2563eb" />
              <h1 style={titleStyle}>Task Manager</h1>
            </div>

            <nav style={navStyle}>
              <Link to="/active" style={buttonStyle(location.pathname === "/active")}>
                <CheckSquare size={16} />
                <span>Active Tasks</span>
              </Link>
              <Link to="/archived" style={buttonStyle(location.pathname === "/archived")}>
                <Archive size={16} />
                <span>Archived Tasks</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main style={mainStyle}>{children}</main>
    </div>
  )
}

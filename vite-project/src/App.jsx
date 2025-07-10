"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import ActiveTasks from "./views/ActiveTasks"
import ArchivedTasks from "./views/ArchivedTasks"
import Toast from "./components/Toast"

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/active" replace />} />
            <Route path="/active" element={<ActiveTasks />} />
            <Route path="/archived" element={<ArchivedTasks />} />
          </Routes>
        </Layout>
        <Toast />
      </div>
    </Router>
  )
}

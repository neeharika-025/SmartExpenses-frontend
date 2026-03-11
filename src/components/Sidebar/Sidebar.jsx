// Sidebar Component - Navigation sidebar with main menu items
import React, { useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaChartPie, FaCalendarAlt, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Helper function to check if route is active
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <Link
            to="/dashboard"
            className={`sidebar-item ${isActive("/dashboard") ? "active" : ""}`}
          >
            <span className="sidebar-icon"><FaChartPie /></span>
            <span className="sidebar-text">Dashboard</span>
          </Link>

          <Link
            to="/monthly-expenses"
            className={`sidebar-item ${isActive("/monthly-expenses") ? "active" : ""}`}
          >
            <span className="sidebar-icon"><FaCalendarAlt /></span>
            <span className="sidebar-text">Monthly Expenses</span>
          </Link>

          <Link
            to="/add-expense"
            className={`sidebar-item ${isActive("/add-expense") ? "active" : ""}`}
          >
            <span className="sidebar-icon"><FaPlus /></span>
            <span className="sidebar-text">Add Expense</span>
          </Link>
        </nav>

        {/* Logout Button at Bottom */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout">
            <span className="sidebar-icon"><FaSignOutAlt /></span>
            <span className="sidebar-text">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

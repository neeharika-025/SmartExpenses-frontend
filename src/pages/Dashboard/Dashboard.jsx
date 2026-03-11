// Dashboard Page - Main page showing expenses, summary, and filters
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHandPaper,
  FaMoneyBillWave,
  FaMoneyCheckAlt,
  FaWallet,
  FaGem,
  FaTrash,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import {
  getAllExpenses,
  deleteExpense,
  deleteAllExpenses,
  searchExpenses,
  filterExpenses,
  sortExpenses,
  getSummary,
} from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import Chart from "../../components/Chart/Chart";
import CategoryPieChart from "../../components/Chart/CategoryPieChart";
import Timeline from "../../components/Timeline/Timeline";
import {
  SkeletonSummaryCard,
  SkeletonExpenseCard,
  SkeletonChart,
  SkeletonTimeline,
  SkeletonGrid,
} from "../../components/Skeleton/SkeletonLayouts";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMonth, setFilterMonth] = useState(() => {
    // Initialize with current month
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Categories list
  const categories = [
    "Salary",
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Healthcare",
    "Other",
  ];

  // Fetch expenses on component mount
  useEffect(() => {
    fetchCurrentMonthExpenses();
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch summary when expenses change
  useEffect(() => {
    if (!loading) {
      fetchSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses.length]);

  // Fetch current month expenses
  const fetchCurrentMonthExpenses = async () => {
    try {
      const response = await filterExpenses("", filterMonth);
      setExpenses(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setLoading(false);
    }
  };

  // Fetch summary
  const fetchSummary = async () => {
    try {
      const response = await getSummary(filterMonth);
      console.log("Summary data received:", response.data);
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  // Handle search
  const handleSearch = async (keyword) => {
    // Update search keyword state if provided
    if (keyword !== undefined) {
      setSearchKeyword(keyword);
    }

    const searchValue = keyword !== undefined ? keyword : searchKeyword;

    if (!searchValue.trim()) {
      fetchCurrentMonthExpenses();
      return;
    }
    try {
      const response = await searchExpenses(searchValue);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error searching expenses:", error);
    }
  };

  // Handle filter
  const handleFilter = async () => {
    try {
      const response = await filterExpenses(filterCategory, filterMonth);
      setExpenses(response.data);
      // Update summary for the selected month
      const summaryResponse = await getSummary(filterMonth);
      setSummary(summaryResponse.data);
    } catch (error) {
      console.error("Error filtering expenses:", error);
    }
  };

  // Handle This Month filter
  const handleThisMonth = () => {
    const today = new Date();
    const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    setFilterMonth(thisMonth);
    filterExpensesByMonth(thisMonth);
  };

  // Handle Last Month filter
  const handleLastMonth = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, "0")}`;
    setFilterMonth(lastMonthStr);
    filterExpensesByMonth(lastMonthStr);
  };

  // Handle All Time view
  const handleAllTime = async () => {
    try {
      setFilterMonth(""); // Empty month means all time
      const response = await getAllExpenses();
      setExpenses(response.data);
      // Get all-time summary (pass empty string)
      const summaryResponse = await getSummary("");
      setSummary(summaryResponse.data);
    } catch (error) {
      console.error("Error fetching all time expenses:", error);
    }
  };

  // Filter expenses by month
  const filterExpensesByMonth = async (month) => {
    try {
      const response = await filterExpenses(filterCategory, month);
      setExpenses(response.data);
      // Update summary for the selected month
      const summaryResponse = await getSummary(month);
      setSummary(summaryResponse.data);
    } catch (error) {
      console.error("Error filtering expenses:", error);
    }
  };

  // Handle sort
  const handleSort = async () => {
    try {
      const response = await sortExpenses("amount");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error sorting expenses:", error);
    }
  };

  // Handle delete expense
  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await deleteExpense(deleteId);
      setShowDeleteConfirm(false);
      setDeleteId(null);
      fetchCurrentMonthExpenses();
      fetchSummary();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Handle delete all
  const handleDeleteAll = async () => {
    const monthText = filterMonth
      ? `for ${new Date(filterMonth + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}`
      : "from ALL time";

    if (
      window.confirm(
        `Are you sure you want to delete ALL expenses ${monthText}? This cannot be undone.`,
      )
    ) {
      try {
        await deleteAllExpenses(filterMonth);

        // Refresh based on current filter state
        if (filterMonth === "") {
          // If viewing all time, refresh all time view
          handleAllTime();
        } else {
          // If viewing specific month, refresh that month
          fetchCurrentMonthExpenses();
          fetchSummary();
        }
      } catch (error) {
        console.error("Error deleting all expenses:", error);
      }
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSearchKeyword("");
    setFilterCategory("");
    // Reset to current month
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    setFilterMonth(currentMonth);
    fetchCurrentMonthExpenses();
    fetchSummary();
  };

  return (
    <div className="dashboard-container">
      <Navbar onSearch={handleSearch} />
      <Sidebar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>
            Welcome, {user?.name}!{" "}
            <FaHandPaper style={{ marginLeft: "8px", color: "#f59e0b" }} />
          </h1>
          <button
            className="btn btn-add"
            onClick={() => navigate("/add-expense")}
          >
            + Add Expense
          </button>
        </div>

        {/* Summary Cards */}
        {loading ? (
          <div className="summary-cards">
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
            <SkeletonSummaryCard />
          </div>
        ) : (
          <div className="summary-cards">
            <div className="summary-card income">
              <h3>
                <FaMoneyBillWave style={{ marginRight: "8px" }} /> Total Income
              </h3>
              <p className="amount">₹{summary.totalIncome.toFixed(2)}</p>
            </div>
            <div className="summary-card expense">
              <h3>
                <FaMoneyCheckAlt style={{ marginRight: "8px" }} /> Total Expense
              </h3>
              <p className="amount">₹{summary.totalExpense.toFixed(2)}</p>
            </div>
            <div className="summary-card balance">
              <h3>
                <FaWallet style={{ marginRight: "8px" }} /> Balance
              </h3>
              <p className="amount">₹{summary.balance.toFixed(2)}</p>
            </div>
            {filterCategory === "" && (
              <div className="summary-card savings">
                <h3>
                  <FaGem style={{ marginRight: "8px" }} /> Savings
                </h3>
                <p className="amount">₹{summary.balance.toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="filters-section">
          <div className="filter-box">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button onClick={handleThisMonth} className="btn btn-this-month">
              This Month
            </button>
            <button onClick={handleLastMonth} className="btn btn-last-month">
              Last Month
            </button>
            <button onClick={handleAllTime} className="btn btn-all-time">
              All Time
            </button>
            <button onClick={handleFilter} className="btn btn-filter">
              Filter
            </button>
            <button onClick={handleSort} className="btn btn-sort">
              Sort by Amount
            </button>
            <button onClick={clearFilters} className="btn btn-clear">
              Clear
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {loading ? <SkeletonChart /> : <Chart expenses={expenses} />}
        </div>

        {/* Timeline Section */}
        <div className="timeline-section">
          <h2>Recent Transactions</h2>
          {loading ? (
            <SkeletonTimeline />
          ) : (
            <Timeline expenses={expenses.slice(0, 5)} />
          )}
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="pie-chart-section">
          {loading ? (
            <SkeletonChart />
          ) : (
            <CategoryPieChart expenses={expenses} />
          )}
        </div>

        {/* Expenses List */}
        <div className="expenses-section">
          <div className="expenses-header">
            <h2>All Expenses ({expenses.length})</h2>
            {expenses.length > 0 && (
              <button onClick={handleDeleteAll} className="btn btn-delete-all">
                <FaTrash style={{ marginRight: "6px" }} /> Delete All
              </button>
            )}
          </div>

          {loading ? (
            <SkeletonGrid count={6} CardComponent={SkeletonExpenseCard} />
          ) : expenses.length === 0 ? (
            <p className="no-data-text">
              No expenses found. Add your first expense!
            </p>
          ) : (
            <div className="expenses-grid">
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense._id}
                  expense={expense}
                  onDelete={handleDelete}
                  onEdit={() =>
                    navigate("/add-expense", { state: { expense } })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this expense?</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="btn btn-confirm">
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

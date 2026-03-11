// Profile Page - Display user details and their expenses
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaMoneyBillWave, FaWallet, FaMoneyCheckAlt, FaChartPie, FaPlus, FaCalendarAlt, FaCog, FaClock } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { getAllExpenses, getSummary } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import {
  SkeletonSummaryCard,
  SkeletonExpenseCard,
  SkeletonProfileHeader,
  SkeletonGrid,
} from "../../components/Skeleton/SkeletonLayouts";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("details"); // 'details' or 'expenses'

  // Fetch user expenses and summary on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user expenses and summary
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [expensesResponse, summaryResponse] = await Promise.all([
        getAllExpenses(),
        getSummary(),
      ]);
      setExpenses(expensesResponse.data);
      setSummary(summaryResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  // Handle edit expense
  const handleEdit = (expense) => {
    navigate("/add-expense", { state: { expense } });
  };

  // Handle delete (refresh after delete)
  const handleDelete = () => {
    fetchUserData();
  };

  // Calculate statistics
  const totalTransactions = expenses.length;
  const incomeTransactions = expenses.filter((e) => e.type === "Income").length;
  const expenseTransactions = expenses.filter(
    (e) => e.type === "Expense",
  ).length;

  // Get most recent expenses
  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="profile-container">
      <Navbar />
      <Sidebar />

      <div className="profile-content">
        {/* Profile Header */}
        {loading ? (
          <SkeletonProfileHeader />
        ) : (
          <div className="profile-header">
            <div className="profile-avatar">
              <span className="avatar-icon"><FaUser /></span>
            </div>
            <div className="profile-info">
              <h1>{user?.name}</h1>
              <p className="profile-email"><FaEnvelope style={{ marginRight: '8px' }} /> {user?.email}</p>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "details" ? "active" : ""}`}
            onClick={() => setViewMode("details")}
          >
            Profile Details
          </button>
          <button
            className={`toggle-btn ${viewMode === "expenses" ? "active" : ""}`}
            onClick={() => setViewMode("expenses")}
          >
            All Expenses
          </button>
        </div>

        {loading ? (
          <div className="details-section">
            {/* Financial Summary Skeleton */}
            <div className="profile-section">
              <Skeleton variant="title" width="250px" height="28px" />
              <div className="summary-grid">
                <SkeletonSummaryCard />
                <SkeletonSummaryCard />
                <SkeletonSummaryCard />
              </div>
            </div>

            {/* Transaction Statistics Skeleton */}
            <div className="profile-section">
              <Skeleton variant="title" width="280px" height="28px" />
              <div className="stats-grid">
                <div className="stat-item">
                  <Skeleton variant="text" width="80px" height="48px" />
                  <Skeleton variant="text" width="150px" height="16px" />
                </div>
                <div className="stat-item">
                  <Skeleton variant="text" width="80px" height="48px" />
                  <Skeleton variant="text" width="150px" height="16px" />
                </div>
                <div className="stat-item">
                  <Skeleton variant="text" width="80px" height="48px" />
                  <Skeleton variant="text" width="150px" height="16px" />
                </div>
              </div>
            </div>

            {/* Recent Transactions Skeleton */}
            <div className="profile-section">
              <Skeleton variant="title" width="250px" height="28px" />
              <div className="recent-list">
                <Skeleton variant="card" height="60px" count={5} />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="profile-section">
              <Skeleton variant="title" width="200px" height="28px" />
              <div className="action-buttons">
                <Skeleton variant="button" width="100%" height="45px" />
                <Skeleton variant="button" width="100%" height="45px" />
                <Skeleton variant="button" width="100%" height="45px" />
              </div>
            </div>
          </div>
        ) : (
          <>
            {viewMode === "details" ? (
              <div className="details-section">
                {/* Financial Summary */}
                <div className="profile-section">
                  <h2><FaMoneyBillWave style={{ marginRight: '10px' }} /> Financial Summary</h2>
                  <div className="summary-grid">
                    <div className="summary-card income">
                      <div className="summary-icon"><FaWallet /></div>
                      <div className="summary-details">
                        <p className="summary-label">Total Income</p>
                        <p className="summary-amount">
                          ₹{summary.totalIncome.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="summary-card expense">
                      <div className="summary-icon"><FaMoneyCheckAlt /></div>
                      <div className="summary-details">
                        <p className="summary-label">Total Expense</p>
                        <p className="summary-amount">
                          ₹{summary.totalExpense.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="summary-card balance">
                      <div className="summary-icon"><FaMoneyBillWave /></div>
                      <div className="summary-details">
                        <p className="summary-label">Balance</p>
                        <p className="summary-amount">
                          ₹{summary.balance.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Statistics */}
                <div className="profile-section">
                  <h2><FaChartPie style={{ marginRight: '10px' }} /> Transaction Statistics</h2>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <span className="stat-value">{totalTransactions}</span>
                      <span className="stat-label">Total Transactions</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{incomeTransactions}</span>
                      <span className="stat-label">Income Entries</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{expenseTransactions}</span>
                      <span className="stat-label">Expense Entries</span>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="profile-section">
                  <div className="section-header">
                    <h2><FaClock style={{ marginRight: '10px' }} /> Recent Transactions</h2>
                    <button
                      className="view-all-btn"
                      onClick={() => setViewMode("expenses")}
                    >
                      View All
                    </button>
                  </div>
                  {recentExpenses.length === 0 ? (
                    <div className="no-data">
                      <p>No transactions yet</p>
                      <button
                        className="btn btn-add"
                        onClick={() => navigate("/add-expense")}
                      >
                        + Add Your First Expense
                      </button>
                    </div>
                  ) : (
                    <div className="recent-list">
                      {recentExpenses.map((expense) => (
                        <div key={expense._id} className="recent-item">
                          <div className="recent-info">
                            <span className="recent-title">
                              {expense.title}
                            </span>
                            <span className="recent-category">
                              {expense.category}
                            </span>
                          </div>
                          <span
                            className={`recent-amount ${expense.type.toLowerCase()}`}
                          >
                            {expense.type === "Income" ? "+" : "-"}₹
                            {expense.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Account Actions */}
                <div className="profile-section">
                  <h2><FaCog style={{ marginRight: '10px' }} /> Account Actions</h2>
                  <div className="action-buttons">
                    <button
                      className="action-btn"
                      onClick={() => navigate("/dashboard")}
                    >
                      <FaChartPie style={{ marginRight: '8px' }} /> Go to Dashboard
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => navigate("/add-expense")}
                    >
                      <FaPlus style={{ marginRight: '8px' }} /> Add New Expense
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => navigate("/monthly-expenses")}
                    >
                      <FaCalendarAlt style={{ marginRight: '8px' }} /> View Monthly Expenses
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="expenses-section">
                <h2>All Expenses ({expenses.length})</h2>
                {loading ? (
                  <SkeletonGrid count={6} CardComponent={SkeletonExpenseCard} />
                ) : expenses.length === 0 ? (
                  <div className="no-data">
                    <p>No expenses found</p>
                    <button
                      className="btn btn-add"
                      onClick={() => navigate("/add-expense")}
                    >
                      + Add Expense
                    </button>
                  </div>
                ) : (
                  <div className="expenses-grid">
                    {expenses.map((expense) => (
                      <ExpenseCard
                        key={expense._id}
                        expense={expense}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;

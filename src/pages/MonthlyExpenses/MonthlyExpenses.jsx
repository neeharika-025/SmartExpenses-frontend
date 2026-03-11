// Monthly Expenses Page - View expenses for a specific month with category filtering
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";
import { filterExpenses } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ExpenseCard from "../../components/ExpenseCard/ExpenseCard";
import {
  SkeletonExpenseCard,
  SkeletonGrid,
} from "../../components/Skeleton/SkeletonLayouts";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./MonthlyExpenses.css";

function MonthlyExpenses() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [savings, setSavings] = useState(0);

  // Categories list
  const categories = [
    "All",
    "Salary",
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Healthcare",
    "Other",
  ];

  // Initialize with current month
  useEffect(() => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
    setSelectedMonth(currentMonth);
  }, []);

  // Fetch expenses when month or category changes
  useEffect(() => {
    if (selectedMonth) {
      fetchMonthlyExpenses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedCategory]);

  // Fetch monthly expenses
  const fetchMonthlyExpenses = async () => {
    setLoading(true);
    try {
      const category =
        selectedCategory === "All" || !selectedCategory ? "" : selectedCategory;
      const response = await filterExpenses(category, selectedMonth);
      setExpenses(response.data);

      // Calculate totals
      const expenseTotal = response.data.reduce((sum, expense) => {
        return expense.type === "Expense" ? sum + expense.amount : sum;
      }, 0);

      const incomeTotal = response.data.reduce((sum, expense) => {
        return expense.type === "Income" ? sum + expense.amount : sum;
      }, 0);

      setTotalExpense(expenseTotal);
      setTotalIncome(incomeTotal);
      setSavings(incomeTotal - expenseTotal);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching monthly expenses:", error);
      setLoading(false);
    }
  };

  // Handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle edit expense
  const handleEdit = (expense) => {
    navigate("/add-expense", { state: { expense } });
  };

  // Handle delete (refresh after delete)
  const handleDelete = () => {
    fetchMonthlyExpenses();
  };

  return (
    <div className="monthly-expenses-container">
      <Navbar />
      <Sidebar />

      <div className="monthly-expenses-content">
        <div className="monthly-header">
          <h1>
            <FaCalendarAlt style={{ marginRight: "10px" }} /> Monthly Expenses
          </h1>
          <p>View and analyze your expenses by month and category</p>
        </div>

        {/* Month and Category Selection */}
        <div className="monthly-filters">
          <div className="filter-group">
            <label>Select Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={handleMonthChange}
              className="month-input"
            />
          </div>

          <div className="filter-group">
            <label>Filter by Category:</label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat === "All" ? "" : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Section */}
        {loading ? (
          <div className="monthly-summary">
            <div className="summary-item">
              <Skeleton variant="text" width="150px" height="16px" />
              <Skeleton variant="text" width="100px" height="24px" />
            </div>
            <div className="summary-item">
              <Skeleton variant="text" width="150px" height="16px" />
              <Skeleton variant="text" width="100px" height="24px" />
            </div>
            <div className="summary-item">
              <Skeleton variant="text" width="150px" height="16px" />
              <Skeleton variant="text" width="100px" height="24px" />
            </div>
            <div className="summary-item">
              <Skeleton variant="text" width="150px" height="16px" />
              <Skeleton variant="text" width="100px" height="24px" />
            </div>
          </div>
        ) : (
          <div className="monthly-summary">
            <div className="summary-item">
              <span className="summary-label">Total Income:</span>
              <span className="summary-value income">
                ₹{totalIncome.toFixed(2)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Expenses:</span>
              <span className="summary-value expense">
                ₹{totalExpense.toFixed(2)}
              </span>
            </div>
            {(selectedCategory === "" || selectedCategory === "All") && (
              <div className="summary-item">
                <span className="summary-label">Savings:</span>
                <span className="summary-value savings">
                  ₹{savings.toFixed(2)}
                </span>
              </div>
            )}
            <div className="summary-item">
              <span className="summary-label">Number of Transactions:</span>
              <span className="summary-value">{expenses.length}</span>
            </div>
          </div>
        )}

        {/* Expenses List */}
        <div className="monthly-expenses-list">
          {loading ? (
            <SkeletonGrid count={6} CardComponent={SkeletonExpenseCard} />
          ) : expenses.length === 0 ? (
            <div className="no-expenses">
              <p>No expenses found for the selected month and category.</p>
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
      </div>
    </div>
  );
}

export default MonthlyExpenses;

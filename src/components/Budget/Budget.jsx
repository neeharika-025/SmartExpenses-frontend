// Budget Component - Set and view monthly budget
import React, { useState, useEffect } from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import { getBudgetSummary, setBudget } from "../../services/api";
import "./Budget.css";

function Budget() {
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetSummary, setBudgetSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Initialize with current month and year
  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    setSelectedMonth(month);
    setSelectedYear(year);
    fetchBudgetSummary(month, year);
  }, []);

  // Fetch budget summary for selected month
  const fetchBudgetSummary = async (month, year) => {
    try {
      const response = await getBudgetSummary(month, year);
      setBudgetSummary(response.data);
      setBudgetAmount(response.data.budget || "");
    } catch (error) {
      console.error("Error fetching budget summary:", error);
    }
  };

  // Handle month/year change
  const handleMonthYearChange = (month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    fetchBudgetSummary(month, year);
  };

  // Handle set budget
  const handleSetBudget = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await setBudget({
        month: selectedMonth,
        year: selectedYear,
        amount: parseFloat(budgetAmount),
      });
      setMessage("Budget set successfully!");
      fetchBudgetSummary(selectedMonth, selectedYear);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to set budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-widget">
      <h3><FaMoneyBillWave style={{ marginRight: '8px' }} /> Monthly Budget</h3>

      {/* Month/Year Selector */}
      <div className="budget-selector">
        <input
          type="month"
          value={`${selectedYear}-${String(selectedMonth).padStart(2, "0")}`}
          onChange={(e) => {
            const [year, month] = e.target.value.split("-");
            handleMonthYearChange(parseInt(month), parseInt(year));
          }}
          className="month-selector"
        />
      </div>

      {/* Set Budget Form */}
      <form onSubmit={handleSetBudget} className="budget-form">
        <div className="form-group">
          <label>Budget Amount (₹)</label>
          <input
            type="number"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            placeholder="Enter budget amount"
            step="0.01"
            required
            className="budget-input"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-set-budget">
          {loading ? "Setting..." : "Set Budget"}
        </button>
      </form>

      {message && <p className="budget-message">{message}</p>}

      {/* Budget Summary */}
      {budgetSummary && budgetSummary.budget > 0 && (
        <div className="budget-summary">
          <div className="budget-item">
            <span className="label">Budget:</span>
            <span className="value">₹{budgetSummary.budget.toFixed(2)}</span>
          </div>
          <div className="budget-item">
            <span className="label">Spent:</span>
            <span className="value expense">₹{budgetSummary.totalExpense.toFixed(2)}</span>
          </div>
          <div className="budget-item">
            <span className="label">Remaining:</span>
            <span className={`value ${budgetSummary.remainingBudget < 0 ? "exceeded" : "remaining"}`}>
              ₹{budgetSummary.remainingBudget.toFixed(2)}
            </span>
          </div>

          {/* Budget Status */}
          <div className={`budget-status ${budgetSummary.budgetExceeded ? "exceeded" : "good"}`}>
            {budgetSummary.budgetExceeded ? (
              <>
                <span className="status-icon">⚠️</span>
                <span>Budget Exceeded!</span>
              </>
            ) : (
              <>
                <span className="status-icon">✅</span>
                <span>Within Budget</span>
              </>
            )}
          </div>

          {/* Progress Bar */}
          <div className="budget-progress">
            <div
              className={`progress-bar ${budgetSummary.budgetExceeded ? "exceeded" : ""}`}
              style={{
                width: `${Math.min((budgetSummary.totalExpense / budgetSummary.budget) * 100, 100)}%`,
              }}
            ></div>
          </div>
          <p className="progress-text">
            {((budgetSummary.totalExpense / budgetSummary.budget) * 100).toFixed(1)}% of budget used
          </p>
        </div>
      )}
    </div>
  );
}

export default Budget;

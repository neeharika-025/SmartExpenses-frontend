// Add/Edit Expense Page - Form to create or update expense
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createExpense, updateExpense } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./AddExpense.css";

function AddExpense() {
  const navigate = useNavigate();
  const location = useLocation();
  const expenseToEdit = location.state?.expense;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    amount: "",
    type: "Expense",
    date: new Date().toISOString().split("T")[0],
    isRecurring: false,
    frequency: "none",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  // If editing, populate form with existing data
  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title,
        description: expenseToEdit.description || "",
        category: expenseToEdit.category,
        amount: expenseToEdit.amount.toString(),
        type: expenseToEdit.type,
        date: new Date(expenseToEdit.date).toISOString().split("T")[0],
        isRecurring: expenseToEdit.isRecurring || false,
        frequency: expenseToEdit.frequency || "none",
      });
    }
  }, [expenseToEdit]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (expenseToEdit) {
        // Update existing expense
        await updateExpense(expenseToEdit._id, formData);
      } else {
        // Create new expense
        await createExpense(formData);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save expense. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expense-container">
      <Navbar />
      <Sidebar />

      <div className="add-expense-content">
        <div className="add-expense-box">
          <h2>{expenseToEdit ? "Edit Expense" : "Add New Expense"}</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Grocery Shopping"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add some details..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            {/* Recurring Transaction Options */}
            <div className="form-group recurring-section">
              <label>
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isRecurring: e.target.checked,
                      frequency: e.target.checked ? "monthly" : "none",
                    })
                  }
                />
                Make this a recurring transaction
              </label>
            </div>

            {/* Show frequency dropdown only if recurring is checked */}
            {formData.isRecurring && (
              <div className="form-group">
                <label>Frequency *</label>
                <select
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  required
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                </select>
                <small className="helper-text">
                  This transaction will be automatically created each{" "}
                  {formData.frequency === "monthly" ? "month" : "week"}
                </small>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn btn-save" disabled={loading}>
                {loading
                  ? "Saving..."
                  : expenseToEdit
                    ? "Update Expense"
                    : "Add Expense"}
              </button>
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddExpense;

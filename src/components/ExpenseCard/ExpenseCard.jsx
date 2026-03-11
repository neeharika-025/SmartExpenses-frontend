// ExpenseCard Component - Card to display individual expense
import React from "react";
import { FaUtensils, FaCar, FaShoppingBag, FaFilm, FaFileInvoiceDollar, FaHospital, FaMapPin, FaEdit, FaTrash } from "react-icons/fa";
import "./ExpenseCard.css";

function ExpenseCard({ expense, onDelete, onEdit }) {
  // Get icon for category
  const getCategoryIcon = (category) => {
    const icons = {
      Food: <FaUtensils />,
      Transport: <FaCar />,
      Shopping: <FaShoppingBag />,
      Entertainment: <FaFilm />,
      Bills: <FaFileInvoiceDollar />,
      Healthcare: <FaHospital />,
      Other: <FaMapPin />,
    };
    return icons[category] || <FaMapPin />;
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={`expense-card ${expense.type.toLowerCase()}`}>
      <div className="expense-card-header">
        <span className="category-emoji">
          {getCategoryIcon(expense.category)}
        </span>
        <span className={`expense-type ${expense.type.toLowerCase()}`}>
          {expense.type}
        </span>
      </div>

      <h3 className="expense-title">{expense.title}</h3>

      {expense.description && (
        <p className="expense-description">{expense.description}</p>
      )}

      <div className="expense-details">
        <div className="expense-category">
          <strong>Category:</strong> {expense.category}
        </div>
        <div className="expense-date">
          <strong>Date:</strong> {formatDate(expense.date)}
        </div>
      </div>

      <div className="expense-amount">₹{expense.amount.toFixed(2)}</div>

      <div className="expense-actions">
        <button onClick={onEdit} className="btn-edit">
          <FaEdit style={{ marginRight: '6px' }} /> Edit
        </button>
        <button onClick={() => onDelete(expense._id)} className="btn-delete">
          <FaTrash style={{ marginRight: '6px' }} /> Delete
        </button>
      </div>
    </div>
  );
}

export default ExpenseCard;

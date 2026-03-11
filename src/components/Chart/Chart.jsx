// Chart Component - Simple bar chart using Recharts
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Chart.css";

function Chart({ expenses }) {
  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Filter out values that are 0 to show only relevant data
      const relevantData = payload.filter(item => item.value > 0);
      
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', marginBottom: '5px' }}>{label}</p>
          {relevantData.map((entry, index) => (
            <p key={index} style={{ margin: '3px 0', color: entry.color }}>
              {entry.name}: ₹{entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Aggregate data by category
  const aggregateByCategory = () => {
    const categoryData = {};

    expenses.forEach((expense) => {
      const category = expense.category;
      if (!categoryData[category]) {
        categoryData[category] = { category, Income: 0, Expense: 0 };
      }

      if (expense.type === "Income") {
        categoryData[category].Income += expense.amount;
      } else {
        categoryData[category].Expense += expense.amount;
      }
    });

    return Object.values(categoryData);
  };

  const data = aggregateByCategory();

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Expense Statistics</h3>
        <p className="no-data">No data available for chart</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Expense Statistics by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="Income" fill="#4caf50" />
          <Bar dataKey="Expense" fill="#f44336" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;

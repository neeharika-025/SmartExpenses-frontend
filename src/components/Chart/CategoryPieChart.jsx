// Category Pie Chart Component - Shows expense breakdown by category
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "./Chart.css";

function CategoryPieChart({ expenses }) {
  // Define colors for each category
  const COLORS = {
    Salary: "#4caf50",
    Food: "#ff9800",
    Transport: "#2196f3",
    Shopping: "#e91e63",
    Entertainment: "#9c27b0",
    Bills: "#f44336",
    Healthcare: "#00bcd4",
    Other: "#607d8b",
  };

  // Aggregate expense data by category (only expenses, not income)
  const aggregateByCategory = () => {
    const categoryData = {};

    expenses
      .filter((expense) => expense.type === "Expense")
      .forEach((expense) => {
        const category = expense.category;
        if (!categoryData[category]) {
          categoryData[category] = { name: category, value: 0 };
        }
        categoryData[category].value += expense.amount;
      });

    return Object.values(categoryData);
  };

  const data = aggregateByCategory();

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = ((data.value / data.payload.totalValue) * 100).toFixed(
        1,
      );

      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "white",
            padding: "10px 15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", marginBottom: "5px" }}>
            {data.name}
          </p>
          <p style={{ margin: "3px 0", color: data.payload.fill }}>
            Amount: ₹{data.value.toFixed(2)}
          </p>
          <p style={{ margin: "3px 0", color: "#666" }}>
            {percentage}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithTotal = data.map((item) => ({
    ...item,
    totalValue: total,
  }));

  // Custom Label to show percentage on pie slices
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    // Only show percentage if it's greater than 5%
    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "14px", fontWeight: "bold" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Expense Breakdown by Category</h3>
        <p className="no-data">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Expense Breakdown by Category</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithTotal.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#999"} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            formatter={(value, entry) => {
              const itemValue = entry.payload?.value || 0;
              const percentage = ((itemValue / total) * 100).toFixed(1);
              return `${value}: ₹${itemValue.toFixed(2)} (${percentage}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryPieChart;

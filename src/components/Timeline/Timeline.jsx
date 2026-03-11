// Timeline Component - Simple timeline using React Chrono
import React from "react";
import { Chrono } from "react-chrono";
import { useTheme } from "../../context/ThemeContext";
import "./Timeline.css";

function Timeline({ expenses }) {
  const { isDark } = useTheme();

  // Format expenses for timeline
  const timelineItems = expenses.map((expense) => ({
    title: new Date(expense.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    cardTitle: expense.title,
    cardSubtitle: `${expense.type}: ₹${expense.amount.toFixed(2)}`,
    cardDetailedText: `Category: ${expense.category}${expense.description ? " - " + expense.description : ""}`,
  }));

  if (timelineItems.length === 0) {
    return (
      <div className="timeline-container">
        <p className="no-data">No recent transactions</p>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <Chrono
        items={timelineItems}
        mode="VERTICAL"
        hideControls
        cardHeight={100}
        disableClickOnCircle
        theme={{
          primary: isDark ? "#818cf8" : "#667eea",
          secondary: isDark ? "#2d2d2d" : "#f5f5f5",
          cardBgColor: isDark ? "#2d2d2d" : "#ffffff",
          cardForeColor: isDark ? "#f4f4f5" : "#333",
          titleColor: isDark ? "#818cf8" : "#667eea",
          titleColorActive: isDark ? "#a5b4fc" : "#5568d3",
        }}
        classNames={{
          card: 'chrono-card',
          cardMedia: 'chrono-card-media',
          cardSubTitle: 'chrono-card-subtitle',
          cardText: 'chrono-card-text',
          cardTitle: 'chrono-card-title',
          title: 'chrono-title',
        }}
      />
    </div>
  );
}

export default Timeline;

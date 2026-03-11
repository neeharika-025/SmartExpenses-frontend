// Specialized Skeleton Loaders for different components
import React from "react";
import Skeleton from "./Skeleton";
import "./Skeleton.css";

// Summary Card Skeleton (for Dashboard top cards)
export const SkeletonSummaryCard = () => (
  <div className="skeleton-summary-card">
    <Skeleton variant="text" width="60%" height="18px" />
    <Skeleton variant="text" width="80%" height="32px" />
  </div>
);

// Expense Card Skeleton
export const SkeletonExpenseCard = () => (
  <div className="skeleton-expense-card">
    <div className="skeleton-expense-header">
      <Skeleton variant="circle" width="40px" height="40px" />
      <Skeleton variant="text" width="100px" height="28px" />
    </div>
    <div className="skeleton-expense-body">
      <Skeleton variant="text" width="90%" height="16px" />
      <Skeleton variant="text" width="70%" height="14px" />
      <Skeleton variant="text" width="50%" height="14px" />
    </div>
  </div>
);

// Profile Header Skeleton
export const SkeletonProfileHeader = () => (
  <div className="skeleton-profile-header">
    <Skeleton variant="avatar" width="100px" height="100px" />
    <div className="skeleton-profile-info">
      <Skeleton variant="title" width="200px" height="32px" />
      <Skeleton variant="text" width="250px" height="16px" />
    </div>
  </div>
);

// Chart Skeleton
export const SkeletonChart = () => (
  <div className="skeleton-chart" />
);

// Timeline Skeleton
export const SkeletonTimeline = () => (
  <div className="skeleton-timeline" />
);

// Generic Grid Skeleton
export const SkeletonGrid = ({ count = 6, CardComponent = SkeletonExpenseCard }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, index) => (
      <CardComponent key={index} />
    ))}
  </div>
);

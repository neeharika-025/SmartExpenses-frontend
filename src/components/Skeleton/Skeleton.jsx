// Skeleton Loader Component - Shows placeholder while content is loading
import React from "react";
import "./Skeleton.css";

const Skeleton = ({ variant = "text", width, height, count = 1, className = "" }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`skeleton skeleton-${variant} ${className}`}
      style={{ width, height }}
    />
  ));

  return <>{skeletons}</>;
};

export default Skeleton;

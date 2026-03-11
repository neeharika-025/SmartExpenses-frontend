// Home Page - Landing page with simple onboarding carousel
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaChartPie, FaSearch } from "react-icons/fa";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Onboarding carousel slides
  const slides = [
    {
      title: "Track Your Expenses",
      description: "Keep track of all your income and expenses in one place",
      icon: (
        <FaChartPie
          style={{ fontSize: "48px", color: "#667eea", marginBottom: "15px" }}
        />
      ),
    },
    {
      title: "View Statistics",
      description: "Analyze your spending patterns with charts and graphs",
      icon: (
        <FaChartLine
          style={{ fontSize: "48px", color: "#667eea", marginBottom: "15px" }}
        />
      ),
    },
    {
      title: "Search & Filter",
      description: "Easily find and organize your transactions",
      icon: (
        <FaSearch
          style={{ fontSize: "48px", color: "#667eea", marginBottom: "15px" }}
        />
      ),
    },
  ];

  // Auto-scroll carousel with smooth animation
  useEffect(() => {
    const autoScroll = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(autoScroll);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-logo-wrapper">
          <img
            src="data:image/png;base64,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"
            alt="Smart Expense Tracker Logo"
            className="home-logo"
          />
        </div>
        <h1 className="home-title">Smart Expense Tracker</h1>
        <p className="home-subtitle">Manage your finances with ease</p>

        {/* Simple Onboarding Carousel */}
        <div className="carousel">
          <div className="carousel-content">
            {slides[currentSlide].icon}
            <h2>{slides[currentSlide].title}</h2>
            <p>{slides[currentSlide].description}</p>
          </div>

          <div className="carousel-controls">
            <button onClick={prevSlide} className="carousel-btn">
              ←
            </button>
            <div className="carousel-dots">
              {slides.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
            <button onClick={nextSlide} className="carousel-btn">
              →
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="home-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

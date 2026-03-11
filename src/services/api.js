// API Service - Centralized Axios configuration for API calls
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Auth APIs
export const signup = (userData) => api.post("/auth/signup", userData);
export const login = (credentials) => api.post("/auth/login", credentials);

// Expense APIs
export const getAllExpenses = () => api.get("/expenses");
export const getExpenseById = (id) => api.get(`/expenses/${id}`);
export const createExpense = (expenseData) =>
  api.post("/expenses", expenseData);
export const updateExpense = (id, expenseData) =>
  api.put(`/expenses/${id}`, expenseData);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const deleteAllExpenses = (month) => {
  const url = month ? `/expenses?month=${month}` : "/expenses";
  return api.delete(url);
};

// Search, Filter, Sort APIs
export const searchExpenses = (keyword) =>
  api.get(`/expenses/search?keyword=${keyword}`);
export const filterExpenses = (category, month) => {
  let url = "/expenses/filter?";
  if (category) url += `category=${category}&`;
  if (month) url += `month=${month}`;
  return api.get(url);
};
export const sortExpenses = (by) => api.get(`/expenses/sort?by=${by}`);

// Summary and Statistics APIs
export const getSummary = (month) => {
  const url = month ? `/expenses/summary?month=${month}` : "/expenses/summary";
  return api.get(url);
};
export const getStatistics = () => api.get("/expenses/statistics");
export const getInsights = () => api.get("/expenses/insights");
export const exportMonthlyPDF = (month, year) => {
  return api.get(`/expenses/export/${month}/${year}`, {
    responseType: "blob", // Important: Tell axios to expect binary data (PDF)
  });
};

// Budget APIs
export const setBudget = (budgetData) => api.post("/budget", budgetData);
export const getBudget = (month, year) => api.get(`/budget/${month}/${year}`);
export const getCurrentMonthBudget = () => api.get("/budget/current");
export const getBudgetSummary = (month, year) =>
  api.get(`/budget/summary/${month}/${year}`);

// Chatbot API
export const sendChatMessage = (message) => {
  const token = localStorage.getItem("token");
  return api.post(
    "/chatbot/ask",
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};

export default api;

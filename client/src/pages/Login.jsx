import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Toast from "../components/Toast.jsx";
import API from "../config/api.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const error = urlParams.get("error");

    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/";
    }

    if (error === "auth_failed") {
      setToast({ message: "Google authentication failed", type: "error" });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.error || "Invalid credentials",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 font-sans px-4 md:px-8">
      <motion.div
        className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-6"
        >
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mt-2 mr-11">
            Login to continue to Loanova
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter your password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>
        </form>

        <div className="text-center mt-6 space-y-2">
          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot your password?
          </a>

          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </motion.div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Login;

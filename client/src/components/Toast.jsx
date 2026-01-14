import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Toast = ({ message, type = "info", onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getToastClasses = () => {
    const base =
      "fixed top-5 right-5 px-5 py-4 rounded-xl text-white font-semibold z-50 flex items-center justify-between shadow-xl backdrop-blur-md min-w-[18rem] max-w-sm";

    const styles = {
      success: "bg-green-600/90",
      error: "bg-red-600/90",
      warning: "bg-yellow-500 text-gray-900",
      info: "bg-blue-600/90",
    };

    return `${base} ${styles[type] || styles.info}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        className={getToastClasses()}
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <span className="text-sm leading-snug">{message}</span>

        <motion.button
          onClick={onClose}
          className="ml-4 text-xl font-bold opacity-70 hover:opacity-100"
          whileHover={{ rotate: 90, scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          ×
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;

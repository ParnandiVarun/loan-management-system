import React from "react";
import { motion } from "framer-motion";
import logo from "../assets/FinalLogo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-300">
      <motion.div
        className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <img src={logo} alt="Loanova" className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Loanova
            </h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Smart, fast and secure digital loans built for the next generation.
            We help you grow without financial friction.
          </p>
        </div>

        {/* Loans */}
        <div>
          <h4 className="text-white font-semibold mb-4">Loans</h4>
          <ul className="space-y-3">
            {[
              "Personal Loan",
              "Education Loan",
              "Home Loan",
              "Business Loan",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-white transition hover:translate-x-1 inline-block"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-3">
            {["About Us", "Careers", "Blog", "Contact"].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="hover:text-white transition hover:translate-x-1 inline-block"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4">Support</h4>
          <ul className="space-y-3">
            {["Help Center", "Privacy Policy", "Terms of Service"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-white transition hover:translate-x-1 inline-block"
                  >
                    {item}
                  </a>
                </li>
              ),
            )}
          </ul>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Loanova. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Built with ❤️ for a smarter financial future
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

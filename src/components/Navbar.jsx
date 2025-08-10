import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Eye, FileText, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location?.pathname || "/create");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setActiveTab(location?.pathname || "/create");
  }, [location?.pathname]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const navItems = [
    { path: "/create", label: "Create Form", icon: Plus },
    { path: "/preview", label: "Preview", icon: Eye },
    { path: "/myforms", label: "My Forms", icon: FileText },
  ];

  const handleNavigation = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28 }}
      className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50 sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg"
              aria-hidden
            >
              <span className="text-white font-bold text-sm select-none">FB</span>
            </div>

            <h1 className="hidden sm:block text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Form Builder
            </h1>
          </div>

          {/* Desktop nav (md and up) */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.path;

              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/40 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  }`}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <IconComponent size={16} />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            aria-hidden={false}
          >
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 bg-black backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            {/* slide panel */}
            <motion.aside
              initial={{ y: "-10%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-6%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="relative mx-auto mt-16 w-11/12 max-w-md bg-gradient-to-br from-gray-900/95 to-gray-800/90 rounded-2xl border border-gray-800/50 p-4 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow">
                    <span className="text-white font-bold text-sm">FB</span>
                  </div>
                  <div>
                    <div className="text-white font-bold">Form Builder</div>
                    <div className="text-xs text-gray-400">Navigation</div>
                  </div>
                </div>

                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800/40 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "text-gray-200 hover:bg-gray-800/40"
                      }`}
                    >
                      <IconComponent size={18} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate("/create");
                  }}
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-95"
                >
                  Create Form
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;

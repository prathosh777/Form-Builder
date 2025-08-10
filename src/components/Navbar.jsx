import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Eye, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    setActiveTab(location.pathname); 
  }, [location.pathname]);

  const navItems = [
    { path: "/create", label: "Create Form", icon: Plus },
    { path: "/preview", label: "Preview", icon: Eye },
    { path: "/myforms", label: "My Forms", icon: FileText },
  ];

  const handleNavigation = (path) => {
    navigate(path); 
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">FB</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Form Builder
            </h1>
          </motion.div>

          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.path;

              return (
                <motion.button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    relative px-4 py-2 rounded-lg font-medium transition-all duration-300
                    flex items-center space-x-2 text-sm
                    ${
                      isActive
                        ? "text-white bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                    }
                  `}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <IconComponent size={16} />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
-0
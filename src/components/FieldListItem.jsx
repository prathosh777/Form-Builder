import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, GripVertical } from 'lucide-react';

const FieldListItem = ({ field, onSelect, onDelete, isSelected }) => {
  return (
    <motion.div
      onClick={onSelect}
      className={`
        relative group mb-3 p-4 rounded-xl border cursor-pointer
        transition-all duration-300 backdrop-blur-sm
        ${isSelected 
          ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 shadow-lg shadow-purple-500/20' 
          : 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600/70 hover:bg-gray-800/60'
        }
      `}
      whileHover={{ 
        scale: 1.02,
        y: -2,
        boxShadow: isSelected 
          ? '0 8px 32px rgba(147, 51, 234, 0.3)'
          : '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GripVertical 
            size={18} 
            className="text-gray-500 group-hover:text-gray-400 transition-colors cursor-grab active:cursor-grabbing" 
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className={`
                font-medium text-sm
                ${isSelected ? 'text-white' : 'text-gray-200'}
              `}>
                {field.label}
              </span>
              <span className={`
                px-2 py-1 text-xs rounded-md font-medium
                ${isSelected 
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-400/30' 
                  : 'bg-gray-700/50 text-gray-400 border border-gray-600/30'
                }
              `}>
                {field.type}
              </span>
            </div>
          </div>
        </div>

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="
            p-2 rounded-lg opacity-0 group-hover:opacity-100
            transition-all duration-200
            hover:bg-red-500/20 hover:text-red-400
            text-gray-500
          "
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={16} />
        </motion.button>
      </div>

      {isSelected && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-l-xl"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export default FieldListItem;
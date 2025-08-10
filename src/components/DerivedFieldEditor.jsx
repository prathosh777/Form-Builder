import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Trash2, 
  Code, 
  Link,
  ChevronDown,
  X,
  Plus
} from 'lucide-react';

const DerivedFieldEditor = ({ field, onUpdate, allFields }) => {
  const [isDerived, setIsDerived] = useState(!!field.derived);
  const [parents, setParents] = useState(field.derived?.parents || []);
  const [formula, setFormula] = useState(field.derived?.formula || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handleSave = () => {
    onUpdate({ 
      derived: { 
        parents, 
        formula
      } 
    });
  };
  
  const handleRemove = () => {
    setIsDerived(false);
    setParents([]);
    setFormula('');
    onUpdate({ derived: null });
  };

  const toggleParent = (fieldId) => {
    setParents(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const removeParent = (fieldId) => {
    setParents(prev => prev.filter(id => id !== fieldId));
  };

  const availableFields = allFields.filter(f => f.id !== field.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <div className="flex items-center space-x-3">
          <Code className="text-purple-400" size={20} />
          <div>
            <h3 className="text-white font-medium">Derived Field</h3>
            <p className="text-gray-400 text-sm">Calculate value from other fields</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setIsDerived(!isDerived);
            if (isDerived) {
              handleRemove();
            }
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            isDerived ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-600'
          }`}
        >
          <motion.span
            animate={{ x: isDerived ? 20 : 2 }}
            className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          />
        </button>
      </div>

      <AnimatePresence>
        {isDerived && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 overflow-hidden"
          >
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                <Link className="inline mr-2" size={16} />
                Parent Fields
              </label>
              
              {parents.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {parents.map(parentId => {
                    const parentField = availableFields.find(f => f.id === parentId);
                    return parentField ? (
                      <motion.span
                        key={parentId}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center space-x-2 bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                      >
                        <span>{parentField.label}</span>
                        <button
                          onClick={() => removeParent(parentId)}
                          className="hover:bg-purple-500/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </motion.span>
                    ) : null;
                  })}
                </div>
              )}

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full p-3 bg-gray-800/50 text-white rounded-lg border border-gray-600/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300 flex items-center justify-between"
                >
                  <span className="text-gray-400">
                    {parents.length === 0 ? 'Select parent fields...' : `${parents.length} field(s) selected`}
                  </span>
                  <ChevronDown 
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    size={16} 
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600/50 rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
                    >
                      {availableFields.length === 0 ? (
                        <div className="p-3 text-gray-400 text-sm">No other fields available</div>
                      ) : (
                        availableFields.map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => toggleParent(f.id)}
                            className={`w-full text-left p-3 hover:bg-gray-700/50 transition-colors flex items-center justify-between ${
                              parents.includes(f.id) ? 'bg-purple-600/20 text-purple-300' : 'text-gray-300'
                            }`}
                          >
                            <span>{f.label}</span>
                            {parents.includes(f.id) && (
                              <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-300">
                <Code className="inline mr-2" size={16} />
                Formula (JavaScript Expression)
              </label>
              <textarea
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                placeholder="e.g., parentField1 + ' ' + parentField2"
                className="w-full p-4 bg-gray-800/50 text-white rounded-lg border border-gray-600/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300 resize-none font-mono text-sm"
                rows={3}
              />
              <p className="text-gray-400 text-xs">
                Use the parent field IDs as variables in your expression. Available variables: {parents.join(', ') || 'None selected'}
              </p>
            </div>

            {formula && parents.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
              >
                <h4 className="text-sm font-medium text-gray-300 mb-2">Preview</h4>
                <code className="text-green-400 text-sm font-mono bg-gray-800/50 p-2 rounded block">
                  {formula}
                </code>
              </motion.div>
            )}

            <div className="flex space-x-3 pt-4">
              <motion.button
                onClick={handleSave}
                disabled={!formula || parents.length === 0}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                  !formula || parents.length === 0
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25'
                }`}
                whileHover={formula && parents.length > 0 ? { scale: 1.02 } : {}}
                whileTap={formula && parents.length > 0 ? { scale: 0.98 } : {}}
              >
                <Save size={16} />
                <span>Save Configuration</span>
              </motion.button>

              <motion.button
                onClick={handleRemove}
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-red-600/20 text-red-300 rounded-lg font-medium border border-red-500/30 hover:bg-red-600/30 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DerivedFieldEditor;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Type, 
  Star, 
  List,
  Edit3,
  Save,
  AlertTriangle
} from 'lucide-react';

const DerivedFieldEditor = ({ field, onUpdate, allFields }) => (
  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
    <h4 className="text-gray-300 font-medium mb-2">Derived Field Configuration</h4>
    <p className="text-gray-400 text-sm">Derived field editor would go here</p>
  </div>
);

const ValidationEditor = ({ validations, onUpdate, fieldType }) => (
  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
    <h4 className="text-gray-300 font-medium mb-2">Validation Rules</h4>
    <p className="text-gray-400 text-sm">Validation editor for {fieldType} field</p>
  </div>
);

const FieldConfigurator = ({ field, onUpdate, allFields }) => {
  const [config, setConfig] = useState(field);
  
  useEffect(() => {
    setConfig(field);
  }, [field]);

  const handleChange = (prop, value) => {
    setConfig(prev => ({ ...prev, [prop]: value }));
    onUpdate({ [prop]: value });
  };

  const handleToggle = (prop, value) => {
    setConfig(prev => ({ ...prev, [prop]: value }));
    onUpdate({ [prop]: value });
  };

  const handleOptionsChange = (index, value) => {
    const newOptions = [...(config.options || [])];
    newOptions[index] = value;
    setConfig(prev => ({ ...prev, options: newOptions }));
    onUpdate({ options: newOptions });
  };

  const addOption = () => {
    const currentOptions = config.options || [];
    const newOptions = [...currentOptions, `Option ${currentOptions.length + 1}`];
    setConfig(prev => ({ ...prev, options: newOptions }));
    onUpdate({ options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = (config.options || []).filter((_, i) => i !== index);
    setConfig(prev => ({ ...prev, options: newOptions }));
    onUpdate({ options: newOptions });
  };

  const handleValidationUpdate = (validations) => {
    setConfig(prev => ({ ...prev, validations }));
    onUpdate({ validations });
  };

  const handleDerivedUpdate = (derived) => {
    setConfig(prev => ({ ...prev, derived }));
    onUpdate({ derived });
  };

  const inputClasses = "w-full p-3 bg-gray-800/50 text-white rounded-lg border border-gray-600/50 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 outline-none transition-all duration-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-2xl p-6 space-y-6"
    >
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-700/50">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Settings className="text-white" size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Field Configuration</h2>
          <p className="text-gray-400 text-sm">Customize your field properties</p>
        </div>
      </div>

      <div className="space-y-6">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
              <Type size={16} />
              <span>Field Label</span>
            </label>
            <motion.input
              type="text"
              value={config.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Enter field label..."
              className={inputClasses}
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
            <div className="flex items-center space-x-3">
              <Star className="text-orange-400" size={20} />
              <div>
                <h3 className="text-white font-medium">Required Field</h3>
                <p className="text-gray-400 text-sm">Users must fill this field</p>
              </div>
            </div>
            
            <button
              onClick={() => handleToggle('required', !config.required)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                config.required ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-600'
              }`}
            >
              <motion.span
                animate={{ x: config.required ? 20 : 2 }}
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              />
            </button>
          </div>
        </motion.div>

        {['text', 'number', 'textarea', 'date'].includes(config.type) && (
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
              <Edit3 size={16} />
              <span>Default Value</span>
            </label>
            {config.type === 'textarea' ? (
              <motion.textarea
                value={config.defaultValue || ''}
                onChange={(e) => handleChange('defaultValue', e.target.value)}
                placeholder="Enter default value..."
                className={`${inputClasses} resize-none`}
                rows={3}
                whileFocus={{ scale: 1.01 }}
              />
            ) : (
              <motion.input
                type={config.type === 'number' ? 'number' : config.type === 'date' ? 'date' : 'text'}
                value={config.defaultValue || ''}
                onChange={(e) => handleChange('defaultValue', e.target.value)}
                placeholder="Enter default value..."
                className={inputClasses}
                whileFocus={{ scale: 1.01 }}
              />
            )}
          </motion.div>
        )}

        {(config.type === 'select' || config.type === 'radio') && (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-2">
              <List className="text-blue-400" size={16} />
              <h3 className="text-lg font-semibold text-white">Options</h3>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {(config.options || []).map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-1">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionsChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className={inputClasses}
                      />
                    </div>
                    <motion.button
                      onClick={() => removeOption(index)}
                      className="p-3 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors border border-red-500/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <motion.button
                onClick={addOption}
                className="w-full p-3 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg font-medium transition-all duration-300 flex items-center justify-center space-x-2 border-2 border-dashed border-gray-600 hover:border-gray-500"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Plus size={16} />
                <span>Add Option</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {!config.derived && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-yellow-400" size={16} />
              <h3 className="text-lg font-semibold text-white">Validation Rules</h3>
            </div>
            <ValidationEditor 
              validations={config.validations} 
              onUpdate={handleValidationUpdate}
              fieldType={config.type}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <DerivedFieldEditor 
            field={config} 
            onUpdate={handleDerivedUpdate}
            allFields={allFields?.filter(f => f.id !== config.id) || []}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="pt-6 border-t border-gray-700/50"
        >
          <motion.button
            className="w-full p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2 hover:shadow-lg hover:shadow-purple-500/25"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log('Configuration saved:', config);
            }}
          >
            <Save size={20} />
            <span>Save Configuration</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FieldConfigurator;
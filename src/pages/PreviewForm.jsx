import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Send, ArrowLeft, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

export default function PreviewForm() {
  const navigate = useNavigate();
  const [formSchema, setFormSchema] = useState(null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("currentForm");
    if (!saved) {
      setFormSchema(null);
      return;
    }
    try {
      const schema = JSON.parse(saved);
      setFormSchema(schema);

      const initial = {};
      (schema.fields || []).forEach((f, idx) => {
        const id = f.id ?? `field-${idx}`;
        if (f.type === "checkbox") initial[id] = false;
        else initial[id] = ""; 
      });
      setValues(initial);
      setErrors({});
      setSuccess(false);
    } catch (e) {
      console.error("Could not parse currentForm from localStorage", e);
      setFormSchema(null);
    }
  }, []);

  const normalizeRules = (rules) => {
    if (!rules) return [];
    return rules
      .map((r) => {
        if (typeof r === "string") return { type: r };
        if (typeof r === "object" && r !== null) return r;
        return null;
      })
      .filter(Boolean);
  };

  const validateField = (field, value) => {
    const rules = normalizeRules(field.validations);
    if (field.required) {
      if (field.type === "checkbox") {
        if (!value) return "This field is required";
      } else if (!value || (typeof value === "string" && value.trim() === "")) {
        return "This field is required";
      }
    }

    for (const rule of rules) {
      const type = rule.type;
      if (type === "minLength") {
        const min = Number(rule.value ?? 0);
        if ((value || "").length < min) return rule.message || `Minimum length is ${min}`;
      }
      if (type === "maxLength") {
        const max = Number(rule.value ?? Infinity);
        if ((value || "").length > max) return rule.message || `Maximum length is ${max}`;
      }
      if (type === "email") {
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return rule.message || "Invalid email address";
      }
      if (type === "password") {
        if (value) {
          const ok = value.length >= 8 && /\d/.test(value);
          if (!ok) return rule.message || "Password must be at least 8 characters and contain a number";
        }
      }
    }

    return null;
  };

  const handleChange = (id, next) => {
    setValues((prev) => ({ ...prev, [id]: next }));
    setErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!formSchema) return;

    const newErrors = {};
    formSchema.fields.forEach((f, idx) => {
      const id = f.id ?? `field-${idx}`;
      const err = validateField(f, values[id]);
      if (err) newErrors[id] = err;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 900));
      setSubmitting(false);
      setSuccess(true);

      setTimeout(() => setSuccess(false), 2500);
    } else {
      const firstErrorIndex = formSchema.fields.findIndex((f, idx) => {
        const id = f.id ?? `field-${idx}`;
        return !!newErrors[id];
      });
      if (firstErrorIndex >= 0) {
        const el = document.querySelector(`[data-field-index="${firstErrorIndex}"]`);
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  if (!formSchema) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-sm text-center max-w-lg">
          <p className="text-gray-300 mb-4">No form to preview yet.</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => navigate("/create")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
            >
              Create Form
            </button>
            <button
              onClick={() => navigate("/myforms")}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-gray-800/60"
            >
              My Forms
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                {formSchema.formName || "Untitled Form"}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Preview — interact as a user would. (No default values will be prefilled.)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/create")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700/50 bg-gray-800/40 text-gray-200 hover:scale-105 transition-transform"
                title="Back to builder"
              >
                <ArrowLeft size={16} />
                Edit
              </button>
              <button
                onClick={() => navigate("/myforms")}
                className="px-3 py-2 rounded-lg bg-gray-800/40 border border-gray-700/50 text-gray-200 hover:scale-105 transition-transform"
                title="My forms"
              >
                My Forms
              </button>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-2xl"
        >
          <div className="space-y-5">
            {formSchema.fields.map((field, idx) => {
              const id = field.id ?? `field-${idx}`;
              const value = values[id];
              const error = errors[id];

              return (
                <motion.div
                  layout
                  data-field-index={idx}
                  key={id}                             
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`p-4 rounded-xl border ${
                    error ? "border-red-500/50 bg-red-900/10" : "border-gray-700/50 bg-gray-900/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        {field.label} {field.required && <span className="text-red-400">*</span>}
                      </label>

                      {["text", "number", "date"].includes(field.type) && (
                        <input
                          type={field.type}
                          value={value}
                          onChange={(e) => handleChange(id, e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white outline-none transition-all ${
                            error ? "ring-2 ring-red-400/30" : "focus:ring-2 focus:ring-purple-500/20"
                          }`}
                          placeholder={field.placeholder || ""}
                        />
                      )}

                      {field.type === "textarea" && (
                        <textarea
                          value={value}
                          onChange={(e) => handleChange(id, e.target.value)}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white outline-none transition-all ${
                            error ? "ring-2 ring-red-400/30" : "focus:ring-2 focus:ring-purple-500/20"
                          }`}
                          placeholder={field.placeholder || ""}
                        />
                      )}

                      {field.type === "select" && (
                        <select
                          value={value}
                          onChange={(e) => handleChange(id, e.target.value)}
                          className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white outline-none transition-all ${
                            error ? "ring-2 ring-red-400/30" : "focus:ring-2 focus:ring-purple-500/20"
                          }`}
                        >
                          <option value="">Select an option...</option>
                          {Array.isArray(field.options) &&
                            field.options.map((opt, i) => (
                              <option key={`${id}-opt-${i}`} value={opt}> 
                                {opt}
                              </option>
                            ))}
                        </select>
                      )}

                      {field.type === "radio" && (
                        <div className="flex flex-col space-y-2">
                          {Array.isArray(field.options) &&
                            field.options.map((opt, i) => (
                              <label key={`${id}-radio-${i}`} className="inline-flex items-center gap-2 text-gray-200">
                                <input
                                  type="radio"
                                  name={id}
                                  value={opt}
                                  checked={value === opt}
                                  onChange={(e) => handleChange(id, e.target.value)}
                                  className="w-4 h-4"
                                />
                                <span>{opt}</span>
                              </label>
                            ))}
                        </div>
                      )}

                      {field.type === "checkbox" && (
                        <label className="inline-flex items-center gap-3 text-gray-200">
                          <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => handleChange(id, e.target.checked)}
                            className="w-5 h-5"
                          />
                          <span>{field.label}</span>
                        </label>
                      )}

                      {error && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-red-300">
                          <AlertCircle size={14} />
                          <span>{error}</span>
                        </div>
                      )}
                    </div>

                    <div className="w-28 flex-shrink-0 text-right">
                      <div className="text-xs text-gray-400">{(field.type || "").toUpperCase()}</div>
                      {field.validations && field.validations.length > 0 && (
                        <div className="mt-2 text-xs text-gray-300">
                          <strong>Rules:</strong>
                          <div className="text-xs text-gray-400">
                            {normalizeDisplayValidations(field.validations)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold transition-all ${
                submitting || success
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg hover:scale-[1.02]"
              }`}
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="60" strokeDashoffset="0" fill="none" /></svg>
                  Submitting...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={16} />
                  Submitted
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const initial = {};
                (formSchema.fields || []).forEach((f, idx) => {
                  const id = f.id ?? `field-${idx}`;
                  initial[id] = f.type === "checkbox" ? false : "";
                });
                setValues(initial);
                setErrors({});
              }}
              className="px-4 py-3 rounded-xl border border-gray-700 text-gray-200 hover:bg-gray-800/40"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={() => navigate("/create")}
              className="px-4 py-3 rounded-xl border border-gray-700 text-gray-200 hover:bg-gray-800/40 ml-auto"
            >
              Back to Builder
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

function normalizeDisplayValidations(validations) {
  if (!validations) return "—";
  const arr = validations
    .map((v) => {
      if (typeof v === "string") return prettyRule(v);
      if (typeof v === "object" && v !== null) {
        return v.type === "minLength" || v.type === "maxLength" ? `${prettyRule(v.type)}(${v.value})` : prettyRule(v.type);
      }
      return null;
    })
    .filter(Boolean);
  return arr.join(", ");
}

function prettyRule(type) {
  switch (type) {
    case "required":
      return "required";
    case "minLength":
      return "minLen";
    case "maxLength":
      return "maxLen";
    case "email":
      return "email";
    case "password":
      return "password";
    default:
      return type;
  }
}

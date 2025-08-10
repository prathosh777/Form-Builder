import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Switch,
} from "@mui/material";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from "react-router-dom";

function makeId(prefix = "field") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export default function CreateForm() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([]);
  const [formName, setFormName] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [fieldConfig, setFieldConfig] = useState(makeEmptyField());
  const savingRef = useRef(false);

  useEffect(() => {
    const current = localStorage.getItem("currentForm");
    if (current) {
      try {
        const parsed = JSON.parse(current);
        setFormName(parsed.formName || "");
        const normalized = (parsed.fields || []).map((f, idx) => ({
          id: f.id ?? makeId(),
          ...f,
        }));
        setFields(normalized);
      } catch (e) {
        console.warn("currentForm parse error", e);
      }
    }
  }, []);

  useEffect(() => {
    if (savingRef.current) {
      const payload = {
        formName: formName || "Untitled Form",
        fields,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem("currentForm", JSON.stringify(payload));
    } else {
      savingRef.current = true;
    }
  }, [fields, formName]);

  function makeEmptyField() {
    return {
      id: null,
      label: "",
      type: "text",
      placeholder: "",
      required: false,
      defaultValue: "",
      validations: [],
      options: [],
      derived: false,
      parents: [],
      formula: "",
    };
  }

  const openEditorForNew = () => {
    setEditingIndex(null);
    setFieldConfig(makeEmptyField());
    setEditorOpen(true);
  };

  const openEditorForEdit = (index) => {
    const f = fields[index];
    setFieldConfig({ ...f });
    setEditingIndex(index);
    setEditorOpen(true);
  };

  const removeField = (index) => {
    const next = fields.filter((_, i) => i !== index);
    setFields(next);
  };

  const addOption = () => {
    setFieldConfig((prev) => ({
      ...prev,
      options: [
        ...(prev.options || []),
        `Option ${(prev.options?.length || 0) + 1}`,
      ],
    }));
  };

  const removeOption = (idx) => {
    setFieldConfig((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx),
    }));
  };

  const updateOption = (idx, value) => {
    const opts = [...(fieldConfig.options || [])];
    opts[idx] = value;
    setFieldConfig((prev) => ({ ...prev, options: opts }));
  };

  const addValidation = () => {
    setFieldConfig((prev) => ({
      ...prev,
      validations: [
        ...(prev.validations || []),
        { type: "required", value: "", message: "" },
      ],
    }));
  };

  const updateValidation = (i, next) => {
    const copy = [...(fieldConfig.validations || [])];
    copy[i] = { ...copy[i], ...next };
    setFieldConfig((prev) => ({ ...prev, validations: copy }));
  };

  const removeValidation = (i) => {
    setFieldConfig((prev) => ({
      ...prev,
      validations: prev.validations.filter((_, idx) => idx !== i),
    }));
  };

  const saveField = () => {
    if (!fieldConfig.label || !fieldConfig.label.trim()) {
      alert("Please enter a label for the field.");
      return;
    }

    const id = fieldConfig.id ?? makeId();
    const toSave = { ...fieldConfig, id };

    if (editingIndex === null) {
      setFields((prev) => [...prev, toSave]);
    } else {
      setFields((prev) =>
        prev.map((f, idx) => (idx === editingIndex ? toSave : f))
      );
    }

    setEditorOpen(false);
    setEditingIndex(null);
    setFieldConfig(makeEmptyField());
  };

  const handleSaveForm = () => {
    if (!formName || !formName.trim()) {
      alert("Please enter a form name before saving.");
      return;
    }
    if (!fields.length) {
      alert("Please add at least one field to save a form.");
      return;
    }

    const createdAt = new Date().toISOString();
    const payload = {
      formName: formName.trim(),
      fields,
      createdAt,
    };

    const existing = JSON.parse(localStorage.getItem("forms") || "[]");
    existing.push(payload);
    localStorage.setItem("forms", JSON.stringify(existing));

    localStorage.setItem("currentForm", JSON.stringify(payload));

    navigate("/preview");
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const copy = Array.from(fields);
    const [moved] = copy.splice(result.source.index, 1);
    copy.splice(result.destination.index, 0, moved);
    setFields(copy);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
            Form Builder
          </h1>
          <p className="text-gray-400 mt-1">
            Add fields, configure validations, reorder and save.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">
                Form name
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Enter a name for the form"
                className="w-full px-3 py-2 rounded-lg bg-gray-900 text-white border border-gray-700"
              />
            </div>

            <div>
              <Button
                variant="contained"
                startIcon={<Plus />}
                onClick={openEditorForNew}
                fullWidth
                sx={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }}
              >
                Add Field
              </Button>
            </div>

            <div className="mt-6">
              <Button variant="outlined" onClick={handleSaveForm} fullWidth>
                Save Form
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg text-white font-semibold">Fields</h3>
              <div className="text-sm text-gray-400">
                {fields.length} {fields.length === 1 ? "field" : "fields"}
              </div>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="fields-drop">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-3"
                  >
                    {fields.map((f, idx) => (
                      <Draggable
                        key={f.id}
                        draggableId={String(f.id)}
                        index={idx}
                      >
                        {(prov) => (
                          <motion.div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
                              prov.isDragging
                                ? "bg-gray-900/60"
                                : "bg-gray-900/30"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="text-sm font-medium text-gray-100">
                                  {f.label}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {(f.type || "text").toUpperCase()}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <IconButton
                                size="small"
                                onClick={() => openEditorForEdit(idx)}
                                sx={{
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.04)",
                                  },
                                }}
                              >
                                <Edit size={16} />
                              </IconButton>

                              <IconButton
                                size="small"
                                onClick={() => removeField(idx)}
                                sx={{
                                  color: "white",
                                  "&:hover": {
                                    backgroundColor: "rgba(255,0,0,0.06)",
                                  },
                                }}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </div>
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      <Dialog
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            background:
              "linear-gradient(180deg, rgba(17,24,39,0.92), rgba(10,11,14,0.85))",
            border: "1px solid rgba(147,51,234,0.06)",
            borderRadius: 2,
            p: 0,
            overflow: "hidden",
            backdropFilter: "blur(8px)",
          },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(90deg,#7c3aed,#ec4899)",
              color: "transparent",
              WebkitBackgroundClip: "text",
              fontWeight: 700,
            }}
          >
            {editingIndex === null ? "Add Field" : "Edit Field"}
          </DialogTitle>

          <DialogContent sx={{ px: 4, py: 3, color: "white" }}>
            <div className="space-y-3 mt-2">
              <TextField
                label="Label"
                fullWidth
                value={fieldConfig.label}
                onChange={(e) =>
                  setFieldConfig((p) => ({ ...p, label: e.target.value }))
                }
                variant="filled"
                sx={{
                  background: "rgba(17,24,39,0.6)",
                  borderRadius: 1,
                  "& .MuiFilledInput-root": {
                    background: "rgba(31,41,55,0.6)",
                  },
                  input: { color: "white" },
                  label: { color: "rgba(203,213,225,0.6)" },
                }}
              />

              <FormControl
                fullWidth
                variant="filled"
                sx={{ background: "rgba(17,24,39,0.6)", borderRadius: 1 }}
              >
                <InputLabel sx={{ color: "rgba(203,213,225,0.6)" }}>
                  Type
                </InputLabel>
                <Select
                  value={fieldConfig.type}
                  label="Type"
                  onChange={(e) =>
                    setFieldConfig((p) => ({ ...p, type: e.target.value }))
                  }
                  sx={{ color: "white" }}
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                  <MenuItem value="textarea">Textarea</MenuItem>
                  <MenuItem value="select">Select</MenuItem>
                  <MenuItem value="radio">Radio</MenuItem>
                  <MenuItem value="checkbox">Checkbox</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Placeholder"
                fullWidth
                value={fieldConfig.placeholder}
                onChange={(e) =>
                  setFieldConfig((p) => ({ ...p, placeholder: e.target.value }))
                }
                variant="filled"
                sx={{
                  background: "rgba(17,24,39,0.6)",
                  borderRadius: 1,
                  "& .MuiFilledInput-root": {
                    background: "rgba(31,41,55,0.6)",
                  },
                  input: { color: "white" },
                  label: { color: "rgba(203,213,225,0.6)" },
                }}
              />

              <div className="flex items-center gap-2">
                <Switch
                  checked={!!fieldConfig.required}
                  onChange={(e) =>
                    setFieldConfig((p) => ({
                      ...p,
                      required: e.target.checked,
                    }))
                  }
                />
                <span className="text-sm text-gray-200">Required</span>
              </div>

              {(fieldConfig.type === "select" ||
                fieldConfig.type === "radio") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">Options</div>
                    <Button
                      size="small"
                      onClick={addOption}
                      variant="contained"
                      sx={{
                        background: "linear-gradient(90deg,#06b6d4,#7c3aed)",
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  {(fieldConfig.options || []).map((opt, i) => (
                    <div key={`opt-${i}`} className="flex items-center gap-2">
                      <input
                        className="flex-1 px-2 py-1 rounded bg-gray-900 text-white border border-gray-700"
                        value={opt}
                        onChange={(e) => updateOption(i, e.target.value)}
                      />
                      <Button
                        color="error"
                        onClick={() => removeOption(i)}
                        variant="outlined"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300">Validations</div>
                  <Button
                    size="small"
                    onClick={addValidation}
                    variant="contained"
                    sx={{
                      background: "linear-gradient(90deg,#7c3aed,#ec4899)",
                    }}
                  >
                    Add
                  </Button>
                </div>

                {(fieldConfig.validations || []).map((v, i) => (
                  <div key={`val-${i}`} className="flex items-center gap-2">
                    <Select
                      value={v.type}
                      onChange={(e) =>
                        updateValidation(i, { type: e.target.value })
                      }
                      sx={{
                        minWidth: 140,
                        color: "white",
                        background: "rgba(17,24,39,0.6)",
                        borderRadius: 1,
                      }}
                    >
                      <MenuItem value="required">required</MenuItem>
                      <MenuItem value="minLength">minLength</MenuItem>
                      <MenuItem value="maxLength">maxLength</MenuItem>
                      <MenuItem value="email">email</MenuItem>
                      <MenuItem value="password">password</MenuItem>
                    </Select>
                    {(v.type === "minLength" || v.type === "maxLength") && (
                      <input
                        type="number"
                        value={v.value || ""}
                        onChange={(e) =>
                          updateValidation(i, { value: e.target.value })
                        }
                        className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700"
                        placeholder="value"
                      />
                    )}
                    <input
                      placeholder="message (optional)"
                      value={v.message || ""}
                      onChange={(e) =>
                        updateValidation(i, { message: e.target.value })
                      }
                      className="flex-1 px-2 py-1 rounded bg-gray-900 text-white border border-gray-700"
                    />
                    <Button
                      color="error"
                      onClick={() => removeValidation(i)}
                      variant="outlined"
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-700/40">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300">Derived field?</div>
                  <Select
                    value={fieldConfig.derived ? "yes" : "no"}
                    onChange={(e) =>
                      setFieldConfig((p) => ({
                        ...p,
                        derived: e.target.value === "yes",
                      }))
                    }
                    sx={{
                      width: 120,
                      color: "white",
                      background: "rgba(17,24,39,0.6)",
                      borderRadius: 1,
                    }}
                  >
                    <MenuItem value="no">No</MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                  </Select>
                </div>

                {fieldConfig.derived && (
                  <div className="mt-3 space-y-2">
                    <div className="text-xs text-gray-400">
                      Parents (select fields that should be parents)
                    </div>
                    <Select
                      multiple
                      value={fieldConfig.parents}
                      onChange={(e) =>
                        setFieldConfig((p) => ({
                          ...p,
                          parents: e.target.value,
                        }))
                      }
                      sx={{
                        width: "100%",
                        color: "white",
                        background: "rgba(17,24,39,0.6)",
                        borderRadius: 1,
                      }}
                    >
                      {fields
                        .filter((f) => f.id)
                        .map((f) => (
                          <MenuItem key={f.id} value={f.id}>
                            {f.label}
                          </MenuItem>
                        ))}
                    </Select>

                    <TextField
                      label="Formula (simple expression, optional)"
                      fullWidth
                      value={fieldConfig.formula}
                      onChange={(e) =>
                        setFieldConfig((p) => ({
                          ...p,
                          formula: e.target.value,
                        }))
                      }
                      variant="filled"
                      sx={{
                        background: "rgba(17,24,39,0.6)",
                        borderRadius: 1,
                        "& .MuiFilledInput-root": {
                          background: "rgba(31,41,55,0.6)",
                        },
                        input: { color: "white" },
                      }}
                    />
                    <div className="text-xs text-gray-400">
                      Note: Derived fields are optional. Preview currently
                      ignores derived computation if present.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>

          <DialogActions
            sx={{
              px: 4,
              py: 3,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => {
                setEditorOpen(false);
                setEditingIndex(null);
                setFieldConfig(makeEmptyField());
              }}
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(148,163,184,0.08)" }}
            >
              Cancel
            </Button>
            <Button
              onClick={saveField}
              variant="contained"
              sx={{
                background: "linear-gradient(90deg,#ff3d6e,#9333ea)",
                color: "white",
              }}
            >
              Save Field
            </Button>
          </DialogActions>
        </motion.div>
      </Dialog>
    </div>
  );
}

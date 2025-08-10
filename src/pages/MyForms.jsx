import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function MyForms() {
  const [forms, setForms] = useState([]);
  const [toDelete, setToDelete] = useState(null); 
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("forms");
    if (saved) {
      try {
        setForms(JSON.parse(saved));
      } catch (e) {
        console.error("Failed parsing saved forms:", e);
        setForms([]);
      }
    }
  }, []);

  const persistForms = (next) => {
    setForms(next);
    localStorage.setItem("forms", JSON.stringify(next));
  };

  const handlePreview = (form) => {
    localStorage.setItem("currentForm", JSON.stringify(form));
    navigate("/preview");
  };

  const confirmDelete = (form) => {
    setToDelete(form);
    setDeleteOpen(true);
  };

  const performDelete = () => {
    if (!toDelete) return;
    const idOrCreated = toDelete.id ?? toDelete.createdAt ?? toDelete.formName;
    const updated = forms.filter((f) => {
      const key = f.id ?? f.createdAt ?? f.formName;
      return key !== idOrCreated;
    });
    persistForms(updated);
    setDeleteOpen(false);
    setToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteOpen(false);
    setToDelete(null);
  };

  const handleDuplicate = (form) => {
    const copy = {
      ...form,
      createdAt: new Date().toISOString(),
      formName: `${form.formName} (Copy)`,
      fields: (form.fields || []).map((fld) => ({
        ...fld,
        id: fld.id ?? `${fld.label ?? "field"}-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      })),
    };
    const next = [copy, ...forms];
    persistForms(next);
  };

  const formatDate = (iso) => {
    if (!iso) return "Unknown";
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  if (!forms || forms.length === 0) {
    return (
      <div className="min-h-[60vh] flex text-slate-50 items-center justify-center">
        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 backdrop-blur-sm text-center max-w-lg">
          <div className="mb-4">
            <Typography variant="h6" sx={{ color: "white", mb: 1 }}>
              No saved forms
            </Typography>
            <Typography variant="body2" sx={{ color: "gray.400" }}>
              Create your first form to get started.
            </Typography>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              onClick={() => navigate("/create")}
              sx={{
                px: 3,
                py: 1.5,
                background: "linear-gradient(90deg,#7c3aed,#ec4899)",
                color: "white",
                "&:hover": { opacity: 0.95 },
              }}
              variant="contained"
            >
              Create Form
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant="outlined"
              sx={{ color: "white", borderColor: "rgba(148,163,184,0.12)" }}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ color: "white", mb: 3 }}>
        My Saved Forms
      </Typography>

      <div className="space-y-4">
        {forms.map((form, idx) => {
          const key = form.id ?? form.createdAt ?? `form-${idx}`;
          return (
            <motion.div key={key} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.01 }}>
              <Paper
                sx={{
                  p: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "rgba(31, 41, 55, 0.85)",
                  color: "white",
                  borderRadius: 2,
                  border: "1px solid rgba(148,163,184,0.06)",
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ color: "white" }}>
                    {form.formName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "gray.400" }}>
                    Created: {formatDate(form.createdAt)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "gray.500", display: "block", mt: 0.5 }}>
                    {Array.isArray(form.fields) ? `${form.fields.length} field${form.fields.length === 1 ? "" : "s"}` : "—"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Button
                    startIcon={<VisibilityIcon />}
                    onClick={() => handlePreview(form)}
                    sx={{
                      textTransform: "none",
                      background: "linear-gradient(90deg,#06b6d4,#7c3aed)",
                      color: "white",
                      px: 2,
                      py: 1,
                      "&:hover": { opacity: 0.95 },
                    }}
                    variant="contained"
                  >
                    Preview
                  </Button>

                  <IconButton onClick={() => handleDuplicate(form)} title="Duplicate" sx={{ color: "white", border: "1px solid rgba(148,163,184,0.06)", ml: 1 }}>
                    <ContentCopyIcon />
                  </IconButton>

                  <IconButton onClick={() => confirmDelete(form)} title="Delete" sx={{ color: "white", ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={() => navigate("/create")}
          sx={{ px: 4, py: 1.5, background: "linear-gradient(90deg,#7c3aed,#ec4899)", color: "white", "&:hover": { opacity: 0.95 } }}
          variant="contained"
        >
          Create New Form
        </Button>
      </div>

      <Dialog  open={deleteOpen} onClose={cancelDelete} PaperProps={{ sx: { background: "transparent", boxShadow: "none" } }}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <Paper sx={{ p: 4, width: 460, borderRadius: 3, background: "linear-gradient(180deg, rgba(17,24,39,0.85), rgba(17,24,39,0.75))", border: "1px solid rgba(147,51,234,0.08)", backdropFilter: "blur(6px)" }}>
            <DialogTitle sx={{ p: 0 }}>
              <Typography variant="h6" sx={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)", WebkitBackgroundClip: "text", color: "transparent", fontWeight: 700 }}>
                Confirm Delete
              </Typography>
            </DialogTitle>

            <DialogContent sx={{ p: 0, mt: 1 }}>
              <Typography className="text-white" sx={{ color: "gray.300", mb: 2 }}>
                Are you sure you want to permanently delete the form{" "}
                <strong style={{ color: "white" }}>{toDelete?.formName}</strong>?
              </Typography>
              <Typography variant="caption" className="text-white" sx={{ color: "gray.500" }}>
                This action cannot be undone. You can create another copy from the builder if needed.
              </Typography>
            </DialogContent>

            <DialogActions sx={{ mt: 4, p: 0, display: "flex", gap: 2 }}>
              <Button onClick={cancelDelete} variant="outlined" sx={{ color: "white", borderColor: "rgba(148,163,184,0.08)", px: 3 }}>
                Cancel
              </Button>

              <Button onClick={performDelete} variant="contained" sx={{ px: 3, background: "linear-gradient(90deg,#ff3d6e,#9333ea)", color: "white", "&:hover": { opacity: 0.95 } }}>
                Delete
              </Button>
            </DialogActions>
          </Paper>
        </motion.div>
      </Dialog>
    </Box>
  );
}

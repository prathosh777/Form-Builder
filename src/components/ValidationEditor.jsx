import React from "react";
import { motion } from "framer-motion";
import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Grid,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const ValidationEditor = ({ validations, onUpdate, fieldType }) => {
  const addValidation = () => {
    onUpdate([...validations, { type: "required", value: "", message: "" }]);
  };

  const updateValidation = (index, update) => {
    const newValidations = [...validations];
    newValidations[index] = { ...newValidations[index], ...update };
    onUpdate(newValidations);
  };

  const removeValidation = (index) => {
    const newValidations = validations.filter((_, i) => i !== index);
    onUpdate(newValidations);
  };

  const validationTypes = [
    { value: "required", label: "Required" },
    { value: "minLength", label: "Min Length", showInput: true },
    { value: "maxLength", label: "Max Length", showInput: true },
    { value: "email", label: "Email Format" },
  ];

  if (fieldType === "text") {
    validationTypes.push({ value: "password", label: "Password Rules" });
  }

  return (
    <Box>
      <Typography
        variant="subtitle1"
        className="font-semibold text-gray-200 mb-3"
      >
        Validation Rules
      </Typography>

      {validations.map((validation, index) => (
        <motion.div
          key={index}
          className="mb-3 p-4 rounded-xl border bg-gray-800/40 border-gray-700/50 hover:border-gray-600/70 hover:bg-gray-800/60 transition-all backdrop-blur-sm"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: "#d1d5db" }}>Type</InputLabel>
                <Select
                  value={validation.type}
                  onChange={(e) =>
                    updateValidation(index, { type: e.target.value })
                  }
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(156,163,175,0.5)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#a855f7",
                    },
                  }}
                >
                  {validationTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {["minLength", "maxLength"].includes(validation.type) && (
              <Grid item xs={3}>
                <TextField
                  type="number"
                  label="Value"
                  value={validation.value}
                  onChange={(e) =>
                    updateValidation(index, { value: e.target.value })
                  }
                  fullWidth
                  sx={{
                    input: { color: "white" },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(156,163,175,0.5)",
                      },
                      "&:hover fieldset": { borderColor: "#a855f7" },
                    },
                    "& .MuiInputLabel-root": { color: "#d1d5db" },
                  }}
                />
              </Grid>
            )}

            <Grid item xs={validation.type === "password" ? 12 : 4}>
              <TextField
                label="Error Message"
                value={validation.message}
                onChange={(e) =>
                  updateValidation(index, { message: e.target.value })
                }
                fullWidth
                placeholder="Default message"
                sx={{
                  input: { color: "white" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(156,163,175,0.5)" },
                    "&:hover fieldset": { borderColor: "#a855f7" },
                  },
                  "& .MuiInputLabel-root": { color: "#d1d5db" },
                }}
              />
            </Grid>

            <Grid item xs={1}>
              <IconButton
                onClick={() => removeValidation(index)}
                sx={{
                  color: "#ef4444",
                  "&:hover": { backgroundColor: "rgba(239,68,68,0.2)" },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </motion.div>
      ))}

      <Button
        variant="outlined"
        onClick={addValidation}
        startIcon={<AddIcon />}
        sx={{
          borderColor: "#a855f7",
          color: "#a855f7",
          "&:hover": {
            borderColor: "#d946ef",
            backgroundColor: "rgba(168,85,247,0.1)",
          },
        }}
      >
        Add Validation
      </Button>
    </Box>
  );
};

export default ValidationEditor;

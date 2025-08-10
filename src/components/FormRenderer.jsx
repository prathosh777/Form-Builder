import React from "react";
import { motion } from "framer-motion";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  FormHelperText,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const FormRenderer = ({ fields, values, errors, onChange, onBlur }) => {
  const handleFieldChange = (fieldId) => (event) => {
    let value;
    if (event.target.type === "checkbox") {
      value = event.target.checked;
    } else {
      value = event.target.value;
    }
    onChange(fieldId, value);
  };

  const handleDateChange = (fieldId) => (date) => {
    onChange(fieldId, date);
  };

  const fieldWrapper = (child, hasError) => (
    <motion.div
      className={`
        p-4 rounded-xl border transition-all duration-300 backdrop-blur-sm
        ${hasError
          ? "bg-red-600/10 border-red-500/50 shadow-lg shadow-red-500/20"
          : "bg-gray-800/40 border-gray-700/50 hover:border-gray-600/70 hover:bg-gray-800/60"
        }
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {child}
    </motion.div>
  );

  const renderField = (field) => {
    const fieldValue = values[field.id] || "";
    const error = errors[field.id];

    switch (field.type) {
      case "text":
      case "number":
        return fieldWrapper(
          <TextField
            fullWidth
            type={field.type}
            label={field.label}
            value={fieldValue}
            onChange={handleFieldChange(field.id)}
            onBlur={() => onBlur(field.id)}
            error={!!error}
            helperText={error}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(156,163,175,0.5)" },
                "&:hover fieldset": { borderColor: "#a855f7" },
                "&.Mui-focused fieldset": { borderColor: "#a855f7" },
              },
              "& .MuiInputLabel-root": { color: "#d1d5db" },
            }}
          />,
          !!error
        );

      case "textarea":
        return fieldWrapper(
          <TextField
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={fieldValue}
            onChange={handleFieldChange(field.id)}
            onBlur={() => onBlur(field.id)}
            error={!!error}
            helperText={error}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(156,163,175,0.5)" },
                "&:hover fieldset": { borderColor: "#a855f7" },
                "&.Mui-focused fieldset": { borderColor: "#a855f7" },
              },
              "& .MuiInputLabel-root": { color: "#d1d5db" },
            }}
          />,
          !!error
        );

      case "select":
        return fieldWrapper(
          <FormControl fullWidth error={!!error}>
            <InputLabel sx={{ color: "#d1d5db" }}>{field.label}</InputLabel>
            <Select
              value={fieldValue}
              onChange={handleFieldChange(field.id)}
              onBlur={() => onBlur(field.id)}
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(156,163,175,0.5)" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#a855f7" },
              }}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>,
          !!error
        );

      case "radio":
        return fieldWrapper(
          <FormControl error={!!error} fullWidth>
            <Typography variant="subtitle2" className="text-gray-300">
              {field.label}
            </Typography>
            <RadioGroup
              value={fieldValue}
              onChange={handleFieldChange(field.id)}
              onBlur={() => onBlur(field.id)}
            >
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio sx={{ color: "#a855f7" }} />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>,
          !!error
        );

      case "checkbox":
        return fieldWrapper(
          <FormControlLabel
            control={
              <Checkbox
                checked={!!fieldValue}
                onChange={handleFieldChange(field.id)}
                onBlur={() => onBlur(field.id)}
                sx={{ color: "#a855f7" }}
              />
            }
            label={field.label}
          />,
          !!error
        );

      case "date":
        return fieldWrapper(
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label={field.label}
              value={fieldValue || null}
              onChange={handleDateChange(field.id)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!error}
                  helperText={error}
                  onBlur={() => onBlur(field.id)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "rgba(156,163,175,0.5)" },
                      "&:hover fieldset": { borderColor: "#a855f7" },
                      "&.Mui-focused fieldset": { borderColor: "#a855f7" },
                    },
                    "& .MuiInputLabel-root": { color: "#d1d5db" },
                  }}
                />
              )}
            />
          </LocalizationProvider>,
          !!error
        );

      default:
        return null;
    }
  };

  return (
    <Grid container spacing={3}>
      {fields.map((field) => (
        <Grid item xs={12} key={field.id}>
          {renderField(field)}
        </Grid>
      ))}
    </Grid>
  );
};

export default FormRenderer;

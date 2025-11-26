import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
// import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export class DatePickerField extends React.Component {
  render(props) {
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disablePast={this.props.disablePast}
            id={this.props.id}
            name={this.props.id}
            label={this.props.label}
            value={this.props.value}
            onChange={this.props.onChange}
            format="YYYY-MM-DD"
            disabled={this.props.disabled}
            maxDate={this.props.maxDate}
            slotProps={{
              textField: {
                size: "small",
                // required: true,
                // Check for small view and apply fullWidth accordingly
                fullWidth: window.innerWidth < 400 ? true : false,
              },
            }}
            sx={{ maxWidth: 220 }}
          ></DatePicker>
        </LocalizationProvider>
      </>
    );
  }
}

export class DatePickerFieldUploadDocModel extends React.Component {
  render(props) {
    return (
      <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            disablePast={this.props.disablePast}
            id={this.props.id}
            name={this.props.id}
            label={this.props.label}
            value={this.props.value}
            onChange={this.props.onChange}
            format="YYYY-MM-DD"
            disabled={this.props.disabled}
            maxDate={this.props.maxDate}
            slotProps={{
              textField: {
                size: "small",
                // required: true,
                // Check for small view and apply fullWidth accordingly
                fullWidth: window.innerWidth < 200 ? true : false,
              },
            }}
            sx={{ maxWidth: 180 }}
          ></DatePicker>
        </LocalizationProvider>
      </>
    );
  }
}
export default class InputTextField extends React.Component {
  render(props) {
    return (
      <>
        <TextField
          // required
          label={this.props.label}
          onChange={this.props.onChange}
          disabled={this.props.disabled}
          id={this.props.id}
          name={this.props.id}
          type={this.props.type}
          value={this.props.value}
          size="small"
          sx={{ maxWidth: 250 }}
          inputProps={{
            // maxLength: 16,

            ...(this.props.inputProps || {}), // allow parent to override/extend
          }}
          error={this.props.error} // Add this line
          helperText={this.props.helperText}
        />
      </>
    );
  }
}

export function InputTextFieldNewUserMail({
  label,
  value,
  onChange,
  onBlur,
  name,
  id,
  type = "text",
  disabled,
  error,
  helperText,
  inputProps,
  ...rest
}) {
  return (
    <TextField
      label={label}
      name={name}
      id={id || name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      type={type}
      disabled={disabled}
      error={error}
      helperText={helperText}
      size="small"
      sx={{ maxWidth: 250 }}
      inputProps={{
        ...(inputProps || {}),
      }}
      {...rest}
    />
  );
}

export const InputTextFieldmd = React.forwardRef(
  ({ label, error, helperText, ...props }, ref) => {
    return (
      <TextField
        label={label}
        size="small"
        sx={{ width: "100%", maxWidth: 350 }}
        error={!!error}
        helperText={helperText}
        inputRef={ref} // Forward ref for react-hook-form
        {...props}
      />
    );
  }
);

export class InputTextField1 extends React.Component {
  render() {
    // Extract custom style and sx props if provided
    const { sx, style, ...rest } = this.props;
    return (
      <TextField
        {...rest}
        fullWidth
        // Merge passed sx with internal styles, ensuring full width is applied
        sx={{ width: "100%", borderRadius: 10, ...sx }}
        // Also forward any style prop if needed
        style={style}
      />
    );
  }
}

// export class InputDescriptionField extends React.Component {
//   render(props) {
//     return (
//       <>
//         <TextField
//           // required
//           fullWidth
//           label={this.props.label}
//           onChange={this.props.onChange}
//           id={this.props.id}
//           name={this.props.id}
//           type={this.props.type}
//           value={this.props.value}
//           size="large"
//           sx={{ maxWidth: 220 }}
//           multiline
//           rows={2}
//           error={this.props.error}               // Add this line
//           helperText={this.props.helperText}
//         />
//       </>
//     );
//   }
// }

export const InputDescriptionField = ({
  label,
  onChange,
  id,
  name,
  type,
  value,
  error,
  helperText,
  size = "small",
  multiline = true,
  rows = 2,
  fullWidth = true,
  sx = { maxWidth: 220 },
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      onChange={onChange}
      id={id || name}
      name={name || id}
      type={type}
      value={value}
      size={size}
      sx={sx}
      multiline={multiline}
      rows={rows}
      error={error}
      helperText={helperText}
    />
  );
};

// export default InputDescriptionField;

// export class InputPasswordField extends React.Component {
//   render(props) {
//     return (
//       <>
//         <TextField
//           // required
//           label={this.props.label}
//           onChange={this.props.onChange}
//           id={this.props.id}
//           name={this.props.id}
//           type={this.props.type}
//           value={this.props.value}
//           size="small"
//           sx={{ maxWidth: 220 }}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton
//                   edge="end"
//                   sx={{ color: "#5C5CFF " }}
//                   onClick={this.props.onClick}
//                   onMouseDown={this.props.onMouseDown}
//                 >
//                   {this.props.showPassword ? <VisibilityOff /> : <Visibility />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//       </>
//     );
//   }
// }

export class InputPasswordField extends React.Component {
  render() {
    return (
      <TextField
        label={this.props.label}
        onChange={this.props.onChange}
        id={this.props.id}
        name={this.props.id}
        type={this.props.type}
        value={this.props.value}
        size="small"
        sx={{ maxWidth: 240 }}
        inputProps={{
          maxLength: 16,

          ...(this.props.inputProps || {}), // allow parent to override/extend
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                sx={{ color: "#5C5CFF " }}
                onClick={this.props.onClick}
                onMouseDown={this.props.onMouseDown}
              >
                {this.props.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          ...(this.props.InputProps || {}), // allow parent overrides too
        }}
      />
    );
  }
}

export class InputPasswordFieldmd extends React.Component {
  render(props) {
    return (
      <>
        <TextField
          // required
          label={this.props.label}
          onChange={this.props.onChange}
          id={this.props.id}
          name={this.props.id}
          type={this.props.type}
          value={this.props.value}
          size="small"
          sx={{ width: "100%", maxWidth: 350 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  sx={{ color: "rgba(0, 90, 91, 0.9)" }}
                  onClick={this.props.onClick}
                  onMouseDown={this.props.onMouseDown}
                >
                  {this.props.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </>
    );
  }
}
// export class DatePickerField extends React.Component {
//   render(props) {
//     return (
//       <>
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <DatePicker
//             disablePast={this.props.disablePast}
//             id={this.props.id}
//             name={this.props.id}
//             label={this.props.label}
//             value={this.props.value}
//             onChange={this.props.onChange}
//             format="YYYY-MM-DD"
//             disabled={this.props.disabled}
//             maxDate={this.props.maxDate}
//             slotProps={{
//               textField: {
//                 size: "small",
//                 // required: true,
//                 // Check for small view and apply fullWidth accordingly
//                 fullWidth: window.innerWidth < 400 ? true : false,
//               },
//             }}
//             sx={{ maxWidth: 220 }}
//           ></DatePicker>
//         </LocalizationProvider>
//       </>
//     );
//   }
// }
export class InputSelectField extends React.Component {
  render(props) {
    return (
      <>
        <FormControl
          size="small"
          sx={{
            width: "100%",
            // minWidth:200,
            // maxWidth: 220,
          }}
          disabled={this.props.disabled}
        >
          <InputLabel>{this.props.label}</InputLabel>
          <Select
            id={this.props.id}
            name={this.props.id}
            label={this.props.label}
            onChange={this.props.onChange}
            value={this.props.value}
            // required
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 110,
                  overflowY: "auto",
                },
              },
            }}
            // sx={{ backgroundColor: "white" }}
          >
            {this.props.data.map((option) => (
              <MenuItem
                key={option.key}
                sx={{
                  textTransform: "uppercase",
                }}
                value={option.key}
              >
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  }
}
export class CheckboxInputs extends React.Component {
  render(props) {
    return (
      <>
        <FormControlLabel
          sx={{
            "& .MuiTypography-root": {
              fontSize: "16px",
            },
            width: "100%",
            maxWidth: 220,
          }}
          control={
            <Checkbox
              id={this.props.id}
              name={this.props.id}
              size="small"
              checked={this.props.checked}
              onChange={this.props.onChange}
              disabled={this.props.disabled}
            />
          }
          label={this.props.label}
        />
      </>
    );
  }
}
export class TableTextField extends React.Component {
  render(props) {
    return (
      <>
        <TextField
          id={this.props.id}
          name={this.props.id}
          value={this.props.value}
          type="number"
          onKeyUp={this.props.onKeyUp}
          onChange={this.props.onChange}
          disabled={this.props.disabled}
          InputProps={{
            style: {
              height: "30px",
              margin: 0,
              // minWidth: "60px",
              // maxWidth: "70px",
            },
          }}
          sx={{
            backgroundColor: "unset",
            "& .MuiInputBase-root": {
              padding: 0,
              margin: 0,
              WebkitAppearance: "none",
            },
            "& .MuiInputBase-input,": {
              px: 1,
              py: 0,
              textAlign: "end",
              backgroundColor: "unset",
              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
              },
              fontSize: "13px",
              fontWeight: "bold",
            },
          }}
        />
      </>
    );
  }
}

export class ListSearch extends React.Component {
  render() {
    return (
      <>
        <Grid
          item
          style={{
            padding: "10px",
            height: "auto",
            position: "sticky",
            top: "0",
            backgroundColor: "silver",
          }}
        >
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "auto",
              height: 35,
            }}
          >
            <InputBase
              className="col-md-1"
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search "
              onChange={this.props.onChange}
              value={this.props.value}
            />
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={this.props.onClickVoice}
            ></IconButton>
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              aria-label="search"
              onClick={this.props.onClick}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
      </>
    );
  }
}
class DepartmentDropdown extends React.Component {
  state = {
    departments: [],
    loading: false,
  };

  componentDidMount() {
    this.fetchDepartments();
  }

  async fetchDepartments() {
    this.setState({ loading: true });
    try {
      const response = await axios.get(this.props.apiUrl);
      this.setState({ departments: response.data || [], loading: false });
    } catch (error) {
      console.error("Error fetching departments:", error);
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Autocomplete
        options={this.state.departments}
        getOptionLabel={(option) => option.DeptNameEN || ""}
        loading={this.state.loading}
        filterOptions={(options, { inputValue }) =>
          options.filter((option) =>
            option.DeptNameEN.toLowerCase().includes(inputValue.toLowerCase())
          )
        }
        onChange={(event, newValue) =>
          this.props.onChange && this.props.onChange(newValue)
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={this.props.label}
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: this.state.loading
                ? "Loading..."
                : params.InputProps.endAdornment,
            }}
          />
        )}
        sx={{ width: this.props.width || 220 }}
      />
    );
  }
}

// ✅ Export DepartmentDropdown
export { DepartmentDropdown };

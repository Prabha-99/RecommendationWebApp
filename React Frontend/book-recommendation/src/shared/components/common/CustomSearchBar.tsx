import { Search, Clear } from "@mui/icons-material";
import { TextField, InputAdornment, IconButton } from "@mui/material";

interface CustomSearchBarProps {
  searchQuery: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  placeholder?: string;
  width?: string;
  mt?:number;
}

const CustomSearchBar = ({
  searchQuery,
  onChange,
  onClear,
  placeholder = "Search...",
  width = "500px",
  mt,
}: CustomSearchBarProps) => {
  return (
    <TextField
      value={searchQuery}
      placeholder={placeholder}
      sx={{
        mt,
        width,
        height: "56px",
        borderRadius: "12px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
        },
        bgcolor: "#FFFFFF",
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: searchQuery && (
          <InputAdornment position="end">
            <IconButton onClick={onClear}>
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
      onChange={onChange}
    />
  );
};

export default CustomSearchBar;

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

function AppDatePicker({handleChangeYear}) {
    {
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="pick a year"
          views={['year']}
          onChange={(newValue) => handleChangeYear(newValue)}
        />
      </LocalizationProvider>;
    }
  }
  export default AppDatePicker;
  
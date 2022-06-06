import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';

const DateTimePicker = ({ label, value, onDateChange }) => {
	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<DatePicker
				format='MM/dd/yyyy'
				label={label}
				value={value}
				onChange={onDateChange}
				renderInput={(params) => <TextField {...params} />}
			/>
		</LocalizationProvider>
	);
};
export default DateTimePicker;

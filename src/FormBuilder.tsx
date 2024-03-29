import React from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import Button from '@mui/material/Button';
import { FormValues } from './types';
import 'dayjs/locale/en';
import dayjs from 'dayjs';

interface FormBuilderProps {
  onSubmit: SubmitHandler<FormValues>;
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  dob: yup.date().required('Date of Birth is required').nullable(),
});

const FormBuilder: React.FC<FormBuilderProps> = ({ onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'all',
    resolver: yupResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="dob"
        control={control}
        defaultValue={null}
        render={({ field }) => (
          <LocalizationProvider dateAdapter={DateAdapter}>
            <DatePicker
              {...field}
              label="Date of Birth"
              error={!!errors.dob}
              helperText={errors.dob?.message}
              fullWidth
              renderInput={params => <TextField {...params} />}
              format="DD-MM-YYYY"
              minDate={dayjs().subtract(99, 'years')}
              maxDate={dayjs().add(99, 'years')}
            />
          </LocalizationProvider>
        )}
      />
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </form>
  );
};

export default FormBuilder;

function DateAdapter(options) {
  const adapter = new AdapterDayjs(options);

  const constructUpperObject = (text: string) => ({ toUpperCase: () => text });
  const constructDayObject = (day: string) => ({
    charAt: () => constructUpperObject(day),
  });

  return {
    ...adapter,
    getWeekdays() {
      const customWeekdays = adapter.getWeekdays();

      return customWeekdays.map(day => {
        return constructDayObject(day.substring(0, 2));
      });
    },
  };
}

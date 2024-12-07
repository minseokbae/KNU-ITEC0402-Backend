import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

import UniqueVisitorCard from '../../components/charts/UniqueVisitorCard';
import OrdersTable from '../../components/charts/OrdersTable';
import { MonthDummy } from 'api/dummy';

// sales report status
const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  const [value, setValue] = useState('today');
  const data = MonthDummy;
  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h5">월별 전력 사용량</Typography>
        </Grid>
        <Grid item>
          <TextField
            id="standard-select-currency"
            size="small"
            select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' } }}
          >
            {status.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* row 2 */}
        <Grid item xs={12} md={7} lg={12}>
          <UniqueVisitorCard data={data} />
        </Grid>

        {/* row 3 */}
        <Grid item xs={12} md={7} lg={12}>
          <Grid container alignItems="center" marginTop="35px">
            <Grid item>
              <Typography variant="h5">월별 전력 사용량/예측량 표</Typography>
            </Grid>
            <Grid item />
          </Grid>
          <MainCard sx={{ mt: 2 }} content={false}>
            <OrdersTable MonthData={data} />
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}

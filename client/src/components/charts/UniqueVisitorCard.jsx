// material-ui
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

// project import
import MainCard from 'components/MainCard';
import IncomeAreaChart from './IncomeAreaChart';

// ==============================|| DEFAULT - UNIQUE VISITOR ||============================== //

export default function UniqueVisitorCard({ data }) {
  return (
    <>
      <MainCard content={false} sx={{ mt: 1.5 }}>
        <Box sx={{ pt: 1, pr: 2 }}>
          <IncomeAreaChart data={data} />
        </Box>
      </MainCard>
    </>
  );
}

UniqueVisitorCard.propTypes = {
  data: PropTypes.shape({
    real: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        kWh: PropTypes.number.isRequired
      })
    ).isRequired,
    predict: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.string.isRequired,
        kWh: PropTypes.number.isRequired
      })
    ).isRequired
  }).isRequired
};

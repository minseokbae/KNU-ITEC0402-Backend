// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
// project import
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { DayDummy, DayDummy2 } from 'api/dummy';
import ReportAreaChart from 'components/charts/ReportAreaChart';
import MainCard from 'components/MainCard';
import { Button } from '@mui/material';
import Loader from 'components/Loader';
import UniqueVisitorCard from 'components/charts/UniqueVisitorCard';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const [data, setData] = useState(DayDummy);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickUpdate = () => {
    setData(DayDummy2);
    setIsLoading(true);
    setTimeout(function () {
      setIsLoading(false);
    }, 4000);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
          {/* row 1 */}
          <Grid item display="flex" justifyContent="space-between">
            <Typography variant="h5">일사용량 예측 ML</Typography>
            <Button
              onClick={handleClickUpdate}
              style={{ float: 'right', position: 'absolute', right: '30px', backgroundColor: 'white', border: `1px solid #40a9ff` }}
            >
              갱신
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ mb: -2.25 }}></Grid>
          <Grid item xs={12} sm={6} md={4} lg={6}>
            <AnalyticEcommerce title={`${data.time}까지 실에너지 사용량`} count={`${data.fromnow}kw`} />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={6}>
            <AnalyticEcommerce title="자정까지 예측량 포함" count={`${data.fromafter}kw`} />
          </Grid>

          <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

          {/* row 2 */}
          <Grid item xs={12} md={7} lg={12}>
            <Grid container alignItems="center">
              <Grid item>
                <Typography variant="h5">일 평균 사용량</Typography>
              </Grid>
            </Grid>
            <MainCard>
              <UniqueVisitorCard data={data} />
            </MainCard>
          </Grid>
        </Grid>
      )}
    </>
  );
}

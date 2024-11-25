// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { DayDummy } from 'api/dummy';
import ReportAreaChart from 'components/charts/ReportAreaChart';
import MainCard from 'components/MainCard';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const data = DayDummy;
  // graphData 생성 함수
  const createGraphData = (data) => {
    const realData = data.real.map((entry) => entry.kWh); // real의 kWh 값만 추출
    const predictData = data.predict.map((entry) => entry.kWh); // predict의 kWh 값만 추출

    return {
      real: realData,
      predict: predictData
    };
  };

  // DayDummy 데이터를 사용하여 graphData 생성
  const graphData = createGraphData(data);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">일사용량 예측 ML</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4} lg={6}>
        <AnalyticEcommerce title="현 시점까지 실에너지 사용량" count={`${data.fromnow}kw`} />
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
          <ReportAreaChart />
        </MainCard>
      </Grid>
    </Grid>
  );
}

import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

// 기본 차트 옵션
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

export default function IncomeAreaChart({ data }) {
  const theme = useTheme();

  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);

  useEffect(() => {
    const timestamps = data.real.map((entry) => entry.timestamp); // x축 데이터: real의 timestamp 추출

    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: timestamps, // x축에 timestamp 설정
        labels: {
          style: {
            colors: Array(timestamps.length).fill(secondary) // x축 레이블 색상
          }
        },
        axisBorder: {
          show: true,
          color: line
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      }
    }));
  }, [theme, data]);

  const [series, setSeries] = useState([]);

  useEffect(() => {
    // 실제 데이터와 예측 데이터 설정
    setSeries([
      {
        name: '실제 전력량',
        data: data.real.map((entry) => entry.kWh)
      },
      {
        name: '예측 전력량',
        data: data.predict.map((entry) => entry.kWh)
      }
    ]);
  }, [data]);

  return <ReactApexChart options={options} series={series} type="area" height={450} />;
}

IncomeAreaChart.propTypes = {
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

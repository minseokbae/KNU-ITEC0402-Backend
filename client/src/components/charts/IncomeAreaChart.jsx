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

// 타임스탬프 병합 함수
function mergeTimestamps(real, predict) {
  const allTimestamps = new Set([...real.map((entry) => entry.timestamp), ...predict.map((entry) => entry.timestamp)]);
  return Array.from(allTimestamps).sort();
}

// 소수점 두 번째 자리에서 값 자르기 함수
function truncateToTwoDecimalPlaces(value) {
  return value !== null ? parseFloat(value.toFixed(2)) : null;
}

export default function IncomeAreaChart({ data }) {
  const theme = useTheme();
  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const allTimestamps = mergeTimestamps(data.real, data.predict);

    // 데이터 매핑 및 소수점 처리
    const realData = allTimestamps.map((timestamp) =>
      truncateToTwoDecimalPlaces(data.real.find((entry) => entry.timestamp === timestamp)?.kWh || null)
    );
    const predictData = allTimestamps.map((timestamp) =>
      truncateToTwoDecimalPlaces(data.predict.find((entry) => entry.timestamp === timestamp)?.kWh || null)
    );

    // 차트 옵션 업데이트
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories: allTimestamps, // x축에 병합된 타임스탬프 설정
        labels: {
          style: {
            colors: Array(allTimestamps.length).fill(secondary) // x축 레이블 색상
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

    // 시리즈 데이터 업데이트
    setSeries([
      {
        name: '실제 전력량',
        data: realData
      },
      {
        name: '예측 전력량',
        data: predictData
      }
    ]);
  }, [theme, data]);

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

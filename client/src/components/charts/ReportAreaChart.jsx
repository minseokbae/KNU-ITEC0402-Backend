import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';

// 기본 차트 옵션
const areaChartOptions = {
  chart: {
    height: 340,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 1.5
  },
  grid: {
    strokeDashArray: 4
  },
  xaxis: {
    type: 'datetime',
    categories: [],
    labels: {
      format: 'MMM dd HH:mm'
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: true,
    labels: {
      formatter: (value) => value.toFixed(2)
    }
  },
  tooltip: {
    x: {
      format: 'MMM dd HH:mm'
    }
  }
};

// ==============================|| REPORT AREA CHART ||============================== //

export default function ReportAreaChart({ data }) {
  const theme = useTheme();
  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);

  useEffect(() => {
    // x축 데이터 추출 (real 데이터 기준)
    const timestamps = data.real.map((entry) => entry.timestamp);

    // 옵션 업데이트
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.warning.main, theme.palette.success.main],
      xaxis: {
        categories: timestamps,
        labels: {
          style: {
            colors: timestamps.map(() => secondary)
          }
        }
      },
      grid: {
        borderColor: line
      },
      legend: {
        labels: {
          colors: 'grey.500'
        }
      }
    }));

    setSeries([
      {
        name: '실제 데이터',
        data: data.real.map((entry) => parseFloat(entry.kWh.toFixed(2))) // 소수점 두 자리
      },
      {
        name: '예측 데이터',
        data: data.predict.map((entry) => parseFloat(entry.kWh.toFixed(2)))
      }
    ]);
  }, [data, theme, secondary, line]);

  return <ReactApexChart options={options} series={series} type="line" height={340} />;
}

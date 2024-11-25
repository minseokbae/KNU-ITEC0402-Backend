import PropTypes from 'prop-types';
// material-ui
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import Dot from 'components/@extended/Dot';

function createData(time, real, predict) {
  return { time, real, predict };
}

// const rows = [
//   createData(84564564, 2, 40570),
//   createData(98764564, 0, 180139),
//   createData(98756325, 1, 90989),
//   createData(98652366, 1, 10239),
//   createData(13286564, 1, 83348),
//   createData(86739658, 0, 410780),
//   createData(13256498, 2, 70999),
//   createData(98753263, 2, 10570),
//   createData(98753275, 1, 98063),
//   createData(98753291, 0, 14001)
// ];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'time',
    align: 'center',
    disablePadding: false,
    label: '시간'
  },
  {
    id: 'real',
    align: 'center',
    disablePadding: true,
    label: '실제 전력량'
  },
  {
    id: 'predict',
    align: 'center',
    disablePadding: false,
    label: '예측 전력량'
  }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy }) {
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function OrderStatus({ status }) {
  let color;
  let title;

  switch (status) {
    case 0:
      color = 'warning';
      title = 'Pending';
      break;
    case 1:
      color = 'success';
      title = 'Approved';
      break;
    case 2:
      color = 'error';
      title = 'Rejected';
      break;
    default:
      color = 'primary';
      title = 'None';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

// ==============================|| ORDER TABLE ||============================== //

export default function OrderTable({ MonthData }) {
  const order = 'asc';
  const orderBy = 'tracking_no';

  const rows = MonthData.real.map((realEntry) => {
    const correspondingPredict = MonthData.predict.find((predictEntry) => predictEntry.timestamp === realEntry.timestamp);

    return createData(
      realEntry.timestamp,
      realEntry.kWh,
      correspondingPredict ? correspondingPredict.kWh : null // predict 값이 없을 경우 null로 처리
    );
  });

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' }
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead order={order} orderBy={orderBy} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow hover role="checkbox" sx={{ '&:last-child td, &:last-child th': { border: 0 } }} tabIndex={-1} key={row.time}>
                  <TableCell align="center" component="th" id={labelId} scope="row">
                    {row.time}
                  </TableCell>
                  <TableCell align="center">{row.real}</TableCell>
                  <TableCell align="center">{row.predict}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

OrderTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

OrderStatus.propTypes = { status: PropTypes.number };

OrderTable.propTypes = {
  MonthData: PropTypes.shape({
    real: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.string.isRequired, // timestamp는 문자열
        kWh: PropTypes.number.isRequired // kWh는 숫자
      })
    ).isRequired, // real 배열은 필수
    predict: PropTypes.arrayOf(
      PropTypes.shape({
        timestamp: PropTypes.string.isRequired, // timestamp는 문자열
        kWh: PropTypes.number.isRequired // kWh는 숫자
      })
    ).isRequired // predict 배열은 필수
  }).isRequired // MonthData 객체는 필수
};

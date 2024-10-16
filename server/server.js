const express = require('express'); // Express 모듈
const admin = require('firebase-admin'); // Firebase Admin SDK를
const bodyParser = require('body-parser'); // HTTP 요청 본문을 파싱하기 위한 미들웨어
const cors = require('cors'); // CORS(Cross-Origin Resource Sharing)를 허용하기 위한 미들웨어
// const serviceAccount = require('./membership-3bc56-0f7adc65953a.json'); // Firebase 서비스 계정 키 파일
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs'); // fs 모듈 추가
const { InfluxDB, Point } = require('@influxdata/influxdb-client'); // InfluxDB 클라이언트
const { BucketsAPI } = require('@influxdata/influxdb-client-apis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const database = require('./config/db');


// // 원본 InfluxDB 설정
// const url = 'http://ts.nexa-ds.com';  // 원본 InfluxDB 서버 URL
// const token = 'dSW6mKOhbAYHXg0-ys6W0hCEUDJEgrZy950bFG2Cqam1we-oXUzDpjE00XOEp73PKFO7BLoxe7RDMGYOZY-I0g=='; // 원본 InfluxDB 토큰(환경변수 사용 예정)
// const org = 'nexads';           // 원본 조직 이름
// const bucket = 'TestKsy';       // 원본 버킷 이름

// // 타겟 InfluxDB 설정 (데이터 복사할 InfluxDB)
// const targetUrl = 'https://us-east-1-1.aws.cloud2.influxdata.com';  // 타겟 InfluxDB 서버 URL
// const targetToken = 'qHMH4KoR83b4nVuILRwduS_hghnnKTqwPitcUxxici8rH5BGFhFVyi1QQWnLYC6v1MZ3LK6NwQ417gVrEGvbPw==';     // 타겟 InfluxDB 토큰(환경변수 사용 예정)
// const targetOrg = 'f928648a252d7ba5';
// const targetBucket = 'Test';              // 타겟 버킷 이름

// // InfluxDB 클라이언트 생성 (원본)
// const client = new InfluxDB({ url, token });
// const queryApi = client.getQueryApi(org);

// // InfluxDB 클라이언트 생성 (타겟)
// const writeClient = new InfluxDB({ url: targetUrl, token: targetToken });
// const writeApi = writeClient.getWriteApi(targetOrg, targetBucket);
// // BucketsAPI 사용을 위한 API 인스턴스 생성
// const bucketsAPI = new BucketsAPI(writeClient);

// let data = [];

// 데이터를 읽어오는 함수
// const fetchData = async () => {
//   const fluxQuery = `
//     from(bucket: "${bucket}")
//     |> range(start: -1m)  // 최근 1분간의 데이터
//     |> filter(fn: (r) => r._measurement == "Test1")
//     |> filter(fn: (r) => r._field == "Current")
//   `;

//   try {
//     await new Promise((resolve, reject) => {
//       queryApi.queryRows(fluxQuery, {
//         next(row, tableMeta) {
//           const o = tableMeta.toObject(row);
//           data.push({
//             time: o._time,
//             value: o._value
//           });
//         },
//         error(error) {
//           console.error('Error querying data:', error);
//           reject(error);
//         },
//         complete() {
//           resolve();
//           console.log('InfluxDB Query 완료');
//         }
//       });
//     });

//     // 데이터를 JSON 파일로 저장
//     fs.writeFileSync('influxdb_data.json', JSON.stringify(data, null, 2)); // JSON pretty-print
//     console.log('데이터가 JSON 파일로 저장되었습니다: influxdb_data.json');
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

// // 데이터를 타겟 InfluxDB로 쓰는 함수
// const writeDataToInfluxDB = async (data) => {
//   data.forEach(point => {
//     const influxPoint = new Point('Test1')  // 동일한 measurement 사용
//       .floatField('Current', point.value)  // 필드 값 설정
//       .timestamp(new Date(point.time));    // 시간 설정
//     writeApi.writePoint(influxPoint);      // InfluxDB에 기록
//   });

//   try {
//     await writeApi.flush(); // 기록된 데이터 전송
//     console.log('데이터가 새로운 InfluxDB로 성공적으로 기록되었습니다.');
//   } catch (error) {
//     console.error('InfluxDB로 데이터 기록 중 오류 발생:', error);
//   }
// };

// // 데이터를 읽고 복사하는 전체 흐름
// const runDataTransfer = async () => {
//   await fetchData();           // 원본에서 데이터 읽기
//   await writeDataToInfluxDB(data); // 읽은 데이터를 타겟 DB로 복사
// };

// runDataTransfer();



dotenv.config();
const app = express(); // Express 애플리케이션 인스턴스를 생성
const port = 5326; // 서버가 청취할 포트를 설정
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

app.use(bodyParser.json()); // 모든 요청 본문을 JSON 형식으로 파싱하도록 설정
app.use(cors()); // 모든 도메인에서의 요청을 허용(CORS)하도록 설정
app.use(express.json());
app.use('/auth', authRoutes);   // 회원가입 및 로그인 라우트
app.use('/user', profileRoutes);  // 보호된 프로필 라우트


// 기본 라우트 정의
app.get('/', (req, res) => {
  res.send('Hello World!'); // 기본 라우트로 접속 시 'Hello World!' 메시지를 반환합니다.
});

// 서버 실행
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});

const express = require('express'); // Express 모듈
const admin = require('firebase-admin'); // Firebase Admin SDK를
const bodyParser = require('body-parser'); // HTTP 요청 본문을 파싱하기 위한 미들웨어
const cors = require('cors'); // CORS(Cross-Origin Resource Sharing)를 허용하기 위한 미들웨어
const serviceAccount = require('./membership-3bc56-0f7adc65953a.json'); // Firebase 서비스 계정 키 파일
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs'); // fs 모듈 추가
const { InfluxDB, Point } = require('@influxdata/influxdb-client'); // InfluxDB 클라이언트
const { BucketsAPI } = require('@influxdata/influxdb-client-apis');

// 원본 InfluxDB 설정
const url = 'http://ts.nexa-ds.com';  // 원본 InfluxDB 서버 URL
const token = 'dSW6mKOhbAYHXg0-ys6W0hCEUDJEgrZy950bFG2Cqam1we-oXUzDpjE00XOEp73PKFO7BLoxe7RDMGYOZY-I0g=='; // 원본 InfluxDB 토큰
const org = 'nexads';           // 원본 조직 이름
const bucket = 'TestKsy';       // 원본 버킷 이름

// 타겟 InfluxDB 설정 (데이터 복사할 InfluxDB)
const targetUrl = 'https://us-east-1-1.aws.cloud2.influxdata.com';  // 타겟 InfluxDB 서버 URL
const targetToken = 'qHMH4KoR83b4nVuILRwduS_hghnnKTqwPitcUxxici8rH5BGFhFVyi1QQWnLYC6v1MZ3LK6NwQ417gVrEGvbPw==';     // 타겟 InfluxDB 토큰
const targetOrg = 'f928648a252d7ba5';
const targetBucket = 'Test';              // 타겟 버킷 이름

// InfluxDB 클라이언트 생성 (원본)
const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

// InfluxDB 클라이언트 생성 (타겟)
const writeClient = new InfluxDB({ url: targetUrl, token: targetToken });
const writeApi = writeClient.getWriteApi(targetOrg, targetBucket);
// BucketsAPI 사용을 위한 API 인스턴스 생성
const bucketsAPI = new BucketsAPI(writeClient);

let data = [];

// 데이터를 읽어오는 함수
const fetchData = async () => {
  const fluxQuery = `
    from(bucket: "${bucket}")
    |> range(start: -1m)  // 최근 1분간의 데이터
    |> filter(fn: (r) => r._measurement == "Test1")
    |> filter(fn: (r) => r._field == "Current")
  `;

  try {
    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          data.push({
            time: o._time,
            value: o._value
          });
        },
        error(error) {
          console.error('Error querying data:', error);
          reject(error);
        },
        complete() {
          resolve();
          console.log('InfluxDB Query 완료');
        }
      });
    });

    // 데이터를 JSON 파일로 저장
    fs.writeFileSync('influxdb_data.json', JSON.stringify(data, null, 2)); // JSON pretty-print
    console.log('데이터가 JSON 파일로 저장되었습니다: influxdb_data.json');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// 데이터를 타겟 InfluxDB로 쓰는 함수
const writeDataToInfluxDB = async (data) => {
  data.forEach(point => {
    const influxPoint = new Point('Test1')  // 동일한 measurement 사용
      .floatField('Current', point.value)  // 필드 값 설정
      .timestamp(new Date(point.time));    // 시간 설정
    writeApi.writePoint(influxPoint);      // InfluxDB에 기록
  });

  try {
    await writeApi.flush(); // 기록된 데이터 전송
    console.log('데이터가 새로운 InfluxDB로 성공적으로 기록되었습니다.');
  } catch (error) {
    console.error('InfluxDB로 데이터 기록 중 오류 발생:', error);
  }
};

// 데이터를 읽고 복사하는 전체 흐름
const runDataTransfer = async () => {
  await fetchData();           // 원본에서 데이터 읽기
  await writeDataToInfluxDB(data); // 읽은 데이터를 타겟 DB로 복사
};

runDataTransfer();

// Firebase Admin SDK 초기화
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // 서비스 계정을 이용해 Firebase 인증 초기화
});

dotenv.config();
const db = admin.firestore(); // Firestore 데이터베이스 초기화
const app = express(); // Express 애플리케이션 인스턴스를 생성
const port = 8000; // 서버가 청취할 포트를 설정

app.use(bodyParser.json()); // 모든 요청 본문을 JSON 형식으로 파싱하도록 설정
app.use(cors()); // 모든 도메인에서의 요청을 허용(CORS)하도록 설정

// 사용자 UID를 기반으로 InfluxDB 버킷 생성하는 함수
const createUserBucket = async (uid) => {
  try {
    const bucketName = `user_${uid}`;  // UID를 기반으로 고유 버킷 이름 생성
    const retentionRules = [{
      type: 'expire',
      everySeconds: 3600 * 24 * 30,  // 30일 동안 데이터 보관
    }];

    // InfluxDB 버킷 생성
    const bucket = await bucketsAPI.postBuckets({
      body: {
        orgID: targetOrg,  // 조직 ID 설정
        name: bucketName,  // 버킷 이름을 UID로 설정
        retentionRules: retentionRules,  // 데이터 보관 정책
      },
    });

    console.log(`사용자 ${uid}의 InfluxDB 버킷이 생성되었습니다: ${bucketName}`);
    return bucketName; // 생성된 버킷 이름 반환
  } catch (error) {
    console.error('InfluxDB 버킷 생성 중 오류 발생:', error);
    throw error;
  }
};

// 회원가입 라우트 정의
app.post('/signup', async (req, res) => {
  const { email, password } = req.body; // 요청 본문에서 이메일과 비밀번호를 추출

  try {
    // Firebase Authentication을 사용하여 새 사용자를 생성
    const userRecord = await admin.auth().createUser({ email, password });

    // Firestore에 사용자 데이터 저장
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Firebase UID를 기반으로 InfluxDB 버킷 생성
    const bucketName = await createUserBucket(userRecord.uid);

    // 사용자 생성이 성공하면, 생성된 사용자의 UID를 클라이언트에 반환
    res.status(201).send({ uid: userRecord.uid, bucketName });
    
  } catch (error) {
    // 사용자 생성 중 오류가 발생하면, 오류 메시지를 클라이언트에 반환
    console.error('Error creating new user:', error);
    res.status(400).send({ error: error.message });
  }
});



// 특정 사용자의 정보를 가져오는 라우트 정의
app.get('/user/:uid', async (req, res) => {
  const uid = req.params.uid; // URL 경로에서 사용자 UID를 추출

  try {
    // Firebase Authentication에서 UID에 해당하는 사용자 정보
    const userRecord = await admin.auth().getUser(uid);
    // 사용자 정보를 클라이언트에 반환
    res.send(userRecord);
  } catch (error) {
    // 사용자 정보를 가져오는 중 오류가 발생하면, 오류 메시지를 클라이언트에 반환
    console.error('Error fetching user data:', error);
    res.status(404).send({ error: error.message });
  }
});

// 기본 라우트 정의
app.get('/', (req, res) => {
  res.send('Hello World!'); // 기본 라우트로 접속 시 'Hello World!' 메시지를 반환합니다.
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`); // 서버가 지정된 포트에서 실행 중임을 콘솔에 출력합니다.
});

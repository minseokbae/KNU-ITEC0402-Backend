const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',  // RDP 서버의 IP 주소 (또는 도메인)
    user: 'root',           // MySQL 사용자 이름
    password: '1234',       // MySQL 비밀번호
    database: 'user_management', // MySQL 데이터베이스 이름
    waitForConnections: true,
    port: 5327, 
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();

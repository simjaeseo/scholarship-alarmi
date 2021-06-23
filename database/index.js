const db = require("mysql2/promise");
const { DB_HOST, DB_USER, DB_PASSWORD } = require("../config/index");

const pool = db.createPool({
    host: "jaeseo2.c9gplmo8pgi2.ap-northeast-2.rds.amazonaws.com",
    user: "admin",
    password: "xmdlsk12",
    database: "scholarship",
    waitForConnections: true,
    connectionLimit: 5,
});

// //테이블 만들기
// (async () => {
//     try {
//         const conn = await pool.getConnection();
//         await conn.execute(` CREATE TABLE bookmark(
//         id int(11) NOT NULL AUTO_INCREMENT,
//         userId int(11) NOT NULL,
//         major varchar(100) NOT NULL,
//         title varchar(100) NOT NULL,
//         period varchar(100) NOT NULL,
//         link varchar(200) NOT NULL,
//         writeTime varchar(100) NOT NULL,
//         created_at timestamp NOT NULL DEFAULT current_timestamp(),
//         updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
//         PRIMARY KEY (id),
//         FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
//     ) DEFAULT CHARSET=utf8
//   `);
//         console.log("end");
//     } catch (e) {
//         console.error(e);
//     }
// })();

module.exports = {
    getConn: () => pool.getConnection(),
};

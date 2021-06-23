const { getConn } = require("../database/index");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const router = require("express").Router();

router.post("/registers", async (req, res) => {
    const { name, studentNum, major } = req.body;

    if (name == null || studentNum == null || major == null) res.status(400).json({ success: false, message: "사용자 정보 등록 실패" });
    else if (studentNum.length != 9) res.status(400).json({ success: false, message: "사용자 정보 등록 실패(학번 잘못 입력)" });
    let conn;
    let result;
    try {
        conn = await getConn();
        const [[user]] = await conn.query("SELECT * FROM users WHERE studentNum = ?", [studentNum]);
        if (user) result = { success: false, message: "이미 가입함" };
        else {
            await conn.execute("INSERT INTO users (name, studentNum, major) VALUES (?,?,?)", [name, studentNum, major]);
        }
        // 바로 로그인
        const [[loginUser]] = await conn.query("SELECT * FROM users WHERE studentNum = ?", [studentNum]);
        if (!loginUser) result = { success: false, message: "없는 학번입니다." };
        else {
            const token = jwt.sign({ id: loginUser.id }, JWT_SECRET, { expiresIn: "365d" });
            console.log(loginUser);
            result = { success: true, message: "가입 완료 및 로그인", token };
        }
    } catch (e) {
        console.error(e);
        next(e);
    } finally {
        if (conn) conn.release();

        if (!result.success) res.status(409).json(result);
        res.status(201).json(result);
    }
});

module.exports = router;

const router = require("express").Router();

router.post("/search", (req, res) => {
    // 사용자가 검색한 글자 변수로 받아오기
    const { searchVoca } = req.body;

    let conn;
    let scholarship =[];

    conn = await getConn();
    const [inuScholarship] = await conn.query("SELECT * FROM inuCrawling");
    const [majorScholarship] = await conn.query("SELECT * FROM majorCrawiling");

    if (conn) conn.release();

    scholarship.push(inuScholarship);
    scholarship.push(majorScholarship);

    let searchScholarship = [];

    scholarship.forEach(function (el) {
        if (el.title.includes(searchVoca) == true) searchScholarship.push(el);
    });

    res.status(201).json(searchScholarship);
});

module.exports = router;

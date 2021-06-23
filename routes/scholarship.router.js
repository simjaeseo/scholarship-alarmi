const { isAuth } = require("../middleware/auth.middleware");
const router = require("express").Router();
router.use(isAuth);

router.get("/scholarship", (req, res) => {
    let conn;
    let scholarship =[];

    conn = await getConn();
    const [inuScholarship] = await conn.query("SELECT * FROM inuCrawling");
    const [majorScholarship] = await conn.query("SELECT * FROM majorCrawiling");

    if (conn) conn.release();

    scholarship.push(inuScholarship);
    scholarship.push(majorScholarship);

    res.status(200).json(scholarship);

});

router.get("/scholarship/inschool", (req, res) => {
    let conn;
    let scholarship =[];
    let inschool = [];
        conn = await getConn();
        const [inuScholarship] = await conn.query("SELECT * FROM inuCrawling");
        const [majorScholarship] = await conn.query("SELECT * FROM majorCrawiling");
        if (conn) conn.release();

        scholarship.push(inuScholarship);
        scholarship.push(majorScholarship);

        scholarship.forEach(function (el) {
            if (el.title.includes("교내장학") == true) inschool.push(el);
        });

        res.status(200).json(inschool);

});

router.get("/scholarship/outschool", (req, res) => {
    let conn;

    let scholarship =[];
    let outschool = [];


        conn = await getConn();
        const [inuScholarship] = await conn.query("SELECT * FROM inuCrawling");
        const [majorScholarship] = await conn.query("SELECT * FROM majorCrawiling");


        if (conn) conn.release();

        scholarship.push(inuScholarship);
        scholarship.push(majorScholarship);

        scholarship.forEach(function (el) {
            if (el.title.includes("교외") == true) inschool.push(el);
        });

        res.status(200).json(outschool);
});

router.get("/scholarship/bongsa", (req, res) => {
    let bongsa = [];
    let conn;

    let scholarship =[];


        conn = await getConn();
        const [inuScholarship] = await conn.query("SELECT * FROM inuCrawling");
        const [majorScholarship] = await conn.query("SELECT * FROM majorCrawiling");


        if (conn) conn.release();

        scholarship.push(inuScholarship);
        scholarship.push(majorScholarship);

        scholarship.forEach(function (el) {
            if (el.title.includes("봉사") == true) inschool.push(el);
        });

        res.status(200).json(bongsa);
});

router.get("/scholarship/nationLoan", (req, res) => {
 
    let nationLoan = [];

    let conn;

    let scholarship =[];


        conn = await getConn();
        const [inuScholarship] = await conn.query("SELECT * FROM inuCrawling");
        const [majorScholarship] = await conn.query("SELECT * FROM majorCrawiling");


        if (conn) conn.release();

        scholarship.push(inuScholarship);
        scholarship.push(majorScholarship);

        scholarship.forEach(function (el) {
            if (el.title.includes("국가") == true || el.title.includes("대출") == true) nationLoan.push(el);

        });

        res.status(200).json(nationLoan);
    
});

module.exports = router;

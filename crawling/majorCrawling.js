const puppeteer = require("puppeteer");
const { inu_dataList, users, majorList } = require("../util2");
const { getConn } = require("../database/index");

module.exports = (async function majorCrawling() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let conn;
    conn = await getConn();

    for await (let { major, link } of majorList) {
        await page.goto(link);

        let trList = await page.$$eval("tbody > tr", (firms) =>
            firms.map((firm) => {
                let a = firm.querySelector("td > a");
                return {
                    link: a.href,
                    title: a.innerText,
                };
            })
        );
        let i = 1;

        // 글 하나씩 클릭
        for await (const { link, title } of trList) {
            if (!title.includes("장학")) continue;

            await page.goto(link);

            let userMajor = major;

            // 현재 글 작성 날짜
            let writeTime = await page.$eval("#board-container > div.viewTop > div.id > dl > dd:nth-child(2)", (el) => {
                return el.innerText;
            });

            // 본문 내용 크롤링
            let content = await page.$eval("#board-container > div.view > dl > dd.contents", (el) => {
                return el.innerText;
            });

            // 정규표현식
            let period1 = /신청 ?기간 ?:(.+)/g;
            let period2 = /모집 ?기간 ?:(.+)/g;
            let period3 = /접수 ?기간 ?:(.+)/g;
            let period;
            let strperiod;
            let parseperiod = /\D(\d{1,2}[월.]\s*\d{1,2}[일.]?)|(\D\d{1,2}[일.])|\D(\d{1,2}[/]\s*\d{1,2})/g;

            if (content.match(period1) != null) {
                console.log(content.match(period1));
                period = content.match(period1);
                strperiod = period.toString();
                period = strperiod.match(parseperiod);
                console.log(period);
            } else if (content.match(period2) != null) {
                console.log(content.match(period2));
                period = content.match(period2);
                strperiod = period.toString();
                period = strperiod.match(parseperiod);
                console.log(period);
            } else if (content.match(period3) != null) {
                console.log(content.match(period3));

                period = content.match(period3);

                strperiod = period.toString();
                // 파싱된 신청 기간 값을 period에 저장
                period = strperiod.match(parseperiod);
                strperiod = period.toString();
                console.log(period);
            } else {
                period = "신청 기간을 확인할 수 없습니다.";
            }

            if (!period == "신청 기간을 확인할 수 없습니다.") {
                periodreplace = test.replace(/./gi, "나");
            }

            // 장학금 정보 db에 저장
            try {
                await conn.execute("INSERT INTO majorCrawiling (major, title, period, link, writeTime) VALUES (?,?,?,?,?)", [
                    userMajor,
                    title,
                    period,
                    link,
                    writeTime,
                ]);
            } catch (e) {
                console.error(e);
            }
            await page.goBack();
            console.log(`과 : ${major}, 장학금 글 수 : ${i}`);
            i++;
        }
        if (conn) conn.release();
    }
    console.log("전체 과 사이트 장학금 공지사항 DB에 업데이트 완료");
})();

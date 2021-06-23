const puppeteer = require("puppeteer");
const { getConn } = require("../database/index");

module.exports = async function inuCrawling() {
    const browser = await puppeteer.launch({
        ignoreDefaultArgs: ["--disable-extensions"],
    });
    const page = await browser.newPage();

    let conn;
    conn = await getConn();
    let i = 1;
    let a, b, c, d;

    let numbers = [1, 2, 3];
    for await (let num of numbers) {
        await page.goto(`https://www.inu.ac.kr/user/boardList.do?boardId=49227&page=${num}&siteId=inu&id=inu_070204000000&column=&search=`);

        let trList = await page.$$eval("tbody > tr", (firms) =>
            firms.map((firm) => {
                let a = firm.querySelector("td.textAL > a");
                let b = firm.querySelector("td.no");
                return {
                    link: a.href,
                    noticeNum: b.children.length,
                };
            })
        );

        // 글 하나씩 클릭
        for await (const { link, noticeNum } of trList) {
            await page.goto(link);
            if (noticeNum) continue;
            let major = "inu";

            // 현재 글 제목 크롤링
            let title = await page.$eval("#board-container > div.tbList.tbView > table > tbody > tr:nth-child(2) > td", (el) => {
                return el.innerText;
            });

            // 작성 날짜
            let writeTime = await page.$eval(
                "#board-container > div.tbList.tbView > table > tbody > tr:nth-child(3) > td:nth-child(4)",
                (el) => {
                    return el.innerText;
                }
            );

            // 본문 내용 크롤링
            let content = await page.$eval("div.bdViewCont.cf", (el) => {
                return el.innerText;
            });

            // 정규표현식
            let period1 = /신청 ?기간 ?:(.+)/g;
            let period2 = /모집 ?기간 ?:(.+)/g;
            let period3 = /접수 ?기간 ?:(.+)/g;
            let period;
            let strperiod;
            let replacePeriod = [];
            let parseperiod = /\D(\d{1,2}[월.]\s*\d{1,2}[일.]?)|(\D\d{1,2}[일.])/g;

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
                console.log(period);
            } else {
                period = "신청 기간을 확인할 수 없습니다.";
            }

            if (period != "신청 기간을 확인할 수 없습니다.") {
                period.forEach((el2) => {
                    a = el2.replace(/[\.월일년~]/gi, "/");
                    b = a.replace(/[\s]/gi, "");
                    c = b.replace(/^\/|\/$/gi, "");
                    d = c.replace(/[/]/gi, "월");
                    d += "일";
                    if (d.includes("월")) {
                        if (d.match(/^\d{1,2}/g) < 13) replacePeriod.push(d);
                        else replacePeriod.push("신청 기간을 확인할 수 없습니다.");
                    } else replacePeriod.push("신청 기간을 확인할 수 없습니다.");
                });
            } else replacePeriod.push("신청 기간을 확인할 수 없습니다.");

            // 장학금 정보 db에 저장
            try {
                await conn.execute("INSERT INTO inuCrawling (major, title, period, link, writeTime) VALUES (?,?,?,?,?)", [
                    major,
                    title,
                    replacePeriod,
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

    console.log("인천대 장학금 공지사항 DB에 업데이트 완료");
    browser.close();
};

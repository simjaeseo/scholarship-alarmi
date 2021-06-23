const { getConn } = require("../database/index");
const { isAuth } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.use(isAuth);

router.post('/addBookmark',(req,res,next)=>{
    const {title, link, writeTime} = req.body;
    const {userId} = req.loginUser;

    let conn;
    try {
        conn = await getConn().catch(next);
        await conn.execute('INSERT INTO bookmark (userId, title, link, writeTime ) values (?,?,?)',[userId, title, link,writeTime]);
        if (conn) conn.release();
        res.status(201).json({success:true,message:"즐겨찾기 데이터베이스에 추가 성공"});
    } catch (e) {
        console.error(e);
    } 
})


router.get('bookmark',(req,res)=>{
    const {userId} = req.loginUser;

    let conn;
    let result;
    try {
        conn = await getConn().catch(next);
        const [[bookmarks]] = await conn.query('SELECT * FROM bookmark WHERE = ? ',[userId])
        if(!bookmarks) result = {message : '즐겨찾기 목룍이 존재하지 않습니다.'} 
        else{
            result = {bookmarks}    //해당 유저 id로 검색한 db를 프론트에 뿌려줌
        }

    } catch (e) {
        console.error(e);
    } finally{
        if (conn) conn.release();
        res.status(201).json(result);

    }
})

module.exports = router;

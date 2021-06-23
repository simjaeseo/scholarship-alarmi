const { verify } = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

module.exports = {
    isAuth: (req, res, next) => {
        const token = req.headers.authorization;
        if (!token) {
            console.log(1);
            res.status(401).json({ success: false });
        } else {
            const accessToken = token.split(" ");
            if (accessToken[0] !== "Bearer") {
                console.log(2);
                res.status(401).json({ success: false });
                //
            } else {
                req.loginUser = verify(accessToken[1], JWT_SECRET);
                next();
            }
        }
    },
};

const jwt = require("jsonwebtoken");
const { secret } = require("../config/config");

module.exports = (req, res, next) => {
    let token = req.get("token");
    if (!token) {
        return res.json({
            code: "2003",
            msg: "Token lost",
            data: null,
        });
    }
    jwt.verify(token, secret, (err, data) => {
        if (err) {
            return res.json({
                code: "2004",
                msg: "Verify Fail",
                data: null,
            });
        }

        // Save user info
        req.user = data;

        // When verify success
        next();
    });
};

const express = require("express");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

const UserModel = require("../../models/UserModel");

const { secret } = require("../../config/config");

const router = express.Router();

/*
    Login router
*/
// form sent to here and run functions
router.post("/login", (req, res) => {
    let { username, password } = req.body;
    UserModel.findOne({ username, password: md5(password) })
        .then((data) => {
            if (!data) {
                return res.json({
                    code: "2002",
                    msg: "Username or password wrong",
                    data: null,
                });
            }
            // Generate current user token
            let token = jwt.sign(
                {
                    username: data.username,
                    _id: data._id,
                },
                secret,
                {
                    expiresIn: 60 * 60 * 24 * 7,
                }
            );

            // Response token
            res.json({
                code: "0000",
                msg: "Login Success",
                data: token,
            });
        })
        .catch((err) => {
            res.json({
                code: "2001",
                msg: "Database read Fail",
                data: null,
            });
        });
    return;
});

/*
    Logout router
*/
router.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.render("success", { msg: ":) Good bye", url: "/login" });
    });
});

module.exports = router;

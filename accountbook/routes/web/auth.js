const express = require("express");
const router = express.Router();
const UserModel = require("../../models/UserModel");
const md5 = require("md5");
/*
    Reg router
*/
// Get reg form page
router.get("/reg", (req, res) => {
    res.render("auth/reg");
});
// form sent to here and run functions
router.post("/reg", (req, res) => {
    // Form check...skip
    //
    UserModel.create({ ...req.body, password: md5(req.body.password) })
        .then((data) => {
            res.render("Success", { msg: ":) Reg Success", url: "/login" });
        })
        .catch((err) => {
            res.status(500).send("Fail, try later...");
        });
    return;
});

/*
    Login router
*/
// Get login form page
router.get("/login", (req, res) => {
    res.render("auth/login");
});
// form sent to here and run functions
router.post("/login", (req, res) => {
    let { username, password } = req.body;
    UserModel.findOne({ username, password: md5(password) })
        .then((data) => {
            if (!data) {
                return res.send("username or password was wrong");
            }
            req.session.username = data.username;
            req.session._id = data._id;

            res.render("success", { msg: ":) Login Success", url: "/account" });
        })
        .catch((err) => {
            res.status(500).send("Login Fail, try later...");
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

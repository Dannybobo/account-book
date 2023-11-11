const express = require("express");
const moment = require("moment");
const AccountModel = require("../../models/AccountModel");

// import middleware
let checkLoginMiddleware = require("../../middlewares/checkLoginMiddleware");

console.log(moment(new Date()).format("YYYY-MM-DD"));

// Create router object
const router = express.Router();
// Index router
router.get("/", (req, res) => {
    res.redirect("/account");
});

// show list page
router.get("/account", checkLoginMiddleware, function (req, res, next) {
    AccountModel.find()
        .sort({ time: -1 })
        .then((data) => {
            res.render("list", { accounts: data, moment: moment });
        })
        .catch((err) => {
            res.status(500).send("Read Fail");
        });
    return;
});

// show add form page
router.get("/account/create", checkLoginMiddleware, function (req, res, next) {
    res.render("create");
});

// add
router.post("/account", checkLoginMiddleware, (req, res) => {
    // console.log(req.body);
    AccountModel.create({
        ...req.body,
        time: moment(req.body.time).toDate(),
    })
        .then(() => {
            res.render("success", { msg: ":) 添加成功~", url: "/account" });
        })
        .catch((err) => {
            res.status(500).send("Fail to add account~");
            return;
        });
});

// remove
router.get("/account/:id", checkLoginMiddleware, (req, res) => {
    // get param id
    let id = req.params.id;
    AccountModel.deleteOne({ _id: id })
        .then(() => {
            res.render("success", { msg: ":) 刪除成功~", url: "/account" });
        })
        .catch(() => {
            res.status(500).send("Remove Fail");
            return;
        });
});

module.exports = router;

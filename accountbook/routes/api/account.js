const express = require("express");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const router = express.Router();

const AccountModel = require("../../models/AccountModel");
let checkTokenMiddleware = require("../../middlewares/checkTokenMiddleware");

// Get all accounts
router.get("/account", checkTokenMiddleware, function (req, res, next) {
    console.log(req.user);

    AccountModel.find()
        .sort({ time: -1 })
        .then((data) => {
            res.json({
                code: "0000",
                msg: "Read Success",
                data: data,
            });
        })
        .catch(() => {
            res.json({
                code: "1001",
                msg: "Read Fail",
                data: null,
            });
            return;
        });
});

// Get account by id
router.get("/account/:id", checkTokenMiddleware, function (req, res) {
    let { id } = req.params;
    // search in database
    AccountModel.findById(id)
        .then((data) => {
            res.json({
                code: "0000",
                msg: "Read Success",
                data: data,
            });
        })
        .catch(() => {
            res.json({
                code: "1004",
                msg: "Read Fail",
                data: null,
            });
        });
    return;
});

// Add a account
router.post("/account", checkTokenMiddleware, (req, res) => {
    // Form check

    AccountModel.create({
        ...req.body,
        time: moment(req.body.time).toDate(),
    })
        .then((data) => {
            res.json({
                code: "0000",
                msg: "Add Success",
                data: data,
            });
        })
        .catch(() => {
            res.json({
                code: "1002",
                msg: "Add Fail",
                data: null,
            });
            return;
        });
});

// Remove account by id
router.delete("/account/:id", checkTokenMiddleware, (req, res) => {
    // Get param id
    let id = req.params.id;
    AccountModel.deleteOne({ _id: id })
        .then(() => {
            res.json({
                code: "0000",
                msg: "Delete Success",
                data: {},
            });
        })
        .catch(() => {
            res.json({
                code: "1003",
                msg: "Delete Fail",
                data: null,
            });
            return;
        });
});

// Update account by id
router.patch("/account/:id", checkTokenMiddleware, (req, res) => {
    // Get param id
    let { id } = req.params;
    // Update database
    AccountModel.updateOne({ _id: id }, req.body)
        .then(() => {
            AccountModel.findById(id).then((data) => {
                res.json({
                    code: "0000",
                    msg: "Update Success",
                    data: data,
                });
            });
        })
        .catch(() => {
            res.json({
                code: "1004",
                msg: "Read Fail",
                data: null,
            });
        });
    return;
});

module.exports = router;

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// import web routers
const indexRouter = require("./routes/web/index");
const authRouter = require("./routes/web/auth");

// import api routers
const accountRouter = require("./routes/api/account");
const authApiRouter = require("./routes/api/auth");

// import packages about session
const session = require("express-session");
const MongoStore = require("connect-mongo");
// import config file
const { DBHOST, DBPORT, DBNAME } = require("./config/config");

const app = express();

// Set session middleware
app.use(
    session({
        name: "sid", // Set 'name' in cookie, default is connect.sid
        secret: "dannybobo", //  String use to encryption(also call signature), add 'salt'
        saveUninitialized: false, // Whether to set a cookie for each request to store the session id
        resave: true, // Whether to save the session again on each request
        store: MongoStore.create({
            mongoUrl: `mongodb://${DBHOST}:${DBPORT}/${DBNAME}`, // Setting for connect database
        }),
        cookie: {
            httpOnly: true, // If true, the front end cannot use javascript to control
            maxAge: 1000 * 60 * 60 * 24 * 7, // Here to set the expiration time of the sessionID
        },
    })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", [indexRouter, authRouter]);
app.use("/api", [accountRouter, authApiRouter]);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.render("404");
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;

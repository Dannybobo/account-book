/**
 *
 * @param {*} success: Callback when database connect successfully
 * @param {*} error: Callback when database connect fail
 */
module.exports = function (success, error) {
    const mongoose = require("mongoose");

    mongoose.set("strictQuery", true);

    const { DBHOST, DBPORT, DBNAME } = require("../config/config");
    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);

    mongoose.connection.once("open", () => {
        success();
    });

    mongoose.connection.on("error", () => {
        error();
    });
    mongoose.connection.on("close", () => {
        console.log("Connect Closed");
    });
};

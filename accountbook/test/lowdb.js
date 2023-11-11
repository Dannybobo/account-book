const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");

const db = low(adapter);

// db.defaults({ posts: [], user: {} }).write();

// db.get("posts").push({ id: 1, title: "Today is a good weather" }).write();
// db.get("posts").unshift({ id: 1, title: "Today is a good shift" }).write();

// console.log(db.get("posts").value());

// let res = db.get("posts").remove({ id: 2 }).write();
// console.log(res);

db.get("posts").find({ id: 1 }).assign({ title: "Bad" }).write();

const {Schema, model, Types} = require("mongoose");

const shema = new Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    id: {type: Number},
});

module.exports = model("User", shema);
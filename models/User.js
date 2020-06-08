const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    userId: {
        type: Number
    },
    name: {
        type: String
    },
    noOfOrders: {
        type: Number,
        optional: true,
        default: 0
    }
})
module.exports = User = mongoose.model("users", UserSchema);
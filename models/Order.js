const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
    orderId: {
        type: Number
    },
    userId: {
        type: Number

    },
    userRefId: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    subtotal: {
        type: Number,
        optional: true
    },
    date: {
        type: String,
        optional: true
    }
})
module.exports = Order = mongoose.model("orders", OrderSchema);
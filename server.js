var express = require('express');
var app = express();
var mongoose = require('mongoose');
const User = require("./models/User");
const Order = require("./models/Order");
const port = process.env.PORT || 8000;



let userData = [{ userId: "1", name: "Rahul" }, { userId: "2", name: "Ramesh" }, { userId: "3", name: "Ankita" }];
let orderData = [{ orderId: 1, userId: "1", subtotal: 500, date: "23 January 2019" },
{ orderId: 2, userId: "2", subtotal: 400, date: "16 March 2019" },
{ orderId: 3, userId: "1", subtotal: 150, date: "20 March 2019" },
{ orderId: 4, userId: "1", subtotal: 700, date: "25 March 2019" },
{ orderId: 5, userId: "3", subtotal: 200, date: "21 Feb 2019" },
{ orderId: 6, userId: "3", subtotal: 1500, date: "22 Feb 2019" },
{ orderId: 7, userId: "1", subtotal: 1200, date: "16 April 2019" },
{ orderId: 8, userId: "2", subtotal: 1600, date: "1 May 2019" },
{ orderId: 9, userId: "2", subtotal: 900, date: "23 May 2019" },
{ orderId: 10, userId: "1", subtotal: 700, date: "13 April 2019" }
]
let insertData = function (colName, data) {
    return new Promise(function (resolve, reject) {
        let firstUserId = data[0].userId
        eval(colName).findOne({ userId: firstUserId }).then(function (doc) {
            if (!doc) {
                eval(colName).insertMany(data, function (err, res) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(res)
                    }
                })
            }
        }).catch(function (err) {
            console.error(err)
            reject(err)
        })
    })

}
insertData('Order', orderData).then(function (doc) {
    insertData('User', userData).then(function (docs) {
        docs.forEach(function (elem, idx, array) {
            Order.update({ userId: elem.userId }, { $set: { userRefId: elem._id } }, { multi: true }).then(function (doc) {
                console.log("order updated success>>")
            }).catch(function (err) {
                console.error(err);
            })
        })
    }).catch(function (err) {
        console.error(err);
    })
})



// call routes
var user = require('./routes/user');
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
    .connect(
        db
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

app.use("/user", user);

app.listen(port, () => console.log(`Server up and running on port ${port} !`));

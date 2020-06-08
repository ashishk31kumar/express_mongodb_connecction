const express = require('express')
const router = express.Router()
const User = require("../models/User");
const Order = require("../models/Order");

var updateUser = function (elem) {
    return new Promise(function (resolve, reject) {
        User.updateOne({ userId: elem.userId }, { $set: { noOfOrders: elem.noOfOrders } }).then(function (doc) {
            resolve(doc)
        }).catch(function (err) {
            console.error(err);
            reject(err)
        })
    })
}

router.get("/", (req, res, next) => {
    console.log("user  hit>>>", req.params)
    Order.aggregate([
        {
            $group: {
                _id: { userId: "$userId", userRefId: "$userRefId" },
                averageBillValue: { "$avg": "$subtotal" },
                noOfOrders: { "$sum": 1 }
            }
        },
        {
            $lookup: {
                "from": "users",
                "localField": "_id.userRefId",
                "foreignField": "_id",
                "as": "userObj"
            }
        },
        { $unwind: "$userObj" },
        {
            $project: {
                _id: 0,
                noOfOrders: 1,
                averageBillValue: 1,
                userId: "$userObj.userId",
                name: "$userObj.name"
            }
        }
    ], function (err, docArr) {
        if (err) {
            console.log("error in fetching detail", err)
        }
        else {
            let promises = [];
            docArr.forEach(function (elem, idx, arr) {
                promises.push(updateUser(elem))

            })
            Promise.all(promises)
                .then(function (result) {
                    res.send({ success: true, message: "Sucessfuly updated" })
                })
                .catch(function (error) {
                    console.log("error in update user collection", error)
                })
        }

    })
});
module.exports = router;
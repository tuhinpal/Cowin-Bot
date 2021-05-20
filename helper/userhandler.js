const config = require('../config');
const MongoClient = require('mongodb').MongoClient;

async function addUpdate(uid, pincode) {

    try {
        const database = await MongoClient.connect(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        const result = await database.db("cowin").collection("data").find({ uid }).toArray()

        if (result.length === 0) {

            await database.db("cowin").collection("data").insertOne({
                createdAt: new Date(),
                uid,
                pincode,
            })

            database.close()

            return ({
                status: true,
                msg: `We will notify you if a new vaccination slot available in your PinCode (${pincode}).`
            })

        } else {

            await database.db("cowin").collection("data").updateOne({ uid }, {
                $set: {
                    pincode
                }
            })

            database.close()

            return ({
                status: true,
                msg: `Your new pincode (${pincode}) has been updated. We will notify you when a new vaccination slot available on your Pincode.`,
            })

        }

    } catch (err) {
        return {
            status: false,
            msg: "Sorry, Something went wrong! Please try again later."
        }
    }
}

async function deleteData(uid) {

    try {
        const database = await MongoClient.connect(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        const result = await database.db("cowin").collection("data").find({ uid }).toArray()

        if (result.length !== 0) {

            await database.db("cowin").collection("data").deleteOne({ uid })
            database.close()

            return ({
                status: true,
                msg: "Thanks ! We will not notify you again. 😷 Stay Safe !"
            })

        } else {

            database.close()
            return ({
                status: false,
                msg: "Sorry, seems like you have not added a pincode yet.",
            })

        }

    } catch (err) {
        return {
            status: false,
            msg: "Sorry, Something went wrong! Please try again later."
        }
    }
}

async function allusers() {

    try {
        const database = await MongoClient.connect(config.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        const result = await database.db("cowin").collection("data").find().project({ uid: 1, pincode: 1, _id: 0 }).toArray()

        database.close()

        return ({
            status: true,
            result
        })

    } catch (err) {
        return {
            status: false,
            msg: "Sorry, Something went wrong! Please try again later."
        }
    }
}


module.exports = {
    addUpdate,
    deleteData,
    allusers
}

/*
    Please note changing some codes and adding your name will not make you a developer

    Project Name: Cowin-Bot
    Project Url: https://github.com/cachecleanerjeet/Cowin-Bot
    Author: Tuhin Kanti Pal, https://github.com/cachecleanerjeet
    Email: tprojectsdevelopment@gmail.com

    You can only expect community support !

*/
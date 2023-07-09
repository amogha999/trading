const express = require("express");
const https = require("https");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const _ = require("lodash");
const app = express();

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }));
let message = [];
let context = [];
let level = [];
app.get("/", (req, res) => {
    const url = "https://logservice.azurewebsites.net/api/Logger#";
    https.get(url, (response) => {
        response.on("data", (data) => {
            const dat = JSON.parse(data)
            for (i = 0; i < dat.length; i++) {
                message.push(dat[i].message)
                level.push(dat[i].level)
                context.push(dat[i].context)
            }
            res.render("index", { message: message, context: context, level: level })
        })
    })
})

app.get("/:req", (req, res) => {
    let reqTitle = req.params.req;
    for (i = 0; i < message.length; i++) {
        if (reqTitle == message) {
            res.render("index", { message: message[i], context: context[i], level: level[i] })
        }
    }
})

app.listen(process.env.PORT|| 3000, () => {
    console.log("Server Started on 3000")
})

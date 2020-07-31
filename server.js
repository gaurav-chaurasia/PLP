const express = require('express');
const { request } = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) { // homem route
    console.log(req.url);
    res.sendFile(__dirname + "/views/root.html");
});

app.get("/calculator", function(req, res) { // calculator route
    res.sendFile(__dirname + "/views/calculator.html");
});

app.get("/dice-game", function (req, res) { // calculator route
    res.sendFile(__dirname + "/views/dice-game.html");
});

app.post("/calculator", function (req, res) {
    // console.log(req.body);
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let result = num1 + num2;
    res.send( "sum of those number is " + result);
});

app.listen(3000, function() {
    console.log("server started listing on http://localhost:3000/........!!!");
    console.log("to stop server press Ctrl+C ");
});

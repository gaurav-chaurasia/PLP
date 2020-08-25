const express = require('express');
const { request } = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static("public"));
app.use(express.static("model"));

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

app.get("/budget", function (req, res) { 
    res.sendFile(__dirname + "/views/budget.html");
});

app.post("/calculator", function (req, res) {
    console.log(req.body);
    let result;
    let num1 = Number(req.body.num1);
    let num2 = Number(req.body.num2);
    let operator = req.body.operator;
    switch (operator) {
        case '+': 
            result = num1 + num2;
            break;
        case '-':
            result = Math.abs(num1 - num2);
            break;
        case '/': 
            result = num1 / num2;
            break;
        case '*': 
            result = num1 * num2;
            break;
        case '%': 
            result = num1 % num2;
            break;
        default: result = "Invalid option choosen!!!."
    }
    res.send("<h1>result of '" + operator + "' on "+ num1 + " and "+ num2 +" is " + result + "</h1>");
});

app.listen(3000, function() {
    console.log("server started listing on http://localhost:3000/........!!!");
    console.log("to stop server press Ctrl+C ");
});

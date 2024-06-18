
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = 3000;
const path = require("path");
const api = require('./src/routes')

const stripe = require('stripe')("sk_test_51PKJKxSG9CGXHbquQgesTIN8g5Pcf8aNMOHDVQqSq1pTzkNs2CtfHFbn9pkFeg3zzkFK2Yv4v8ytKZHHPuyrX6f60067a1mFLn");


app.set("views", path.join(__dirname, 'src', "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname + "/public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(cookieParser())

app.use('/', api)




app.listen(port, () => {
    console.log("listening port " + port);
})



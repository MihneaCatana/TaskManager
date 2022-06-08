const express = require("express");
const cors = require("cors");
const router = require("./config/index");
const session = require("express-session");
const path = require("path");
const app = express();
const PORT = 7000;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.use(
  session({
    key: "userId",
    secret: "secret",
    cookie: { expires: 1000 * 60 * 60 * 24 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

//gasim pe ce port ruleaza aplicatia
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else {
    console.log("Server is running on port " + PORT);
  }
});

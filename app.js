const express = require('express');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const path = require("path");
var fs = require('fs');
const http = require("http");
const router = require("./src/routes/index");
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');
require('dotenv').config()



let port = process.env.PORT || "3002";
app.set("port", port);
app.use(cors());

app.use(
  fileUpload({
      limits: {
          fileSize: 50*1024*1024,// 50 MB
      },
      abortOnLimit: true,
  })
);

//for CORS
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  req.header("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())



mongoose.connect(process.env.Databaseconnection,
{
  useNewUrlParser: true,
  useUnifiedTopology: true
}
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
  

app.use(express.json());

app.use("/api", router);
app.use("/uploads", express.static("src/uploads"));




const httpServer = http.createServer( app);
console.log('API Server created in HTTPS mode');

/**
 * Listen on provided port, on all network interfaces.
 */
httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);


function onError(error) {
  if (error.syscall !== "listen") throw error;

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  let addr = httpServer.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}


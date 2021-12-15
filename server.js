console.log("up and running");

let express = require("express");

let app = express();

let port = 3000;

let server = app.listen(port);

console.log("Server is runnning on http://localhost " + port);

app.use(express.static("public"));

let serverSocket = require("socket.io");

let io = serverSocket(server);

io.on("connection", newConnection);

function newConnection(newSocket) {
  console.log(newSocket.id);

  newSocket.on("mouse", mouseMessage);
  newSocket.on("target", newTarget);

  function mouseMessage(dataReceived) {
    // console.log(dataReceived);
    newSocket.broadcast.emit("mouseBroadcast", dataReceived);
  }
  function newTarget(targetReceived) {
    console.log(targetReceived);
    newSocket.broadcast.emit("targetBroadcast", targetReceived);
  }
}

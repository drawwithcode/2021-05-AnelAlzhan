let clientSocket = io();

clientSocket.on("connect", newConnection);
clientSocket.on("mouseBroadcast", newBroadcast);
clientSocket.on("targetBroadcast", newTarget);

function newConnection() {
  console.log(clientSocket.id);
}

var sideX;
var sideY;
let targetballpos = {
  x: 0,
  y: 0,
};
function newBroadcast(data) {
  sideX = data.x;
  sideY = data.y;
  // console.log(sideX, sideY);
}

function newTarget(targetData) {
  // console.log(targetData.x, targetData.y);
  // let tempX
  // let tempY
  // tempX = targetData.x
  // targetballpos.x;
  // tempY=targetData.y
  setTarget(targetData.x, targetData.y);
  console.log(targetballpos.x, targetballpos.y);
}

var ballX;
var ballY;
var particle;
let lines = [];

let ballpos = {
  x: 0,
  y: 0,
};

function mouseMoved() {
  let message = {
    x: mouseX,
    y: mouseY,
  };
  clientSocket.emit("mouse", message);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  particle = new Particle(100, 100);
  sideP = new sideParticle(100, 100);
}

function draw() {
  background(200);
  fill(0, 20);
  rect(0, 0, width, height);
  push();
  noStroke();
  fill("white");
  circle(ballpos.x, ballpos.y, 20);
  ballpos.x += 0.1 * (targetballpos.x - ballpos.x);
  ballpos.y += 0.1 * (targetballpos.y - ballpos.y);
  pop();
  particle.update();
  particle.show();

  sideP.update();
  sideP.show();
  for (let i = 0; i < lines.length; i++) {
    lines[i].show();
    lines[i].update();
  }
  if (lines.length > 1) {
    lines.splice(0, 1);
  }
}

function mouseClicked() {
  setTarget(mouseX, mouseY);
  lines.push(new Line(targetballpos.x, targetballpos.y));
  // console.log(targetballpos);
  clientSocket.emit("target", targetballpos);
}

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.history = [];
  this.lineHistory = [];
  this.sWidth = 100;

  this.update = function () {
    this.sWidth -= 1;

    this.x += random(-10, 10);
    this.y += random(-10, 10);
    if (this.sWidth < -100) {
      this.sWidth = 100;
    }

    var v = createVector(mouseX, mouseY);
    this.history.push(v);
    this.lineHistory.push(v);
    if (this.history.length > 10) {
      this.history.splice(0, 1);
    }
    if (this.lineHistory.length > 150) {
      this.lineHistory.splice(0, 1);
    }
  };
  this.show = function () {
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      var scale = this.history.length;
      push();
      noStroke();
      fill(random(50));
      ellipse(pos.x, pos.y, i * 5, i * 5);
      pop();
    }
  };
}

function sideParticle(x, y) {
  this.x = x;
  this.y = y;
  this.history = [];
  this.lineHistory = [];
  this.sWidth = 100;

  this.update = function () {
    this.sWidth -= 1;

    this.x += random(-10, 10);
    this.y += random(-10, 10);
    if (this.sWidth < -100) {
      this.sWidth = 100;
    }

    var v = createVector(sideX, sideY);
    this.history.push(v);
    this.lineHistory.push(v);
    if (this.history.length > 5) {
      this.history.splice(0, 1);
    }
    if (this.lineHistory.length > 150) {
      this.lineHistory.splice(0, 1);
    }
  };
  this.show = function () {
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      var scale = this.history.length;
      push();
      strokeWeight(2);
      noFill();
      ellipse(pos.x, pos.y, i * 5, i * 5);
      pop();
    }
  };
}

class Line {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lineHistory = [];
  }
  update() {
    this.x += random(-10, 10);
    this.y += random(-10, 10);

    let v = createVector(targetballpos.x, targetballpos.y); //or targetballpos
    this.lineHistory.push(v);

    if (this.lineHistory.length > 100) {
      this.lineHistory.splice(0, 1);
    }
  }

  show() {
    noFill();
    strokeWeight(5);
    beginShape();
    for (var i = 0; i < this.lineHistory.length; i++) {
      var linepos = this.lineHistory[i];

      vertex(linepos.x, linepos.y);
    }
    endShape();
  }

  mouseClicked() {
    stroke("red");
  }
  paintLine() {
    strokeWeight(10);

    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function setTarget(targetx, targety) {
  targetballpos = {
    x: targetx,
    y: targety,
  };
}

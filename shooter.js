var canvas = document.getElementById('shooter');
var ctx = canvas.getContext('2d');
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var keysDown = {};
var shots = [];

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

// Player classes
function Player(x, y) {
    this.accel = 200;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.radius = 20;
    this.angle = 0;
    this.omega = 2 * Math.PI;
    this.color = "blue";
    this.x = x;
    this.y = y;

    this.fireRate = 3;
    this.lastFire = 0;
    this.numShots = 5;
    this.currShots = 0;

    this.lives = 5;
}

Player.prototype.control = function () {
    return {
        'down': 40 in keysDown,
        'up': 38 in keysDown,
        'left': 37 in keysDown,
        'right': 39 in keysDown,
        'clockwise': 90 in keysDown,
        'counter': 65 in keysDown,
        'shoot': 16 in keysDown || 32 in keysDown,
    }
}

Player.prototype.update = function (modifier) {
    var ctr = this.control();
    if (ctr.down) { // down
        this.ySpeed += this.accel * modifier;
    }
    if (ctr.up) { // up
        this.ySpeed -= this.accel * modifier;
    }
    if (ctr.left) { // left
        this.xSpeed -= this.accel * modifier;
    }
    if (ctr.right) { // right
        this.xSpeed += this.accel * modifier;
    }
    if (ctr.counter) { // a
        this.angle -= this.omega * modifier;
    }
    if (ctr.clockwise) { // z
        this.angle += this.omega * modifier;
    }
    if (ctr.shoot) { // shift or space
        this.shoot();
    }
    if (this.xSpeed + this.ySpeed != 0) {
        var speed = Math.sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed)
        this.xSpeed += -this.accel * modifier * this.xSpeed / (2 * speed);
        this.ySpeed += -this.accel * modifier * this.ySpeed / (2 * speed);
    }
    var dy = this.ySpeed * modifier;
    var dx = this.xSpeed * modifier;
    if (this.x + this.radius > WIDTH - dx || this.x - this.radius < -dx) {
        dx = -dx;
        this.xSpeed = -this.xSpeed;
    }
    if (this.y + this.radius > HEIGHT - dy || this.y - this.radius < -dy) {
        dy = -dy;
        this.ySpeed = -this.ySpeed;
    }
    this.x += dx;
    this.y += dy;
}

Player.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.moveTo(this.x, this.y);
    var xPrime = this.x + this.radius * Math.cos(this.angle);
    var yPrime = this.y + this.radius * Math.sin(this.angle);
    ctx.lineTo(xPrime, yPrime);
    ctx.stroke();
    ctx.closePath();
}

Player.prototype.shoot = function () {
    if (Date.now() - this.lastFire > 1000 / this.fireRate && this.currShots < this.numShots) {
        shots.push(new Shot(this));
        this.lastFire = Date.now();
        this.currShots++;
    }
}

function AIPlayer(x, y) {
    Player.apply(this, [x, y]);
    this.color = "red";
    this.angle = Math.PI;
}

AIPlayer.prototype = new Player();
AIPlayer.prototype.control = function() {
    return {
        'up': false,
        'down': false,
        'left': false,
        'right': false,
        'clockwise': false,
        'counter': false,
        'shoot': false,
    }
}

// Shot class
function Shot (player) {
    this.player = player;
    this.color = player.color;
    this.radius = player.radius / 3;
    this.x = player.x + (player.radius + this.radius) * Math.cos(player.angle);
    this.y = player.y + (player.radius + this.radius) * Math.sin(player.angle);
    this.xSpeed = 300 * Math.cos(player.angle);
    this.ySpeed = 300 * Math.sin(player.angle);
    this.numBounces = 2;
    this.currBounces = 0;
}

Shot.prototype.update = function (modifier) {
    var dx = this.xSpeed * modifier;
    var dy = this.ySpeed * modifier;
    if (this.x + this.radius > WIDTH - dx || this.x - this.radius < -dx) {
        this.xSpeed = -this.xSpeed;
        dx = -dx;
        if (this.currBounces >= this.numBounces) {
            this.destroy();
        }
        this.currBounces++;
    }
    if (this.y + this.radius > HEIGHT - dy || this.y - this.radius < -dy) {
        this.ySpeed = -this.ySpeed;
        dy = -dy;
        if (this.currBounces >= this.numBounces) {
            this.destroy();
        }
        this.currBounces++;
    }
    this.x += dx;
    this.y += dy;

    // collision detection
    if (Math.abs(this.x - p1.x) < this.radius + p1.radius) {
        if (Math.abs(this.y - p1.y) < this.radius + p1.radius) {
            this.destroy();
            p1.lives--;
            if (p1.lives <= 0 ) {
                winner = "P2";
            }
        }
    }
    if (Math.abs(this.x - p2.x) < this.radius + p2.radius) {
        if (Math.abs(this.y - p2.y) < this.radius + p2.radius) {
            this.destroy();
            p2.lives--;
            if (p2.lives <= 0) {
                winner = "P1";
            }
        }
    }
}

Shot.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
}

Shot.prototype.destroy = function () {
    this.player.currShots--;
    var i = shots.indexOf(this);
    if (i != -1) {
        shots.splice(i, 1);
    }
}

// The actual game
function init () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    p1 = new Player(WIDTH/3, HEIGHT/2);
    p2 = new AIPlayer(2*WIDTH/3, HEIGHT/2);
}

function render () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    p1.draw();
    p2.draw();
    shots.forEach(function (shot) {
        shot.draw();
    });
    ctx.fillStyle = "black";
    ctx.font = "12px Arial";
    ctx.fillText("P1: " + p1.lives, 5, 15);
    ctx.fillText("P2: " + p2.lives, 687, 15);
    ctx.fillText("" + Math.round((Date.now() - start)/1000), 5, 470);
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var p1 = {};
var p2 = {};

function play() {
    var now = Date.now();
    var delta = now - then;
    p1.update(delta / 1000);
    p2.update(delta / 1000);
    shots.forEach(function (shot) {
        shot.update(delta / 1000);
    });
    render();

    then = now;

    if (winner) {
        endGame(winner);
    } else {
        requestAnimationFrame(play);
    }
}

function endGame(winner) {
    alert(winner + " wins! Reload to start again.");
    return;
}

function main() {
    if (49 in keysDown) {
        start = Date.now();
        then = Date.now();
        play();
        return;
    }
    requestAnimationFrame(main);
}

var start = Date.now();
var then = Date.now();
var winner;
init();
render();
ctx.fillText("Press 1 for simple AI, 2 for Neural Network", 245, 140);
main();

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

// Player class
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
}

Player.prototype.update = function (modifier) {
    if (40 in keysDown) { // down
        this.ySpeed += this.accel * modifier;
    }
    if (38 in keysDown) { // up
        this.ySpeed -= this.accel * modifier;
    }
    if (37 in keysDown) { // left
        this.xSpeed -= this.accel * modifier;
    }
    if (39 in keysDown) { // right
        this.xSpeed += this.accel * modifier;
    }
    if (65 in keysDown) { // a
        this.angle -= this.omega * modifier;
    }
    if (90 in keysDown) { // z
        this.angle += this.omega * modifier;
    }
    if (16 in keysDown || 32 in keysDown) { // shift or space
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
    if (Date.now() - this.lastFire > 1000 / this.fireRate) {
        shots.push(new Shot(this));
        this.lastFire = Date.now();
    }
}

// Shot class
function Shot (player) {
    this.color = player.color;
    this.x = player.x + player.radius * Math.cos(player.angle);
    this.y = player.y + player.radius * Math.sin(player.angle);
    this.radius = player.radius / 3;
    this.xSpeed = 300 * Math.cos(player.angle);
    this.ySpeed = 300 * Math.sin(player.angle);
}

Shot.prototype.update = function (modifier) {
    var dx = this.xSpeed * modifier;
    var dy = this.ySpeed * modifier;
    if (this.x + this.radius > WIDTH - dx || this.x - this.radius < -dx) {
        this.xSpeed = -this.xSpeed;
        dx = -dx;
    }
    if (this.y + this.radius > HEIGHT - dy || this.y - this.radius < -dy) {
        this.ySpeed = -this.ySpeed;
        dy = -dy;
    }
    this.x += dx;
    this.y += dy;
}

Shot.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
}

// The actual game
p1 = new Player(WIDTH/2, HEIGHT/2);
p1.color = "red";

function render() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    p1.draw();
//    p2.draw();
    shots.forEach(function (shot) {
        shot.draw();
    });
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var main = function () {
    var now = Date.now();
    var delta = now - then;
    p1.update(delta / 1000);
//    p2.update(delta / 1000);
    shots.forEach(function (shot) {
        shot.update(delta / 1000);
    });
    render();

    then = now;

    requestAnimationFrame(main);
}

var then = Date.now();
main();

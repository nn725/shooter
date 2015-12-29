var canvas = document.getElementById('shooter');
var ctx = canvas.getContext('2d');
var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
}, false);

var p1 = {
    accel: 200,
    xSpeed: 0,
    ySpeed: 0,
    radius: 20,
    angle: 0,
    x: WIDTH/2,
    y: HEIGHT/2,
}

p1.update = function (modifier) {
    if (40 in keysDown) {
        this.ySpeed += this.accel * modifier;
    }
    if (38 in keysDown) {
        this.ySpeed -= this.accel * modifier;
    }
    if (37 in keysDown) {
        this.xSpeed -= this.accel * modifier;
    }
    if (39 in keysDown) {
        this.xSpeed += this.accel * modifier;
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

var p2 = {
    speed: 5,
    x: 10,
    y: 20,
}

p1.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
}

p2.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI*2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}

function render() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    p1.draw();
    p2.draw();
}

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var main = function () {
    var now = Date.now();
    var delta = now - then;
    p1.update(delta / 1000);
    render();

    then = now;

    requestAnimationFrame(main);
}

var then = Date.now();
main();

var canvas = document.getElementById('shooter');
var ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI*2, false);
ctx.fillStyle = 'blue';
ctx.fill();
ctx.closePath();

ctx.font = "30px Courier";
var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop("0", "blue");
gradient.addColorStop("0.3", "green");
gradient.addColorStop("0.5", "yellow");
gradient.addColorStop("0.8", "red");
gradient.addColorStop("1.0", "orange");
ctx.fillStyle = gradient;
ctx.fillText("Hi NATO! What's good? Hope u r well man", 10, 90);

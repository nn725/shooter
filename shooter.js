var canvas = document.getElementById('shooter');
var ctx = canvas.getContext('2d');

ctx.beginPath();
ctx.arc(240, 160, 20, 0, Math.PI*2, false);
ctx.fillStyle = 'blue';
ctx.fill();
ctx.closePath();

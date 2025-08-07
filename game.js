// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load ảnh
const babyImg = new Image();
babyImg.src = 'assets/baby.png';

const toyImgs = [
  new Image(),
  new Image()
];
toyImgs[0].src = 'assets/toy1.png'; // mặt trời đen trắng
toyImgs[1].src = 'assets/toy2.png'; // gấu + bóng

const bgImg = new Image();
bgImg.src = 'assets/bg.png'; // căn hộ 2 phòng ngủ

let baby = { x: 50, y: 50, size: 60 };
let toy = {
  x: 200,
  y: 200,
  size: 50,
  img: toyImgs[0]
};
let score = 0;
let timeLeft = 60;
let timer;
let keys = {};

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function randomToy() {
  toy.x = Math.random() * (canvas.width - toy.size);
  toy.y = Math.random() * (canvas.height - toy.size);
  toy.img = toyImgs[Math.floor(Math.random() * toyImgs.length)];
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vẽ background
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // Vẽ đồ chơi
  ctx.drawImage(toy.img, toy.x, toy.y, toy.size, toy.size);

  // Vẽ em bé
  ctx.drawImage(babyImg, baby.x, baby.y, baby.size, baby.size);

  // Va chạm
  if (Math.abs(baby.x - toy.x) < 40 && Math.abs(baby.y - toy.y) < 40) {
    score++;
    document.getElementById('score').textContent = score;
    randomToy();
  }

  // Di chuyển
  if (keys['ArrowUp']) baby.y -= 3;
  if (keys['ArrowDown']) baby.y += 3;
  if (keys['ArrowLeft']) baby.x -= 3;
  if (keys['ArrowRight']) baby.x += 3;

  // Giữ trong canvas
  baby.x = Math.max(0, Math.min(canvas.width - baby.size, baby.x));
  baby.y = Math.max(0, Math.min(canvas.height - baby.size, baby.y));

  requestAnimationFrame(draw);
}

function countdown() {
  timeLeft--;
  document.getElementById('time').textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    alert(`🎉 Hết giờ! Thỏ đã thu thập được ${score} món đồ chơi!`);
  }
}

function startGame() {
  score = 0;
  timeLeft = 60;
  baby.x = 50;
  baby.y = 50;
  document.getElementById('score').textContent = score;
  document.getElementById('time').textContent = timeLeft;
  randomToy();
  clearInterval(timer);
  timer = setInterval(countdown, 1000);
  draw();
}


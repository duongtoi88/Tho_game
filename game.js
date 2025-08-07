// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const babyImg = new Image();
babyImg.src = 'assets/baby.png';

const toys = ['assets/toy1.png', 'assets/toy2.png'].map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

let baby = { x: 50, y: 50, size: 50 };
let toy = { x: 200, y: 200, size: 40 };
let score = 0;
let timeLeft = 60;
let timer;
let keys = {};

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Vẽ đồ chơi
  ctx.drawImage(toys[0], toy.x, toy.y, toy.size, toy.size);

  // Vẽ em bé
  ctx.drawImage(babyImg, baby.x, baby.y, baby.size, baby.size);

  // Kiểm tra va chạm
  if (Math.abs(baby.x - toy.x) < 40 && Math.abs(baby.y - toy.y) < 40) {
    score++;
    document.getElementById('score').textContent = score;
    // Random lại vị trí đồ chơi
    toy.x = Math.random() * (canvas.width - 40);
    toy.y = Math.random() * (canvas.height - 40);
  }

  // Di chuyển bé
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
    alert(`🎉 Hết giờ! Bé đã thu thập được ${score} món đồ chơi!`);
  }
}

function startGame() {
  score = 0;
  timeLeft = 60;
  baby.x = 50;
  baby.y = 50;
  document.getElementById('score').textContent = score;
  document.getElementById('time').textContent = timeLeft;
  clearInterval(timer);
  timer = setInterval(countdown, 1000);
  draw();
}

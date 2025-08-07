const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load ảnh bé (2 khung animation)
const babyImgs = [new Image(), new Image()];
babyImgs[0].src = 'assets/baby1.png';
babyImgs[1].src = 'assets/baby2.png';

// Background
const bgImg = new Image();
bgImg.src = 'assets/bg.png';

// Âm thanh
const crySound = new Audio('assets/cry.mp3');
const pointSound = new Audio('assets/point.mp3');

// Trạng thái
const states = ['Ăn', 'Chơi', 'Ngủ'];
let currentState = 'Ăn';

const validItems = {
  'Ăn': ['binh-sua', 'ti', 'me'],
  'Chơi': ['bim', 'quan-ao', 'toy1', 'toy2', 'toy3'],
  'Ngủ': ['goi', 'chan', 'bup-be']
};

// Đồ vật
const toyImgs = [
  { name: 'binh-sua', src: 'assets/binh-sua.png' },
  { name: 'ti', src: 'assets/ti.png' },
  { name: 'me', src: 'assets/me.png' },
  { name: 'bim', src: 'assets/bim.png' },
  { name: 'quan-ao', src: 'assets/quan-ao.png' },
  { name: 'toy1', src: 'assets/toy1.png' },
  { name: 'toy2', src: 'assets/toy2.png' },
  { name: 'toy3', src: 'assets/toy3.png' },
  { name: 'goi', src: 'assets/goi.png' },
  { name: 'chan', src: 'assets/chan.png' },
  { name: 'bup-be', src: 'assets/bup-be.png' }
];

const loadedToys = toyImgs.map(item => {
  const img = new Image();
  img.src = item.src;
  return { ...item, img };
});

// Bé
let baby = {
  x: 50,
  y: 50,
  size: 60,
  frame: 0,
  img: babyImgs[0],
  lastMoveTime: 0
};

let toy = {
  x: 200,
  y: 200,
  size: 50,
  name: 'toy1',
  img: loadedToys[0].img
};

let score = 0;
let timeLeft = 60;
let timer;
let keys = {};

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

// Cập nhật khung hình bò
function updateBabyFrame() {
  const now = Date.now();
  if (now - baby.lastMoveTime > 100) {
    baby.frame = (baby.frame + 1) % 2;
    baby.img = babyImgs[baby.frame];
    baby.lastMoveTime = now;
  }
}

// Random trạng thái
function randomState() {
  let newState;
  do {
    newState = states[Math.floor(Math.random() * states.length)];
  } while (newState === currentState);
  currentState = newState;
  document.getElementById('currentState').textContent = currentState;
}
setInterval(randomState, 25000);

// Random đồ vật
function randomToy() {
  const chosen = loadedToys[Math.floor(Math.random() * loadedToys.length)];
  toy.x = Math.random() * (canvas.width - toy.size);
  toy.y = Math.random() * (canvas.height - toy.size);
  toy.img = chosen.img;
  toy.name = chosen.name;
}

// Vẽ game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (bgImg.complete && bgImg.naturalWidth > 0) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(toy.img, toy.x, toy.y, toy.size, toy.size);
  ctx.drawImage(baby.img, baby.x, baby.y, baby.size, baby.size);

  // Va chạm
  if (Math.abs(baby.x - toy.x) < 40 && Math.abs(baby.y - toy.y) < 40) {
    if (validItems[currentState].includes(toy.name)) {
      score++;
      pointSound.play();
      document.getElementById('score').textContent = score;
    } else {
      crySound.play();
      alert('Bé khóc 😭 đồ chơi sai!');
    }
    randomToy();
  }

  // Di chuyển + đổi frame
  if (keys['ArrowUp']) { baby.y -= 3; updateBabyFrame(); }
  if (keys['ArrowDown']) { baby.y += 3; updateBabyFrame(); }
  if (keys['ArrowLeft']) { baby.x -= 3; updateBabyFrame(); }
  if (keys['ArrowRight']) { baby.x += 3; updateBabyFrame(); }

  baby.x = Math.max(0, Math.min(canvas.width - baby.size, baby.x));
  baby.y = Math.max(0, Math.min(canvas.height - baby.size, baby.y));

  requestAnimationFrame(draw);
}

// Đồng hồ
function countdown() {
  timeLeft--;
  document.getElementById('time').textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timer);
    alert(`🎉 Hết giờ! Bé đạt ${score} điểm!`);
  }
}

// Bắt đầu game
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

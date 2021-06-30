const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div'),
  borders = document.querySelectorAll('.border'),
  btns = document.querySelectorAll('.btn'),
  bestScore = document.querySelector('.best-score'),
  volume = document.querySelector('.volume');

// const music = document.createElement('embed');

// music.src = 'audio.mp3';
// music.classList.add('visually-hidden');

const music = new Audio('audio.mp3');
music.volume = 0.1;

car.classList.add('car');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 3,
  volume: true,
};

let startSpeed = 0;

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
volume.addEventListener('click', toggleVolume);

bestScore.innerHTML = `Your record ${showBestRecord()}`;

const changeLevel = (lvl) => {
  switch(lvl) {
    case '1':
      setting.traffic = 4;
      setting.speed = 4;
      break;
    case '2':
      setting.traffic = 3;
      setting.speed = 6;
      break;
    case '3':
      setting.traffic = 3;
      setting.speed = 8;
      break;
  }
  startSpeed = setting.speed;
}

// Вычисление кол-ва помещающихся объектов
function getQuantitylements(heightElement) {
  return (gameArea.offsetHeight / heightElement) + 1;
}

// Подстановка числа для рандомного противника
const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);

function startGame(e) {

  const target = e.target;
  if (!target.classList.contains('btn')) return;
  music.play();

  const levelGame = target.dataset.level;

  changeLevel(levelGame);

  btns.forEach(btn => btn.disabled = true);

  // document.body.append(music);

  // setTimeout(() => {
  //   music.remove();
  // }, 3000);

  // gameArea.style.height = Math.floor((document.documentElement.clientHeight - HEIGHT_ELEM)
  // / HEIGHT_ELEM) * HEIGHT_ELEM;
  gameArea.style.height = HEIGHT_ELEM + '%';
  borders.forEach(border => border.style.height = HEIGHT_ELEM + '%');
  score.classList.remove('hide');
  // start.classList.add('hide');
  gameArea.innerHTML = '';
  
  // Создание линий
  for (let i = 0; i < getQuantitylements(HEIGHT_ELEM); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * HEIGHT_ELEM) +'px';
    line.style.height = (HEIGHT_ELEM / 1.5) + 'px';
    line.y = i * HEIGHT_ELEM;
    gameArea.append(line);
  }

  // Создание врагов
  for (let i = 0; i < getQuantitylements(HEIGHT_ELEM * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) +'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `
      transparent
      url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png)
      center / cover
      no-repeat`;
    gameArea.append(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.append(car);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = `SCORE: ${setting.score}`;

    setting.speed = startSpeed + Math.floor(setting.score / 5000);
    console.log(setting.speed);
    moveRoad();
    moveEnemy();
    if(keys.ArrowLeft && setting.x > 0){
      setting.x -= setting.speed;
    }
    if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
      setting.x += setting.speed;
    }
    if(keys.ArrowUp && setting.y > 0){
      setting.y -= setting.speed;
    }
    if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
      setting.y += setting.speed;
    }

    car.style.left = setting.x + 'px';
    car.style.top = setting.y + 'px';

    requestAnimationFrame(playGame);
  } else {
    music.pause();
    btns.forEach(btn => btn.disabled = false);
    bestScore.innerHTML = `Your record ${showBestRecord()}`;
      if (setting.score > showBestRecord()) {
        sessionStorage.setItem('best', + setting.score);
        bestScore.innerHTML = `<span class="congrats">Congrats!</span> New record ${showBestRecord()}`;
      }
  }
}

function startRun(e) {
  if (keys.hasOwnProperty(e.key)) {
  e.preventDefault();
  keys[e.key] = true;
  }
}

function stopRun(e) {
  if (keys.hasOwnProperty(e.key)) {
    e.preventDefault();
    keys[e.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(line => {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if (line.y >= gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
    }

  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(item => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (carRect.top <= enemyRect.bottom
      && carRect.right >= enemyRect.left
      && carRect.left <= enemyRect.right
      && carRect.bottom >= enemyRect.top) {
      setting.start = false;
      // start.classList.remove('hide');
      // start.style.top = score.offsetHeight;
      }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    }

  });
}

function showBestRecord() {
    if (sessionStorage.getItem('best')) {
        return sessionStorage.getItem('best');
    } else {
        sessionStorage.setItem('best', 0);
        return sessionStorage.getItem('best');
    }
}

// Переключение громкости
function toggleVolume() {
  if (setting.volume === true) {
    music.muted = true;
    setting.volume = false;
    volume.style.background = `
    transparent
    url('image/mute.svg') 
    center / cover 
    no-repeat
    `;
  } else {
    music.muted = false;
    setting.volume = true;
    volume.style.background = `
    transparent
    url('image/volume.svg') 
    center / cover 
    no-repeat
    `;
  }
}

// const fibo = (n) => n <= 2 ? 1 : fibo(n - 1) + fibo(n -);
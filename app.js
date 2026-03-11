const gameListEl = document.getElementById('gameList');
const frameEl = document.getElementById('gameFrame');
const titleEl = document.getElementById('currentTitle');
const descriptionEl = document.getElementById('currentDescription');
const openDirectEl = document.getElementById('openDirect');
const reloadBtn = document.getElementById('reloadGame');
const fullscreenBtn = document.getElementById('toggleFullscreen');

let games = [];
let selectedGameId = null;

function setActiveGame(game) {
  selectedGameId = game.id;
  titleEl.textContent = game.name;
  descriptionEl.textContent = game.description;
  frameEl.src = game.path;
  openDirectEl.href = game.path;

  document.querySelectorAll('.game-card').forEach((card) => {
    card.classList.toggle('active', card.dataset.id === game.id);
  });
}

function renderGameCards() {
  gameListEl.innerHTML = '';

  games.forEach((game) => {
    const btn = document.createElement('button');
    btn.className = 'game-card';
    btn.dataset.id = game.id;
    btn.innerHTML = `${game.name}<small>${game.tags.join(' • ')}</small>`;
    btn.addEventListener('click', () => setActiveGame(game));
    gameListEl.appendChild(btn);
  });

  if (games.length > 0) {
    setActiveGame(games[0]);
  }
}

async function loadManifest() {
  try {
    const response = await fetch('games/manifest.json');
    if (!response.ok) throw new Error('Manifest fetch failed');
    const data = await response.json();
    games = data.games || [];
    renderGameCards();
  } catch (error) {
    titleEl.textContent = 'Could not load games';
    descriptionEl.textContent = 'Check games/manifest.json and make sure the server is running.';
  }
}

reloadBtn.addEventListener('click', () => {
  if (!selectedGameId) return;
  frameEl.src = frameEl.src;
});

fullscreenBtn.addEventListener('click', async () => {
  if (!document.fullscreenElement) {
    await frameEl.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});

loadManifest();
const games = [
  { id: "cookie", name: "🍪 Cookie Clicker" },
  { id: "slope", name: "🟢 Slope" },
  { id: "stickman", name: "🧍 Stickman Multiply" },
  { id: "hollow", name: "🗡️ Hollow Knight Mini" },
  { id: "bank", name: "💰 Bank Robbery" },
  { id: "runner", name: "🏃 Endless Runner" }
];

const gameList = document.getElementById("gameList");
const screens = Array.from(document.querySelectorAll(".game-screen"));

function showGame(id) {
  screens.forEach((screen) => screen.classList.toggle("active", screen.id === id));
  document.querySelectorAll(".game-btn").forEach((button) => button.classList.toggle("active", button.dataset.id === id));
}

games.forEach((game) => {
  const button = document.createElement("button");
  button.className = "game-btn";
  button.dataset.id = game.id;
  button.textContent = game.name;
  button.addEventListener("click", () => showGame(game.id));
  gameList.appendChild(button);
});

showGame("cookie");

// Cookie Clicker
const cookieState = { count: 0, cps: 0, grandma: 0, factory: 0, portal: 0 };
const cookieCountEl = document.getElementById("cookieCount");
const cookieRateEl = document.getElementById("cookieRate");

function updateCookieHud() {
  cookieCountEl.textContent = `Cookies: ${Math.floor(cookieState.count)}`;
  cookieRateEl.textContent = `Per second: ${cookieState.cps}`;
}

document.getElementById("cookieButton").onclick = () => {
  cookieState.count += 1;
  updateCookieHud();
};

document.getElementById("buyGrandma").onclick = () => {
  const cost = 25 + cookieState.grandma * 12;
  if (cookieState.count >= cost) {
    cookieState.count -= cost;
    cookieState.grandma += 1;
    cookieState.cps += 1;
  }
  updateCookieHud();
  document.getElementById("buyGrandma").textContent = `Buy Grandma (+1/s) - ${25 + cookieState.grandma * 12}`;
};

document.getElementById("buyFactory").onclick = () => {
  const cost = 120 + cookieState.factory * 55;
  if (cookieState.count >= cost) {
    cookieState.count -= cost;
    cookieState.factory += 1;
    cookieState.cps += 5;
  }
  updateCookieHud();
  document.getElementById("buyFactory").textContent = `Buy Factory (+5/s) - ${120 + cookieState.factory * 55}`;
};

document.getElementById("buyPortal").onclick = () => {
  const cost = 800 + cookieState.portal * 200;
  if (cookieState.count >= cost) {
    cookieState.count -= cost;
    cookieState.portal += 1;
    cookieState.cps += 20;
  }
  updateCookieHud();
  document.getElementById("buyPortal").textContent = `Buy Portal (+20/s) - ${800 + cookieState.portal * 200}`;
};

setInterval(() => {
  cookieState.count += cookieState.cps / 5;
  updateCookieHud();
}, 200);

// Shared keyboard state
const keys = {};
window.addEventListener("keydown", (event) => {
  keys[event.key.toLowerCase()] = true;
});
window.addEventListener("keyup", (event) => {
  keys[event.key.toLowerCase()] = false;
});

// Slope
const slopeCanvas = document.getElementById("slopeCanvas");
const sctx = slopeCanvas.getContext("2d");
const slopeScoreEl = document.getElementById("slopeScore");
let slope;

function resetSlope() {
  slope = { x: 370, y: 320, vx: 0, score: 0, alive: true, obstacles: [] };
}

function updateSlope() {
  if (!slope.alive) return;
  if (keys.arrowleft) slope.vx -= 0.4;
  if (keys.arrowright) slope.vx += 0.4;
  slope.vx *= 0.92;
  slope.x += slope.vx;
  slope.x = Math.max(10, Math.min(740, slope.x));
  if (Math.random() < 0.08) {
    slope.obstacles.push({ x: Math.random() * 720 + 20, y: -20, w: 30 + Math.random() * 40, h: 18, spd: 4 + Math.random() * 4 });
  }
  slope.obstacles.forEach((obstacle) => {
    obstacle.y += obstacle.spd;
  });
  slope.obstacles = slope.obstacles.filter((obstacle) => obstacle.y < 420);
  for (const obstacle of slope.obstacles) {
    if (slope.x > obstacle.x && slope.x < obstacle.x + obstacle.w && 338 > obstacle.y && 320 < obstacle.y + obstacle.h) {
      slope.alive = false;
    }
  }
  slope.score += 1;
  slopeScoreEl.textContent = `Score: ${slope.score}`;
}

function drawSlope() {
  sctx.fillStyle = "#0d1129";
  sctx.fillRect(0, 0, 760, 380);
  sctx.strokeStyle = "#2f3d9c";
  for (let i = 0; i < 20; i += 1) {
    sctx.beginPath();
    sctx.moveTo(i * 40, 0);
    sctx.lineTo(i * 40 - 120, 380);
    sctx.stroke();
  }
  sctx.fillStyle = "#ff6d8a";
  for (const obstacle of slope.obstacles) {
    sctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
  }
  sctx.fillStyle = "#8eff6d";
  sctx.beginPath();
  sctx.arc(slope.x, 330, 12, 0, Math.PI * 2);
  sctx.fill();
  if (!slope.alive) {
    sctx.fillStyle = "rgba(0,0,0,.55)";
    sctx.fillRect(0, 0, 760, 380);
    sctx.fillStyle = "#fff";
    sctx.font = "bold 36px Arial";
    sctx.fillText("Game Over", 280, 180);
  }
}

document.getElementById("slopeRestart").onclick = resetSlope;
resetSlope();

// Stickman Multiply
const stickmanCanvas = document.getElementById("stickmanCanvas");
const stx = stickmanCanvas.getContext("2d");
const stickmanCountEl = document.getElementById("stickmanCount");
let stickman;

function resetStickman() {
  stickman = { x: 370, count: 1, gates: [], timer: 0 };
}

function makeGate() {
  const type = Math.random() < 0.65 ? "mul" : "div";
  const value = type === "mul" ? [2, 3, 4][Math.floor(Math.random() * 3)] : [2, 3][Math.floor(Math.random() * 2)];
  return { x: Math.random() * 650 + 50, y: -40, w: 90, h: 24, type, value, used: false };
}

function updateStickman() {
  if (keys.a) stickman.x -= 5;
  if (keys.d) stickman.x += 5;
  stickman.x = Math.max(20, Math.min(740, stickman.x));
  stickman.timer += 1;
  if (stickman.timer % 28 === 0) stickman.gates.push(makeGate());
  stickman.gates.forEach((gate) => {
    gate.y += 3;
  });
  for (const gate of stickman.gates) {
    if (!gate.used && stickman.x > gate.x && stickman.x < gate.x + gate.w && 332 > gate.y && 332 < gate.y + gate.h + 10) {
      gate.used = true;
      if (gate.type === "mul") {
        stickman.count *= gate.value;
      } else {
        stickman.count = Math.max(1, Math.floor(stickman.count / gate.value));
      }
    }
  }
  stickman.gates = stickman.gates.filter((gate) => gate.y < 430);
  stickmanCountEl.textContent = `Stickmen: ${stickman.count}`;
}

function drawStickman() {
  stx.fillStyle = "#0d1129";
  stx.fillRect(0, 0, 760, 380);
  for (const gate of stickman.gates) {
    stx.fillStyle = gate.type === "mul" ? "#31c46f" : "#d44949";
    stx.fillRect(gate.x, gate.y, gate.w, gate.h);
    stx.fillStyle = "#fff";
    stx.font = "bold 18px Arial";
    stx.fillText(gate.type === "mul" ? `x${gate.value}` : `/${gate.value}`, gate.x + 30, gate.y + 18);
  }
  const drawCount = Math.min(24, stickman.count);
  for (let i = 0; i < drawCount; i += 1) {
    const sx = stickman.x - drawCount * 6 + i * 12;
    stx.strokeStyle = "#9ed0ff";
    stx.beginPath();
    stx.arc(sx, 320, 4, 0, Math.PI * 2);
    stx.stroke();
    stx.beginPath();
    stx.moveTo(sx, 324);
    stx.lineTo(sx, 336);
    stx.stroke();
  }
}

document.getElementById("stickmanRestart").onclick = resetStickman;
resetStickman();

// Hollow mini
const hollowCanvas = document.getElementById("hollowCanvas");
const hctx = hollowCanvas.getContext("2d");
const hollowHealthEl = document.getElementById("hollowHealth");
const hollowKillsEl = document.getElementById("hollowKills");
let hollow;

function resetHollow() {
  hollow = { x: 80, y: 300, vy: 0, onGround: true, hp: 5, kills: 0, enemies: [{ x: 520, hp: 2 }, { x: 650, hp: 2 }], atk: 0 };
}

function updateHollow() {
  if (hollow.hp <= 0) return;
  if (keys.a) hollow.x -= 4;
  if (keys.d) hollow.x += 4;
  hollow.x = Math.max(10, Math.min(730, hollow.x));
  if ((keys.w || keys[" "]) && hollow.onGround) {
    hollow.vy = -11;
    hollow.onGround = false;
  }
  hollow.vy += 0.5;
  hollow.y += hollow.vy;
  if (hollow.y >= 300) {
    hollow.y = 300;
    hollow.vy = 0;
    hollow.onGround = true;
  }
  if (keys.j && hollow.atk <= 0) hollow.atk = 12;
  if (hollow.atk > 0) hollow.atk -= 1;
  hollow.enemies.forEach((enemy) => {
    enemy.x += Math.sin(Date.now() / 400 + enemy.x) * 0.8;
    if (Math.abs(hollow.x - enemy.x) < 24 && Math.abs(hollow.y - 300) < 20 && hollow.atk === 0) hollow.hp -= 0.02;
    if (hollow.atk > 0 && Math.abs(hollow.x + 26 - enemy.x) < 26) enemy.hp -= 0.08;
  });
  const before = hollow.enemies.length;
  hollow.enemies = hollow.enemies.filter((enemy) => enemy.hp > 0);
  hollow.kills += before - hollow.enemies.length;
  if (hollow.enemies.length === 0) hollow.enemies.push({ x: 540 + Math.random() * 140, hp: 2.5 });
  hollowHealthEl.textContent = `Health: ${Math.max(0, hollow.hp).toFixed(1)}`;
  hollowKillsEl.textContent = `Kills: ${hollow.kills}`;
}

function drawHollow() {
  hctx.fillStyle = "#0b1025";
  hctx.fillRect(0, 0, 760, 380);
  hctx.fillStyle = "#242f70";
  hctx.fillRect(0, 340, 760, 40);
  hctx.fillStyle = "#d7e8ff";
  hctx.fillRect(hollow.x, hollow.y, 22, 32);
  if (hollow.atk > 0) {
    hctx.fillStyle = "#9ee3ff";
    hctx.fillRect(hollow.x + 24, hollow.y + 8, 20, 4);
  }
  hctx.fillStyle = "#ff8ea4";
  hollow.enemies.forEach((enemy) => hctx.fillRect(enemy.x, 304, 20, 28));
  if (hollow.hp <= 0) {
    hctx.fillStyle = "rgba(0,0,0,.6)";
    hctx.fillRect(0, 0, 760, 380);
    hctx.fillStyle = "#fff";
    hctx.font = "bold 34px Arial";
    hctx.fillText("You fell in battle", 230, 190);
  }
}

document.getElementById("hollowRestart").onclick = resetHollow;
resetHollow();

// Bank robbery
const bankCanvas = document.getElementById("bankCanvas");
const bctx = bankCanvas.getContext("2d");
const bankStatusEl = document.getElementById("bankStatus");
let bank;

function resetBank() {
  bank = {
    player: { x: 35, y: 35 },
    bags: Array.from({ length: 5 }, (_, index) => ({ x: 100 + index * 120, y: 70 + (index % 2) * 170, taken: false })),
    guards: [{ x: 220, y: 120, vx: 2, vy: 1.4 }, { x: 540, y: 280, vx: -1.6, vy: 1.2 }],
    exit: { x: 700, y: 320 },
    won: false,
    lost: false
  };
}

function updateBank() {
  if (bank.won || bank.lost) return;
  const { player } = bank;
  if (keys.arrowup) player.y -= 3;
  if (keys.arrowdown) player.y += 3;
  if (keys.arrowleft) player.x -= 3;
  if (keys.arrowright) player.x += 3;
  player.x = Math.max(10, Math.min(740, player.x));
  player.y = Math.max(10, Math.min(360, player.y));

  bank.guards.forEach((guard) => {
    guard.x += guard.vx;
    guard.y += guard.vy;
    if (guard.x < 10 || guard.x > 740) guard.vx *= -1;
    if (guard.y < 10 || guard.y > 360) guard.vy *= -1;
    if (Math.hypot(guard.x - player.x, guard.y - player.y) < 20) bank.lost = true;
  });

  bank.bags.forEach((bag) => {
    if (!bag.taken && Math.hypot(bag.x - player.x, bag.y - player.y) < 20) bag.taken = true;
  });

  const taken = bank.bags.filter((bag) => bag.taken).length;
  if (taken === bank.bags.length && Math.hypot(bank.exit.x - player.x, bank.exit.y - player.y) < 28) {
    bank.won = true;
  }
  bankStatusEl.textContent = `Bags: ${taken} / ${bank.bags.length}`;
}

function drawBank() {
  bctx.fillStyle = "#101633";
  bctx.fillRect(0, 0, 760, 380);
  bctx.strokeStyle = "#2f3f88";
  bctx.strokeRect(15, 15, 730, 350);
  bctx.fillStyle = "#52ffa9";
  bctx.fillRect(bank.exit.x - 10, bank.exit.y - 10, 20, 20);
  bank.bags.forEach((bag) => {
    if (!bag.taken) {
      bctx.fillStyle = "#ffd36a";
      bctx.fillRect(bag.x - 7, bag.y - 7, 14, 14);
    }
  });
  bctx.fillStyle = "#6dd3ff";
  bctx.fillRect(bank.player.x - 8, bank.player.y - 8, 16, 16);
  bctx.fillStyle = "#ff6d8a";
  bank.guards.forEach((guard) => bctx.fillRect(guard.x - 8, guard.y - 8, 16, 16));
  if (bank.won || bank.lost) {
    bctx.fillStyle = "rgba(0,0,0,.55)";
    bctx.fillRect(0, 0, 760, 380);
    bctx.fillStyle = "#fff";
    bctx.font = "bold 34px Arial";
    bctx.fillText(bank.won ? "Escape successful!" : "Caught by guards!", 220, 190);
  }
}

document.getElementById("bankRestart").onclick = resetBank;
resetBank();

// Runner
const runnerCanvas = document.getElementById("runnerCanvas");
const rctx = runnerCanvas.getContext("2d");
const runnerScoreEl = document.getElementById("runnerScore");
let runner;

function resetRunner() {
  runner = { y: 300, vy: 0, onGround: true, score: 0, obstacles: [], dead: false, t: 0 };
}

function updateRunner() {
  if (runner.dead) return;
  if ((keys[" "] || keys.arrowup) && runner.onGround) {
    runner.vy = -12;
    runner.onGround = false;
  }
  runner.vy += 0.6;
  runner.y += runner.vy;
  if (runner.y >= 300) {
    runner.y = 300;
    runner.vy = 0;
    runner.onGround = true;
  }
  runner.t += 1;
  if (runner.t % 45 === 0) runner.obstacles.push({ x: 760, w: 18 + Math.random() * 24, h: 20 + Math.random() * 35 });
  runner.obstacles.forEach((obstacle) => {
    obstacle.x -= 6.5;
  });
  for (const obstacle of runner.obstacles) {
    if (40 < obstacle.x + obstacle.w && 58 > obstacle.x && runner.y + 30 > 340 - obstacle.h) runner.dead = true;
  }
  runner.obstacles = runner.obstacles.filter((obstacle) => obstacle.x + obstacle.w > -5);
  runner.score += 1;
  runnerScoreEl.textContent = `Score: ${runner.score}`;
}

function drawRunner() {
  rctx.fillStyle = "#101633";
  rctx.fillRect(0, 0, 760, 380);
  rctx.fillStyle = "#39458f";
  rctx.fillRect(0, 340, 760, 40);
  rctx.fillStyle = "#8eff6d";
  rctx.fillRect(40, runner.y, 18, 30);
  rctx.fillStyle = "#ffb16d";
  runner.obstacles.forEach((obstacle) => rctx.fillRect(obstacle.x, 340 - obstacle.h, obstacle.w, obstacle.h));
  if (runner.dead) {
    rctx.fillStyle = "rgba(0,0,0,.55)";
    rctx.fillRect(0, 0, 760, 380);
    rctx.fillStyle = "#fff";
    rctx.font = "bold 34px Arial";
    rctx.fillText("Runner crashed", 260, 180);
  }
}

document.getElementById("runnerRestart").onclick = resetRunner;
resetRunner();

function loop() {
  updateSlope();
  drawSlope();
  updateStickman();
  drawStickman();
  updateHollow();
  drawHollow();
  updateBank();
  drawBank();
  updateRunner();
  drawRunner();
  requestAnimationFrame(loop);
}

loop();

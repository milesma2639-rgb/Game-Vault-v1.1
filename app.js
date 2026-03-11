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
